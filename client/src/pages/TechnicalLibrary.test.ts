import { describe, expect, it } from "vitest";
import { libraryRecords } from "./TechnicalLibrary";

describe("technical library evidence records", () => {
  it("contains direct entries for completed gem5, CXL-aware simulation, RTL, pre-hardware, and HC-CXL records", () => {
    expect(libraryRecords).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "ssdd-gem5-baseline", status: "COMPLETED / MODEL-SCOPED" }),
      expect.objectContaining({ id: "ssdd-controlled-matrix", status: "COMPLETED / MODEL-SCOPED" }),
      expect.objectContaining({ id: "ssdd-prehardware", status: "COMPLETED / MODEL-SCOPED" }),
      expect.objectContaining({ id: "ssdd-simcxl-limited", status: "COMPLETED / SIMULATION-ONLY" }),
      expect.objectContaining({ id: "ssdd-rtl-ssc", status: "COMPLETED / BOUNDED CONTRACT" }),
      expect.objectContaining({ id: "hc-cxl-reference", status: "REFERENCE ASSUMPTIONS / VALIDATION PENDING" }),
    ]));
  });

  it("keeps the model-scoped and research boundaries explicit in each record", () => {
    expect(libraryRecords.find((record) => record.id === "ssdd-gem5-baseline")?.boundary).toContain("not hardware validation");
    expect(libraryRecords.find((record) => record.id === "ssdd-controlled-matrix")?.boundary).toContain("does not measure physical memory latency");
    expect(libraryRecords.find((record) => record.id === "ssdd-prehardware")?.boundary).toContain("not a hardware");
    expect(libraryRecords.find((record) => record.id === "ssdd-prehardware")?.facts).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "100 / 100", label: "Python / Rust reference chain hashes" }),
      expect.objectContaining({ value: "9 / 9", label: "Q32.32 boundary outcomes" }),
    ]));
    expect(libraryRecords.find((record) => record.id === "ssdd-simcxl-limited")?.boundary).toContain("CXL-aware simulation evidence only");
    expect(libraryRecords.find((record) => record.id === "ssdd-simcxl-limited")?.boundary).toContain("does not establish physical CXL behavior");
    expect(libraryRecords.find((record) => record.id === "ssdd-rtl-ssc")?.boundary).toContain("not timing closure");
    expect(libraryRecords.find((record) => record.id === "ssdd-rtl-ssc")?.facts).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "128 / 128", label: "reference-vector batches accepted" }),
    ]));
    expect(libraryRecords.find((record) => record.id === "hc-cxl-reference")?.boundary).toContain("not measured hardware behavior");
  });

  it("adds public-safe PayLock excerpts without treating local or connectivity checks as a live integration", () => {
    const adapterExperiment = libraryRecords.find((record) => record.id === "paylock-adapter-local-experiment");
    const connectivityCheck = libraryRecords.find((record) => record.id === "paylock-github-signed-connectivity");

    expect(adapterExperiment?.status).toBe("COMPLETED / LOCAL-ONLY");
    expect(adapterExperiment?.facts).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "6 / 6", label: "local acceptance checks passed" }),
      expect.objectContaining({ value: "0", label: "H0 values in asserted external responses" }),
    ]));
    expect(adapterExperiment?.excerpt?.scope).toContain("technical delivery evidence only");
    expect(adapterExperiment?.boundary).toContain("not evidence of a live provider integration");
    expect(connectivityCheck?.facts).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "202", label: "signed ping response" }),
      expect.objectContaining({ value: "2 / 2", label: "ping and authorized redelivery accepted" }),
    ]));
    expect(connectivityCheck?.excerpt?.scope).toContain("does not demonstrate a release lifecycle");
  });

  it("links documented Zenodo records without representing them as peer-reviewed or independent validation", () => {
    const hcCxlZenodo = libraryRecords.find((record) => record.id === "hc-cxl-zenodo-lineage");
    const ssddZenodo = libraryRecords.find((record) => record.id === "ssdd-zenodo-record");

    expect(hcCxlZenodo?.route.href).toBe("https://doi.org/10.5281/zenodo.17969945");
    expect(hcCxlZenodo?.facts).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "5", label: "linked documented records" }),
    ]));
    expect(hcCxlZenodo?.boundary).toContain("do not by themselves establish peer review");
    expect(ssddZenodo?.route.href).toBe("https://doi.org/10.5281/zenodo.19098717");
    expect(ssddZenodo?.copy).toContain("documented public research record");
    expect(ssddZenodo?.boundary).toContain("independently verified");
  });
});
