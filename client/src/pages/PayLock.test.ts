import { describe, expect, it } from "vitest";
import { implementationStatus } from "./PayLock";

describe("PayLock reviewed implementation status", () => {
  it("separates reviewed Core behavior from integration work and a bounded signed-connectivity check", () => {
    expect(implementationStatus).toHaveLength(5);
    expect(implementationStatus.find((item) => item.title === "Bound request")?.state).toBe("IMPLEMENTED");
    expect(implementationStatus.find((item) => item.title === "Current H1 condition")?.copy).toContain("technical delivery evidence only");
    expect(implementationStatus.find((item) => item.title === "Provider-to-access path")?.state).toBe("REQUIRED");
    expect(implementationStatus.find((item) => item.title === "Signed connectivity")?.copy).toContain("not a live release or Core transition");
  });
});
