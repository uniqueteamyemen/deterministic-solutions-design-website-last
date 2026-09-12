import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const appSource = readFileSync(fileURLToPath(new URL("./App.tsx", import.meta.url)), "utf8");

describe("public route manifest", () => {
  it("keeps both the concise and canonical technical-library routes available", () => {
    expect(appSource).toContain('<Route path={"/library"} component={TechnicalLibrary} />');
    expect(appSource).toContain('<Route path={"/technical-library"} component={TechnicalLibrary} />');
  });

  it("registers the public DS&D and PayLock explanatory catalogs", () => {
    expect(appSource).toContain('<Route path={"/catalog"} component={Catalog} />');
    expect(appSource).toContain('<Route path={"/paylock/catalog"} component={PayLockCatalog} />');
  });
});
