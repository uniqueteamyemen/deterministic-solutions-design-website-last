import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const inquiryTopics = ["architecture", "paylock", "research", "partnership", "other"] as const;
export const inquiryStatuses = ["new", "read", "closed"] as const;
export const inquiryReferralSources = ["direct", "search", "linkedin", "github", "referral", "event", "publication", "other"] as const;

/**
 * Public contact requests. The record stores only the information that a
 * visitor explicitly provides for follow-up; no session identity or tracking
 * data is retained in this table.
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  organization: varchar("organization", { length: 160 }),
  topic: mysqlEnum("topic", inquiryTopics).notNull(),
  message: text("message").notNull(),
  sourcePath: varchar("sourcePath", { length: 255 }).notNull().default("/contact"),
  referralSource: mysqlEnum("referralSource", inquiryReferralSources).notNull().default("direct"),
  status: mysqlEnum("status", inquiryStatuses).notNull().default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;
