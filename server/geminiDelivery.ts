import crypto from "node:crypto";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { Router as createRouter, type Request, type Response, type Router } from "express";

/**
 * Narrow, non-production receiver for Gemini dynamic-webhook evidence only.
 * A verified event is retained only as a transient completion observation. It
 * does not call PayLock Core, create H0/H1, inspect payment data, or expose
 * generated service output.
 */
export const GEMINI_DYNAMIC_JWKS_URL = "https://generativelanguage.googleapis.com/.well-known/jwks.json";
export const GEMINI_TEST_WEBHOOK_URI =
  "https://3000-iee7v1p3b3ibobz5eqpdk-b125e599.us4.manus.computer/api/test-webhooks/gemini";
export const GEMINI_COMPLETION_EVENTS = new Set(["interaction.completed", "interaction.failed"]);
export const GEMINI_WEBHOOK_MAX_AGE_MS = 5 * 60 * 1000;

type RecordValue = Record<string, unknown>;

export type GeminiCompletionObservation = {
  source: "gemini";
  eventType: "interaction.completed" | "interaction.failed";
  interactionId: string;
};

export type GeminiWebhookRouterOptions = {
  getAudience?: () => string | undefined;
  verifySignature?: GeminiDynamicSignatureVerifier;
  replayGuard?: GeminiDeliveryReplayGuard;
  now?: () => number;
};

export type GeminiDynamicSignatureVerifier = (signature: string, audience: string) => Promise<JWTPayload>;

const googleJwks = createRemoteJWKSet(new URL(GEMINI_DYNAMIC_JWKS_URL));

function asRecord(value: unknown): RecordValue | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as RecordValue)
    : undefined;
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Verify the JWT supplied in Gemini's `Webhook-Signature` header against the
 * documented Google JWKS endpoint and the endpoint's configured audience.
 */
export async function verifyGeminiDynamicSignature(signature: string, audience: string): Promise<JWTPayload> {
  const verified = await jwtVerify(signature, googleJwks, {
    algorithms: ["RS256"],
    audience,
  });
  return verified.payload;
}

/** Parse only thin completion metadata; the model output intentionally remains out of scope. */
export function parseGeminiCompletionEvent(payload: unknown): GeminiCompletionObservation | undefined {
  const event = asRecord(payload);
  const eventType = asNonEmptyString(event?.type);
  const data = asRecord(event?.data);
  const interactionId = asNonEmptyString(data?.id);

  if (
    (eventType !== "interaction.completed" && eventType !== "interaction.failed") ||
    !interactionId
  ) {
    return undefined;
  }

  return {
    source: "gemini",
    eventType,
    interactionId,
  };
}

/** Process-local deduplication is sufficient only for this short, controlled test window. */
export class GeminiDeliveryReplayGuard {
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
  return Boolean(value && /^[A-Za-z0-9_-]{8,256}$/.test(value));
}

export function isRecentWebhookTimestamp(
  timestampHeader: string | undefined,
  now: number = Date.now(),
  maxAgeMs: number = GEMINI_WEBHOOK_MAX_AGE_MS,
): boolean {
  if (!timestampHeader || !/^\d{10,13}$/.test(timestampHeader)) return false;
  const rawTimestamp = Number(timestampHeader);
  const timestampMs = timestampHeader.length === 13 ? rawTimestamp : rawTimestamp * 1000;
  return Number.isFinite(timestampMs) && Math.abs(now - timestampMs) <= maxAgeMs;
}

function asRawBody(request: Request): Buffer | undefined {
  return Buffer.isBuffer(request.body) ? request.body : undefined;
}

function fingerprint(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}

/**
 * Creates the Gemini route. The deployment may override the test audience with
 * GEMINI_WEBHOOK_AUDIENCE; the default is scoped to this explicit test URI.
 */
export function createGeminiDeliveryRouter(options: GeminiWebhookRouterOptions = {}): Router {
  const router = createRouter();
  const getAudience = options.getAudience ?? (() => process.env.GEMINI_WEBHOOK_AUDIENCE ?? GEMINI_TEST_WEBHOOK_URI);
  const verifySignature = options.verifySignature ?? verifyGeminiDynamicSignature;
  const now = options.now ?? (() => Date.now());
  const replayGuard = options.replayGuard ?? new GeminiDeliveryReplayGuard();

  router.post("/", async (request: Request, response: Response) => {
    const audience = getAudience();
    if (!audience) {
      response.status(503).json({ error: "Gemini webhook receiver is not configured." });
      return;
    }

    const rawBody = asRawBody(request);
    const signature = request.header("webhook-signature");
    const deliveryId = request.header("webhook-id");
    const timestamp = request.header("webhook-timestamp");

    if (!rawBody || !signature) {
      response.status(400).json({ error: "Missing Gemini webhook body or signature." });
      return;
    }

    if (!isRecentWebhookTimestamp(timestamp, now())) {
      response.status(400).json({ error: "Expired or invalid Gemini webhook timestamp." });
      return;
    }

    if (!isPlausibleDeliveryId(deliveryId)) {
      response.status(400).json({ error: "Missing or invalid Gemini delivery identifier." });
      return;
    }

    try {
      await verifySignature(signature, audience);
    } catch {
      response.status(401).json({ error: "Invalid Gemini webhook signature." });
      return;
    }

    if (!replayGuard.claim(deliveryId)) {
      response.status(202).json({ accepted: true, duplicate: true, disposition: "ignored" });
      return;
    }

    try {
      const event = JSON.parse(rawBody.toString("utf8"));
      const observation = parseGeminiCompletionEvent(event);
      if (!observation) {
        response.status(202).json({ accepted: true, disposition: "event_not_in_test_scope" });
        return;
      }

      // No persistence, model-output processing, Core invocation, or delivery-control action occurs here.
      console.info(
        "[Gemini completion evidence]",
        JSON.stringify({
          source: observation.source,
          eventType: observation.eventType,
          deliveryFingerprint: fingerprint(deliveryId),
          interactionFingerprint: fingerprint(observation.interactionId),
        }),
      );
      response.status(202).json({
        accepted: true,
        disposition: "gemini_completion_observed",
        observation,
      });
    } catch {
      response.status(400).json({ error: "Gemini webhook body must be valid JSON." });
    }
  });

  return router;
}
