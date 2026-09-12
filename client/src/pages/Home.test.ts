import { describe, expect, it } from "vitest";
import { detailSteps, evidencePrinciples, homepageMessage, portfolio, primaryNavigation, workplaceExamples } from "./Home";

describe("DS&D Reference Mark homepage", () => {
  it("keeps the method in a deliberate notice-to-action order", () => {
    expect(detailSteps.map((step) => step.label)).toEqual(["Notice", "Name", "Reference", "Act"]);
  });

  it("keeps PayLock separate from payment processing and preserves research boundaries", () => {
    expect(portfolio[0]).toMatchObject({ name: "PayLock", readiness: "Product direction", href: "/paylock" });
    expect(portfolio[0]?.copy).toContain("does not create a new payment system");
    expect(portfolio[1]?.copy).toContain("does not claim to eliminate jitter or accelerate latency");
    expect(portfolio[2]?.copy).toContain("not presented as hardware qualification");
  });

  it("keeps evidence language explicit and public navigation reachable", () => {
    expect(evidencePrinciples.map((item) => item.title)).toEqual(["What we know", "What remains open", "What can happen now"]);
    expect(primaryNavigation.map((item) => item.href)).toEqual(["#method", "/catalog", "#examples", "#work", "#evidence", "/paylock", "#contact"]);
    expect(primaryNavigation.find((item) => item.href === "/paylock")?.product).toBe(true);
  });

  it("frames avoidable difficulty as apparently compulsory rather than consciously chosen", () => {
    expect(homepageMessage.lead).toBe("What appears compulsory");
    expect(homepageMessage.accent).toBe("may not be.");
    expect(homepageMessage.copy).toContain("as if it were a fixed condition");
    expect(homepageMessage.emphasis).toContain("do not promise to remove every constraint");
    expect(detailSteps[0]?.copy).toContain("appear compulsory");
  });

  it("uses practical examples to examine a burden before choosing among constrained options", () => {
    expect(workplaceExamples).toHaveLength(4);
    expect(workplaceExamples[0]?.alternative).toContain("shared rule");
    expect(workplaceExamples[3]?.appears).toContain("two bad options");
    expect(workplaceExamples[3]?.alternative).toContain("outside the offered choices");
  });
});
