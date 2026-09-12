import { createServer, type Server } from "node:http";
import express from "express";
import { describe, expect, it } from "vitest";
import {
  GeminiDeliveryReplayGuard,
  createGeminiDeliveryRouter,
  isRecentWebhookTimestamp,
  parseGeminiCompletionEvent,
} from "./geminiDelivery";

const audience = "https://example.test/api/test-webhooks/gemini";
const now = 1_780_000_000_000;
const completionPayload = {
  type: "interaction.completed",
  version: "v1",
  timestamp: "2026-08-18T12:00:00Z",
  data: { id: "interaction_123456" },
};

async function startTestReceiver(options: Parameters<typeof createGeminiDeliveryRouter>[0] = {}) {
  const app = express();
  app.use(express.raw({ type: "application/json", limit: "64kb" }));
  app.use(
    "/hook",
    createGeminiDeliveryRouter({
      getAudience: () => audience,
      now: () => now,
      verifySignature: async () => ({ aud: audience }),
      ...options,
    }),
  );

  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test receiver did not bind a TCP port.");
  return { server, url: `http://127.0.0.1:${address.port}/hook` };
}

async function stop(server: Server) {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function headers(deliveryId = "gemini-delivery-1001", timestamp = String(Math.floor(now / 1000))) {
  return {
    "content-type": "application/json",
    "webhook-id": deliveryId,
    "webhook-signature": "test-only-jws-signature",
    "webhook-timestamp": timestamp,
  };
}

describe("Gemini dynamic completion evidence boundary", () => {
  it("recognizes only thin interaction completion metadata", () => {
    expect(parseGeminiCompletionEvent(completionPayload)).toEqual({
      source: "gemini",
      eventType: "interaction.completed",
      interactionId: "interaction_123456",
    });
    expect(parseGeminiCompletionEvent({ type: "batch.succeeded", data: { id: "batch_1" } })).toBeUndefined();
  });

  it("accepts only a timestamp inside the five-minute replay window", () => {
    expect(isRecentWebhookTimestamp(String(Math.floor(now / 1000)), now)).toBe(true);
    expect(isRecentWebhookTimestamp(String(Math.floor((now - 300_001) / 1000)), now)).toBe(false);
    expect(isRecentWebhookTimestamp("not-a-time", now)).toBe(false);
  });

  it("accepts a verified completion without forwarding it to PayLock", async () => {
    const { server, url } = await startTestReceiver();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(completionPayload),
      });
      expect(response.status).toBe(202);
      await expect(response.json()).resolves.toEqual({
        accepted: true,
        disposition: "gemini_completion_observed",
        observation: {
          source: "gemini",
          eventType: "interaction.completed",
          interactionId: "interaction_123456",
        },
      });
    } finally {
      await stop(server);
    }
  });

  it("rejects stale webhook timestamps before a signature verifier can be called", async () => {
    let verifierCalled = false;
    const { server, url } = await startTestReceiver({
      verifySignature: async () => {
        verifierCalled = true;
        return { aud: audience };
      },
    });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers("gemini-delivery-1002", String(Math.floor((now - 301_000) / 1000))),
        body: JSON.stringify(completionPayload),
      });
      expect(response.status).toBe(400);
      expect(verifierCalled).toBe(false);
    } finally {
      await stop(server);
    }
  });

  it("rejects an invalid dynamic signature", async () => {
    const { server, url } = await startTestReceiver({
      verifySignature: async () => {
        throw new Error("invalid JWT");
      },
    });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers("gemini-delivery-1003"),
        body: JSON.stringify(completionPayload),
      });
      expect(response.status).toBe(401);
    } finally {
      await stop(server);
    }
  });

  it("suppresses a duplicated, independently verified delivery", async () => {
    const replayGuard = new GeminiDeliveryReplayGuard(10 * 60 * 1000, () => now);
    const { server, url } = await startTestReceiver({ replayGuard });
    try {
      const first = await fetch(url, {
        method: "POST",
        headers: headers("gemini-delivery-1004"),
        body: JSON.stringify(completionPayload),
      });
      const duplicate = await fetch(url, {
        method: "POST",
        headers: headers("gemini-delivery-1004"),
        body: JSON.stringify(completionPayload),
      });
      expect(first.status).toBe(202);
      await expect(duplicate.json()).resolves.toEqual({
        accepted: true,
        duplicate: true,
        disposition: "ignored",
      });
    } finally {
      await stop(server);
    }
  });
});
