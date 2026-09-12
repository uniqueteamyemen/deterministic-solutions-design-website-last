import crypto from "node:crypto";
import { Router as createRouter, type Request, type Response, type Router } from "express";

/**
 * A deliberately narrow edge receiver for the first PayLock evidence route.
 * It accepts a signed GitHub `release` webhook only when GitHub declares a
 * release published. It does not forward to PayLock Core yet; a separately
 * approved provider-specific Adapter is required before any Core call.
 */
export const GITHUB_RELEASE_EVENT = "release";
export const PROVIDER_READY_SIGNAL = "provider_ack";

type RecordValue = Record<string, unknown>;

export type FulfilmentCandidate = {
  source: "github";
  canonicalSignal: typeof PROVIDER_READY_SIGNAL;
  fulfilmentState: "provider_ready";
  providerReference: string;
};

export type GitHubWebhookRouterOptions = {
  getSecret?: () => string | undefined;
  replayGuard?: DeliveryReplayGuard;
};

function asRecord(value: unknown): RecordValue | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as RecordValue)
    : undefined;
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

/** Verify the GitHub SHA-256 HMAC over the exact, unparsed request bytes. */
export function verifyGitHubSignature(rawBody: Buffer, secret: string, signatureHeader?: string): boolean {
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const expected = `sha256=${crypto.createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const received = Buffer.from(signatureHeader, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return received.length === expectedBuffer.length && crypto.timingSafeEqual(received, expectedBuffer);
}

/**
 * Translate only a published GitHub release into a provider-ready candidate.
 * Any unrelated payload fields are intentionally ignored.
 */
export function parsePublishedRelease(payload: unknown): FulfilmentCandidate | undefined {
  const root = asRecord(payload);
  if (!root || root.action !== "published") return undefined;

  const release = asRecord(root.release);
  const repository = asRecord(root.repository);
  const releaseId = asNonEmptyString(release?.id);
  const repositoryName = asNonEmptyString(repository?.full_name);
  if (!releaseId || !repositoryName) return undefined;

  return {
    source: "github",
    canonicalSignal: PROVIDER_READY_SIGNAL,
    fulfilmentState: "provider_ready",
    providerReference: `github-release:${repositoryName}:${releaseId}`,
  };
}

/**
 * Process-local duplicate guard for the controlled evidence exercise. The
 * eventual production Adapter must use durable, tenant-scoped idempotency.
 */
export class DeliveryReplayGuard {
  private readonly deliveries = new Map<string, number>();

  constructor(
    private readonly ttlMs = 10 * 60 * 1000,
    private readonly now: () => number = () => Date.now(),
  ) {}

  claim(deliveryId: string): boolean {
    const currentTime = this.now();
    this.deliveries.forEach((expiresAt, id) => {
      if (expiresAt <= currentTime) this.deliveries.delete(id);
    });

    if (this.deliveries.has(deliveryId)) return false;
    this.deliveries.set(deliveryId, currentTime + this.ttlMs);
    return true;
  }
}

function isPlausibleDeliveryId(value: string | undefined): value is string {
  return Boolean(value && /^[A-Za-z0-9-]{8,128}$/.test(value));
}

function asRawBody(request: Request): Buffer | undefined {
  return Buffer.isBuffer(request.body) ? request.body : undefined;
}

export function createGitHubDeliveryRouter(options: GitHubWebhookRouterOptions = {}): Router {
  const router = createRouter();
  const getSecret = options.getSecret ?? (() => process.env.GITHUB_WEBHOOK_SECRET);
  const replayGuard = options.replayGuard ?? new DeliveryReplayGuard();

  router.post("/", (request: Request, response: Response) => {
    const secret = getSecret();
    if (!secret) {
      response.status(503).json({ error: "Webhook receiver is not configured." });
      return;
    }

    const rawBody = asRawBody(request);
    const signature = request.header("x-hub-signature-256");
    if (!rawBody || !verifyGitHubSignature(rawBody, secret, signature)) {
      response.status(401).json({ error: "Invalid webhook signature." });
      return;
    }

    const deliveryId = request.header("x-github-delivery");
    if (!isPlausibleDeliveryId(deliveryId)) {
      response.status(400).json({ error: "Missing or invalid delivery identifier." });
      return;
    }

    if (!replayGuard.claim(deliveryId)) {
      response.status(202).json({ accepted: true, duplicate: true, disposition: "ignored" });
      return;
    }

    if (request.header("x-github-event") !== GITHUB_RELEASE_EVENT) {
      response.status(202).json({ accepted: true, disposition: "event_not_in_test_scope" });
      return;
    }

    try {
      const candidate = parsePublishedRelease(JSON.parse(rawBody.toString("utf8")));
      if (!candidate) {
        response.status(202).json({ accepted: true, disposition: "release_not_ready" });
        return;
      }

      // The candidate is deliberately not persisted or sent to Core in this phase.
      // A user-approved adapter test will be the next, separately bounded step.
      response.status(202).json({
        accepted: true,
        disposition: "provider_ready_candidate_received",
        candidate,
      });
    } catch {
      response.status(400).json({ error: "Webhook body must be valid JSON." });
    }
  });

  return router;
}
