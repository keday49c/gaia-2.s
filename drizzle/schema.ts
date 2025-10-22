import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription plans table
 */
export const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  monthlyPrice: varchar("monthlyPrice", { length: 20 }).notNull(), // Store as string for precision
  features: text("features"), // JSON array of features
  maxCampaigns: varchar("maxCampaigns", { length: 20 }),
  maxUsers: varchar("maxUsers", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * User subscriptions table
 */
export const userSubscriptions = mysqlTable("userSubscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  planId: varchar("planId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "cancelled", "expired"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow(),
  endDate: timestamp("endDate"),
  paymentMethod: varchar("paymentMethod", { length: 50 }), // pix, boleto, credit_card
  transactionId: varchar("transactionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

/**
 * API Credentials vault (encrypted)
 */
export const apiCredentials = mysqlTable("apiCredentials", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  platform: varchar("platform", { length: 100 }).notNull(), // google_ads, meta_ads, tiktok_ads, openai, gemini, elevenlabs, etc
  credentialKey: varchar("credentialKey", { length: 255 }).notNull(), // Encrypted credential
  credentialSecret: text("credentialSecret"), // Encrypted secret
  isActive: varchar("isActive", { length: 5 }).default("true"),
  lastValidated: timestamp("lastValidated"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type ApiCredential = typeof apiCredentials.$inferSelect;
export type InsertApiCredential = typeof apiCredentials.$inferInsert;

/**
 * Marketing campaigns table
 */
export const campaigns = mysqlTable("campaigns", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  platform: varchar("platform", { length: 100 }).notNull(), // google_ads, meta_ads, tiktok_ads, organic, etc
  status: mysqlEnum("status", ["draft", "scheduled", "active", "paused", "completed", "failed"]).default("draft").notNull(),
  budget: varchar("budget", { length: 20 }), // Daily or total budget
  targetAudience: text("targetAudience"), // JSON object with demographics
  keywords: text("keywords"), // JSON array
  creativeAssets: text("creativeAssets"), // JSON array of asset URLs
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * Campaign metrics/analytics
 */
export const campaignMetrics = mysqlTable("campaignMetrics", {
  id: varchar("id", { length: 64 }).primaryKey(),
  campaignId: varchar("campaignId", { length: 64 }).notNull(),
  date: timestamp("date").defaultNow(),
  impressions: varchar("impressions", { length: 20 }).default("0"),
  clicks: varchar("clicks", { length: 20 }).default("0"),
  conversions: varchar("conversions", { length: 20 }).default("0"),
  spend: varchar("spend", { length: 20 }).default("0"),
  revenue: varchar("revenue", { length: 20 }).default("0"),
  ctr: varchar("ctr", { length: 20 }), // Click-through rate
  roas: varchar("roas", { length: 20 }), // Return on ad spend
  createdAt: timestamp("createdAt").defaultNow(),
});

export type CampaignMetric = typeof campaignMetrics.$inferSelect;
export type InsertCampaignMetric = typeof campaignMetrics.$inferInsert;

/**
 * Audit logs for security
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }),
  action: varchar("action", { length: 255 }).notNull(),
  resource: varchar("resource", { length: 255 }),
  resourceId: varchar("resourceId", { length: 255 }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  status: varchar("status", { length: 50 }), // success, failure
  details: text("details"), // JSON with additional info
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * CRM integration data
 */
export const crmLeads = mysqlTable("crmLeads", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  source: varchar("source", { length: 100 }), // campaign_id or platform
  status: varchar("status", { length: 50 }).default("new"), // new, qualified, contacted, converted, lost
  notes: text("notes"),
  metadata: text("metadata"), // JSON with custom fields
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type CrmLead = typeof crmLeads.$inferSelect;
export type InsertCrmLead = typeof crmLeads.$inferInsert;

/**
 * WhatsApp bot interactions
 */
export const whatsappInteractions = mysqlTable("whatsappInteractions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  leadId: varchar("leadId", { length: 64 }),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  messageType: varchar("messageType", { length: 50 }), // text, image, audio, video
  messageContent: text("messageContent"),
  senderType: varchar("senderType", { length: 20 }), // bot, user
  status: varchar("status", { length: 50 }), // sent, delivered, read, failed
  createdAt: timestamp("createdAt").defaultNow(),
});

export type WhatsappInteraction = typeof whatsappInteractions.$inferSelect;
export type InsertWhatsappInteraction = typeof whatsappInteractions.$inferInsert;
