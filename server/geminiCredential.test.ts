import { describe, expect, it } from "vitest";

describe("Gemini test credential", () => {
  it.skipIf(!process.env.GEMINI_API_KEY)(
    "validates the configured Google-issued key through the official models endpoint without sending content",
    async () => {
      const apiKey = process.env.GEMINI_API_KEY;
      expect(apiKey).toBeTruthy();

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
        headers: {
          "x-goog-api-key": apiKey!,
        },
        signal: AbortSignal.timeout(15_000),
      });

      expect(response.ok, `Gemini credential validation returned HTTP ${response.status}`).toBe(true);

      const body = (await response.json()) as { models?: unknown[] };
      expect(Array.isArray(body.models)).toBe(true);
      expect(body.models?.length).toBeGreaterThan(0);
    },
    20_000,
  );
});
