import { describe, expect, it } from "vitest";

describe("development refresh agent source", () => {
  it("uses the HTTP refresh endpoint rather than a WebSocket transport", async () => {
    const source = await import("./dev-refresh-agent?raw");

    expect(source.default).toContain("/__manus__/dev-refresh");
    expect(source.default).not.toContain("WebSocket(");
    expect(source.default).toContain("window.location.reload()");
  });
});
