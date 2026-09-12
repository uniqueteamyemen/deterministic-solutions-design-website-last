import { z } from "zod";

export const inquiryTopics = ["architecture", "paylock", "research", "partnership", "other"] as const;

export const inquiryReferralSources = ["direct", "search", "linkedin", "github", "referral", "event", "publication", "other"] as const;

export const inquiryTopicLabels: Record<(typeof inquiryTopics)[number], string> = {
  architecture: "System architecture",
  paylock: "PayLock evaluation",
  research: "Research collaboration",
  partnership: "Partnership",
  other: "Other",
};

export const inquiryReferralSourceLabels: Record<(typeof inquiryReferralSources)[number], string> = {
  direct: "A direct DS&D link",
  search: "Search",
  linkedin: "LinkedIn",
  github: "GitHub",
  referral: "A colleague or partner",
  event: "A talk, event, or community",
  publication: "A publication or research record",
  other: "Other",
};

export const inquiryReferralSourceDescriptions: Record<(typeof inquiryReferralSources)[number], string> = {
  direct: "A bookmarked or shared DS&D link.",
  search: "A search result or research query.",
  linkedin: "A DS&D or PayLock post on LinkedIn.",
  github: "A source repository or engineering record.",
  referral: "A person who knows the work.",
  event: "A conversation, talk, or community signal.",
  publication: "A technical article, paper, or evidence record.",
  other: "Another path to the work.",
};

export const inquirySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name.").max(120, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(320, "Email is too long."),
  organization: z.string().trim().max(160, "Organization is too long.").optional().default(""),
  topic: z.enum(inquiryTopics),
  referralSource: z.enum(inquiryReferralSources).default("direct"),
  message: z.string().trim().min(20, "Please provide at least 20 characters.").max(4000, "Message is too long."),
  // This hidden field is deliberately accepted at validation time. The server
  // treats any populated value as automation and returns without persistence.
  website: z.string().max(200).optional().default(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
