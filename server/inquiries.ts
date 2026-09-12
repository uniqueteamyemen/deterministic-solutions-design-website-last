import type { Request, Response, Router } from "express";
import { Router as createRouter } from "express";
import { inquirySchema } from "../shared/inquiry";
import { firestore, collection, addDoc, serverTimestamp } from "./firebase";

const WINDOW_MS = 10 * 60 * 1000;
const REQUEST_LIMIT = 10;
const requestsByAddress = new Map<string, { count: number; resetAt: number }>();
const TEAM_NOTIFICATION_EMAIL = "baker@deterministicsolutionsdesign.com";

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

  // Health and routing status
  router.get("/", async (_request: Request, response: Response) => {
    response.json({
      status: "active",
      recipientEmail: TEAM_NOTIFICATION_EMAIL,
      channel: "managed-inquiry-gateway",
    });
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

    const newRecord = {
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
      serverTimestamp: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(firestore, "inquiries"), newRecord);
      console.info(`[Firestore] Inquiry recorded successfully for ${TEAM_NOTIFICATION_EMAIL} with ID: ${docRef.id}`);
      response.status(201).json({
        accepted: true,
        id: docRef.id,
        recipient: TEAM_NOTIFICATION_EMAIL,
        channel: "firestore",
      });
    } catch (error) {
      console.error("[Firestore] Failed to store inquiry:", error);
      response.status(503).json({
        error: "The inquiry service is temporarily unavailable. Please email baker@deterministicsolutionsdesign.com directly.",
      });
    }
  });

  return router;
}
