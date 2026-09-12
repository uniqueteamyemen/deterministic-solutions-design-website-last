import type { Request, Response, Router } from "express";
import { Router as createRouter } from "express";
import { inquirySchema } from "../shared/inquiry";
import { firestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "./firebase";

const WINDOW_MS = 10 * 60 * 1000;
const REQUEST_LIMIT = 10;
const requestsByAddress = new Map<string, { count: number; resetAt: number }>();
const TEAM_NOTIFICATION_EMAIL = "baker@deterministicsolutionsdesign.com";

// Resilient memory cache to ensure high availability across environments
interface StoredInquiry {
  id: string;
  fullName: string;
  email: string;
  organization?: string | null;
  topic: string;
  message: string;
  recipient: string;
  sourcePath: string;
  referralSource: string;
  status: string;
  createdAt: string;
}

const inMemoryInquiries: StoredInquiry[] = [];

function canSubmit(request: Request) {
  const now = Date.now();
  const address = request.ip || request.socket.remoteAddress || "unknown";
  const window = requestsByAddress.get(address);
  if (!window || window.resetAt <= now) {
    requestsByAddress.set(address, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (window.count >= REQUEST_LIMIT) return false;
  window.count += 1;
  return true;
}

export function createInquiryRouter(): Router {
  const router = createRouter();

  // Internal discussion & message history space
  router.get("/", async (_request: Request, response: Response) => {
    try {
      const q = query(collection(firestore, "inquiries"), orderBy("createdAt", "desc"), limit(40));
      const snapshot = await getDocs(q);
      const inquiries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      response.json({ inquiries, recipientEmail: TEAM_NOTIFICATION_EMAIL, source: "firestore" });
    } catch (error) {
      console.warn("[Firestore] Reading via Firestore encountered error, serving internal memory buffer:", error);
      response.json({ inquiries: inMemoryInquiries, recipientEmail: TEAM_NOTIFICATION_EMAIL, source: "buffer" });
    }
  });

  router.post("/", async (request: Request, response: Response) => {
    const parsed = inquirySchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(422).json({ error: "Please review the highlighted fields." });
      return;
    }
    if (parsed.data.website) {
      // Honeypot requests receive a generic acknowledgement and create no record.
      response.status(202).json({ accepted: true });
      return;
    }
    if (!canSubmit(request)) {
      response.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }

    const newRecord: StoredInquiry = {
      id: "inq_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      organization: parsed.data.organization || null,
      topic: parsed.data.topic,
      message: parsed.data.message,
      recipient: TEAM_NOTIFICATION_EMAIL,
      sourcePath: "/contact",
      referralSource: parsed.data.referralSource,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    inMemoryInquiries.unshift(newRecord);
    if (inMemoryInquiries.length > 100) inMemoryInquiries.pop();

    try {
      const docRef = await addDoc(collection(firestore, "inquiries"), {
        ...newRecord,
        serverTimestamp: serverTimestamp(),
      });
      console.info(`[Firestore] Inquiry recorded successfully for ${TEAM_NOTIFICATION_EMAIL} with ID: ${docRef.id}`);
      response.status(201).json({ accepted: true, id: docRef.id, recipient: TEAM_NOTIFICATION_EMAIL, channel: "firestore" });
    } catch (error) {
      console.warn("[Firestore] Inquiry recorded to local buffer (Firestore fallback):", error);
      response.status(201).json({ accepted: true, id: newRecord.id, recipient: TEAM_NOTIFICATION_EMAIL, channel: "buffer" });
    }
  });

  return router;
}
