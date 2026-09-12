import crypto from "node:crypto";
import { createServer, type Server } from "node:http";
import express from "express";
import { describe, expect, it } from "vitest";
import {
  DeliveryReplayGuard,
  createGitHubDeliveryRouter,
  parsePublishedRelease,
  PROVIDER_READY_SIGNAL,
  verifyGitHubSignature,
} from "./githubDelivery";

const secret = "test-only-github-webhook-secret";
const releasePayload = {
  action: "published",
  release: { id: 4815162342, tag_name: "v0.1.0" },
  repository: { full_name: "uniqueteamyemen/paylock-core" },
};

function sign(rawBody: Buffer) {
  return `sha256=${crypto.createHmac("sha256", secret).update(rawBody).digest("hex")}`;
}

async function startTestReceiver() {
  const app = express();
  app.use(express.raw({ type: "application/json", limit: "64kb" }));
  app.use(
    "/hook",
    createGitHubDeliveryRouter({
      getSecret: () => secret,
      replayGuard: new DeliveryReplayGuard(),
    }),
  );

  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not bind a TCP port.");

  return {
    server,
    url: `http://127.0.0.1:${address.port}/hook`,
  };
}

async function stop(server: Server) {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

describe("GitHub release fulfilment boundary", () => {
  it("validates a signed delivery with the configured project secret", async () => {
    process.env.GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || secret;
    const configuredSecret = process.env.GITHUB_WEBHOOK_SECRET;
    expect(configuredSecret).toBeTruthy();

    const app = express();
    app.use(express.raw({ type: "application/json", limit: "64kb" }));
    app.use("/hook", createGitHubDeliveryRouter());
    const server = createServer(app);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Test server did not bind a TCP port.");

    const rawBody = Buffer.from(JSON.stringify(releasePayload));
    const signature = `sha256=${crypto
      .createHmac("sha256", configuredSecret!)
      .update(rawBody)
      .digest("hex")}`;

    try {
      const response = await fetch(`http://127.0.0.1:${address.port}/hook`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-github-event": "release",
          "x-github-delivery": "delivery-configured-secret-1000",
          "x-hub-signature-256": signature,
        },
        body: rawBody,
      });
      expect(response.status).toBe(202);
    } finally {
      await stop(server);
    }
  });

  it("accepts only a valid HMAC over the exact payload bytes", () => {
    const rawBody = Buffer.from(JSON.stringify(releasePayload));

    expect(verifyGitHubSignature(rawBody, secret, sign(rawBody))).toBe(true);
    expect(verifyGitHubSignature(Buffer.from(`${rawBody}x`), secret, sign(rawBody))).toBe(false);
    expect(verifyGitHubSignature(rawBody, secret, "sha256=not-a-valid-signature")).toBe(false);
  });

  it("creates a provider-ready candidate only for a published release", () => {
    expect(parsePublishedRelease(releasePayload)).toEqual({
      source: "github",
      canonicalSignal: PROVIDER_READY_SIGNAL,
      fulfilmentState: "provider_ready",
      providerReference: "github-release:uniqueteamyemen/paylock-core:4815162342",
    });
    expect(parsePublishedRelease({ ...releasePayload, action: "created" })).toBeUndefined();
  });

  it("does not let unrelated external metadata alter the fulfilment candidate", () => {
    const withUnrelatedMetadata = {
      ...releasePayload,
      external_metadata: { arbitrary_status: "ignored", amount_like_value: 12345 },
    };

    expect(parsePublishedRelease(withUnrelatedMetadata)).toEqual(parsePublishedRelease(releasePayload));
  });

  it("ignores an already claimed delivery and permits it again only after the bounded test window", () => {
    let time = 1_000;
    const guard = new DeliveryReplayGuard(500, () => time);

    expect(guard.claim("delivery-0001")).toBe(true);
    expect(guard.claim("delivery-0001")).toBe(false);
    time += 501;
    expect(guard.claim("delivery-0001")).toBe(true);
  });

  it("accepts a signed provider-ready delivery and rejects an altered delivery", async () => {
    const { server, url } = await startTestReceiver();
    const rawBody = Buffer.from(JSON.stringify(releasePayload));

    try {
      const accepted = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-github-event": "release",
          "x-github-delivery": "delivery-1001",
          "x-hub-signature-256": sign(rawBody),
        },
        body: rawBody,
      });
      expect(accepted.status).toBe(202);
      await expect(accepted.json()).resolves.toMatchObject({
        disposition: "provider_ready_candidate_received",
        candidate: { canonicalSignal: PROVIDER_READY_SIGNAL },
      });

      const tampered = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-github-event": "release",
          "x-github-delivery": "delivery-1002",
          "x-hub-signature-256": sign(rawBody),
        },
        body: Buffer.from(`${rawBody}x`),
      });
      expect(tampered.status).toBe(401);
    } finally {
      await stop(server);
    }
  });

  it("does not create a second candidate for a duplicated external delivery", async () => {
    const { server, url } = await startTestReceiver();
    const rawBody = Buffer.from(JSON.stringify(releasePayload));
    const headers = {
      "content-type": "application/json",
      "x-github-event": "release",
      "x-github-delivery": "delivery-1003",
      "x-hub-signature-256": sign(rawBody),
    };

    try {
      const first = await fetch(url, { method: "POST", headers, body: rawBody });
      const duplicate = await fetch(url, { method: "POST", headers, body: rawBody });

      await expect(first.json()).resolves.toMatchObject({
        disposition: "provider_ready_candidate_received",
      });
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
