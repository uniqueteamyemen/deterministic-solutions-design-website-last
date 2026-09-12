import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("quality pipeline", () => {
  it("uses the same complete quality gate locally and in CI", () => {
    const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")) as { scripts: Record<string, string> };
    const workflow = readFileSync(resolve(process.cwd(), ".github/workflows/website-ci.yml"), "utf8");

    expect(packageJson.scripts.quality).toBe("pnpm test && pnpm check && pnpm build");
    expect(workflow).toContain("run: pnpm quality");
  });
});
