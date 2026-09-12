import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("public metadata", () => {
  it("uses the approved DS&D promise and omits the retired Signal/State social image", () => {
    const document = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

    expect(document).toContain("Make the detail clear.");
    expect(document).toContain("the next shared action reliable");
    expect(document).not.toContain("Digital systems you can verify");
    expect(document).not.toContain("hero-signal-grid");
  });
});
