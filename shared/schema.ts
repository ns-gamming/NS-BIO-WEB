import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  imageUrl: text("image_url"),
  readTime: integer("read_time").notNull(),
  views: integer("views").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const polls = pgTable("polls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  votes: text("votes").array().notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visitorStats = pgTable("visitor_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull().unique(),
  count: integer("count").default(0).notNull(),
});

export const toolUsage = pgTable("tool_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolName: text("tool_name").notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  lastUsed: timestamp("last_used").defaultNow().notNull(),
});

export const toolRateLimits = pgTable("tool_rate_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ip: text("ip").notNull(),
  toolName: text("tool_name").notNull(),
  usedAt: timestamp("used_at").defaultNow().notNull(),
});

export const blogShares = pgTable("blog_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blogSlug: text("blog_slug").notNull(),
  platform: text("platform").notNull(),
  sharedAt: timestamp("shared_at").defaultNow().notNull(),
});

export const userFeedback = pgTable("user_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  email: text("email"),
  feedbackType: text("feedback_type").notNull(),
  message: text("message").notNull(),
  rating: integer("rating"),
  pageUrl: text("page_url").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const contactFeedback = pgTable("contact_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  rating: integer("rating").notNull(),
  userIp: text("user_ip"),
  userAgent: text("user_agent"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const ffInfoSearches = pgTable("ff_info_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text("ip_address").notNull(),
  uid: text("uid").notNull(),
  region: text("region").notNull(),
  searchDate: text("search_date").notNull(),
  searchedAt: timestamp("searched_at").defaultNow().notNull(),
});

export const ffInfoRateLimits = pgTable("ff_info_rate_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text("ip_address").notNull().unique(),
  searchCount: integer("search_count").default(0).notNull(),
  lastResetDate: text("last_reset_date").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ffCompareVipAccess = pgTable("ff_compare_vip_access", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text("ip_address").notNull().unique(),
  isVip: boolean("is_vip").default(false).notNull(),
  vipExpiresAt: timestamp("vip_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ffCompareRateLimits = pgTable("ff_compare_rate_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text("ip_address").notNull().unique(),
  compareCount: integer("compare_count").default(0).notNull(),
  lastResetDate: text("last_reset_date").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ffCompareHistory = pgTable("ff_compare_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text("ip_address").notNull(),
  player1Uid: text("player1_uid").notNull(),
  player1Region: text("player1_region").notNull(),
  player2Uid: text("player2_uid").notNull(),
  player2Region: text("player2_region").notNull(),
  player1Score: integer("player1_score").notNull(),
  player2Score: integer("player2_score").notNull(),
  winnerUid: text("winner_uid").notNull(),
  analysis: text("analysis").notNull(),
  comparedAt: timestamp("compared_at").defaultNow().notNull(),
});

export const ffCompareFeedback = pgTable("ff_compare_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  comparisonId: text("comparison_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  helpful: boolean("helpful"),
  ipAddress: text("ip_address"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  views: true,
  createdAt: true,
});

export const insertPollSchema = createInsertSchema(polls).omit({
  id: true,
  createdAt: true,
});

export const insertVisitorStatSchema = createInsertSchema(visitorStats).omit({
  id: true,
});

export const insertToolUsageSchema = createInsertSchema(toolUsage).omit({
  id: true,
  lastUsed: true,
});

export const insertToolRateLimitSchema = createInsertSchema(toolRateLimits).omit({
  id: true,
  usedAt: true,
});

export const insertBlogShareSchema = createInsertSchema(blogShares).omit({
  id: true,
  sharedAt: true,
});

export const insertUserFeedbackSchema = createInsertSchema(userFeedback).omit({
  id: true,
  submittedAt: true,
});

export const insertContactFeedbackSchema = createInsertSchema(contactFeedback).omit({
  id: true,
  submittedAt: true,
});

export const insertFfInfoSearchSchema = createInsertSchema(ffInfoSearches).omit({
  id: true,
  searchedAt: true,
});

export const insertFfInfoRateLimitSchema = createInsertSchema(ffInfoRateLimits).omit({
  id: true,
  updatedAt: true,
});

export const insertFfCompareVipAccessSchema = createInsertSchema(ffCompareVipAccess).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFfCompareRateLimitSchema = createInsertSchema(ffCompareRateLimits).omit({
  id: true,
  updatedAt: true,
});

export const insertFfCompareHistorySchema = createInsertSchema(ffCompareHistory).omit({
  id: true,
  comparedAt: true,
});

export const insertFfCompareFeedbackSchema = createInsertSchema(ffCompareFeedback).omit({
  id: true,
  submittedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Poll = typeof polls.$inferSelect;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type VisitorStat = typeof visitorStats.$inferSelect;
export type InsertVisitorStat = z.infer<typeof insertVisitorStatSchema>;
export type ToolUsage = typeof toolUsage.$inferSelect;
export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;
export type ToolRateLimit = typeof toolRateLimits.$inferSelect;
export type InsertToolRateLimit = z.infer<typeof insertToolRateLimitSchema>;
export type BlogShare = typeof blogShares.$inferSelect;
export type InsertBlogShare = z.infer<typeof insertBlogShareSchema>;
export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = z.infer<typeof insertUserFeedbackSchema>;
export type ContactFeedback = typeof contactFeedback.$inferSelect;
export type InsertContactFeedback = z.infer<typeof insertContactFeedbackSchema>;
export type FfInfoSearch = typeof ffInfoSearches.$inferSelect;
export type InsertFfInfoSearch = z.infer<typeof insertFfInfoSearchSchema>;
export type FfInfoRateLimit = typeof ffInfoRateLimits.$inferSelect;
export type InsertFfInfoRateLimit = z.infer<typeof insertFfInfoRateLimitSchema>;
export type FfCompareVipAccess = typeof ffCompareVipAccess.$inferSelect;
export type InsertFfCompareVipAccess = z.infer<typeof insertFfCompareVipAccessSchema>;
export type FfCompareRateLimit = typeof ffCompareRateLimits.$inferSelect;
export type InsertFfCompareRateLimit = z.infer<typeof insertFfCompareRateLimitSchema>;
export type FfCompareHistory = typeof ffCompareHistory.$inferSelect;
export type InsertFfCompareHistory = z.infer<typeof insertFfCompareHistorySchema>;
export type FfCompareFeedback = typeof ffCompareFeedback.$inferSelect;
export type InsertFfCompareFeedback = z.infer<typeof insertFfCompareFeedbackSchema>;
