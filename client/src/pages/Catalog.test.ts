import { describe, expect, it } from "vitest";
import { catalogFiles } from "./Catalog";
import { paylockCatalogSections } from "./PayLockCatalog";

describe("explanatory catalog content", () => {
  it("keeps the DS&D catalog roles distinct and routed", () => {
    expect(catalogFiles.map((file) => file.href)).toEqual(["/about", "/paylock/catalog", "/ssdd", "/hc-cxl"]);
    expect(catalogFiles[1]?.summary).toContain("not payment processing");
    expect(catalogFiles[2]?.status).toBe("Research & validation");
  });

  it("keeps PayLock proof language bounded", () => {
    expect(paylockCatalogSections).toHaveLength(3);
    expect(paylockCatalogSections[2]?.copy).toContain("delivery evidence only");
    expect(paylockCatalogSections.map((section) => section.title)).toEqual(["Bind the request", "Read the signals", "Issue the record"]);
  });
});
