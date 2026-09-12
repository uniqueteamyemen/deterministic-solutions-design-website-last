import { describe, expect, it } from "vitest";
import { nextLinks, operatingLogic, pageMap } from "./InstitutionalPage";

describe("institutional research evidence", () => {
  it("frames SSDD as a model-scoped pre-hardware record", () => {
    const evidence = pageMap.ssdd.researchEvidence;

    expect(evidence?.status).toContain("MODEL-SCOPED");
    expect(evidence?.measures).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "128 / 128" }),
      expect.objectContaining({ value: "100 / 100" }),
      expect.objectContaining({ value: "4 / 4" }),
      expect.objectContaining({ value: "9 / 9" }),
      expect.objectContaining({ value: "8 → 128" }),
    ]));
    expect(evidence?.caveat).toContain("not hardware validation");
    expect(evidence?.libraryId).toBe("ssdd-prehardware");
  });

  it("keeps HC-CXL explicitly in research and validation framing", () => {
    const page = pageMap["hc-cxl"];

    expect(page.eyebrow).toContain("Research rebuild");
    expect(page.researchEvidence?.status).toContain("VALIDATION PENDING");
    expect(page.visual?.src).toContain("HC-CXLdeterministicexecutionmodelinfographic");
    expect(page.researchEvidence?.libraryId).toBe("hc-cxl-reference");
  });

  it("names PayLock as the sole commercial offering in the institutional narrative", () => {
    expect(pageMap.about.sections[2]?.copy).toContain("PayLock is DS&D's commercial offering");
  });

  it("keeps inline PayLock evidence excerpts readable while preserving their limits", () => {
    const evidence = pageMap.evidence.productEvidence;

    expect(evidence?.measures).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "6 / 6" }),
      expect.objectContaining({ value: "202" }),
      expect.objectContaining({ value: "2 / 2" }),
    ]));
    expect(evidence?.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ result: "LOCAL" }),
      expect.objectContaining({ result: "SIGNED" }),
      expect.objectContaining({ result: "OPEN" }),
    ]));
    expect(evidence?.caveat).toContain("not production certificates");
    expect(evidence?.caveat).toContain("Neither establishes payment");
    expect(evidence?.routes).toHaveLength(2);
  });

  it("states DS&D's international LLC identity without exposing private registration details", () => {
    expect(pageMap.about.intro).toContain("New Mexico, USA company");
    expect(pageMap.about.intro).toContain("working internationally");
    expect(pageMap.about.intro).not.toContain("1209 Mountain");
  });

  it("makes PayLock the first onward route from every institutional page", () => {
    expect(Object.values(nextLinks).every((links) => links[0]?.href === "/paylock")).toBe(true);
  });

  it("gives every institutional route a distinct field-reading context", () => {
    const pages = Object.values(pageMap);
    const fieldKickers = pages.map((page) => page.fieldKicker);

    expect(fieldKickers.every(Boolean)).toBe(true);
    expect(new Set(fieldKickers).size).toBe(pages.length);
    expect(pageMap.evidence.fieldCopy).toContain("observed result");
    expect(pageMap.contact.fieldTitle).toBeDefined();
  });

  it("keeps the shared office method focused on visible details and proportionate action", () => {
    expect(operatingLogic.map((step) => step.label)).toEqual(["NOTICE", "NAME", "REFERENCE", "ACT"]);
    expect(operatingLogic[2]?.value).toContain("reliable rule");
    expect(operatingLogic[3]?.value).toContain("proportionate");
  });
});
