import { describe, expect, it } from "vitest";
import { inquirySchema } from "@shared/inquiry";

const validInquiry = {
  fullName: "Amina Example",
  email: "amina@example.com",
  organization: "Example Systems",
  topic: "architecture",
  referralSource: "github",
  message: "We need a governed execution review for a production-bound system.",
  website: "",
};

describe("managed inquiry input contract", () => {
  it("accepts a bounded, well-formed inquiry", () => {
    expect(inquirySchema.safeParse(validInquiry).success).toBe(true);
  });

  it("rejects invalid contact data and short messages", () => {
    expect(inquirySchema.safeParse({ ...validInquiry, email: "not-an-email" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...validInquiry, message: "Too short" }).success).toBe(false);
  });

  it("recognizes a populated anti-automation honeypot", () => {
    const parsed = inquirySchema.parse({ ...validInquiry, website: "automation.example" });
    expect(parsed.website).toBe("automation.example");
  });

  it("accepts only the defined referral-source vocabulary and defaults a missing value", () => {
    expect(inquirySchema.safeParse({ ...validInquiry, referralSource: "unknown-network" }).success).toBe(false);
    expect(inquirySchema.parse({ ...validInquiry, referralSource: undefined }).referralSource).toBe("direct");
  });
});
