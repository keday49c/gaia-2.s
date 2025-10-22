import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, campaigns, Campaign, InsertCampaign, apiCredentials, ApiCredential, InsertApiCredential, userSubscriptions, UserSubscription, subscriptionPlans, SubscriptionPlan, auditLogs, InsertAuditLog, crmLeads, CrmLead, InsertCrmLead, campaignMetrics, InsertCampaignMetric, whatsappInteractions, InsertWhatsappInteraction } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Campaign queries
 */
export async function createCampaign(campaign: InsertCampaign): Promise<Campaign | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  try {
    const result = await db.insert(campaigns).values(campaign);
    const created = await db.select().from(campaigns).where(eq(campaigns.id, campaign.id)).limit(1);
    return created.length > 0 ? created[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create campaign:", error);
    throw error;
  }
}

export async function getCampaignsByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(campaigns).where(eq(campaigns.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get campaigns:", error);
    return [];
  }
}

/**
 * API Credentials queries
 */
export async function saveApiCredential(credential: InsertApiCredential): Promise<ApiCredential | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  try {
    await db.insert(apiCredentials).values(credential);
    const saved = await db.select().from(apiCredentials).where(eq(apiCredentials.id, credential.id)).limit(1);
    return saved.length > 0 ? saved[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to save API credential:", error);
    throw error;
  }
}

export async function getApiCredentialsByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(apiCredentials).where(eq(apiCredentials.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get API credentials:", error);
    return [];
  }
}

/**
 * Subscription queries
 */
export async function getUserSubscription(userId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  try {
    const result = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user subscription:", error);
    return undefined;
  }
}

export async function getSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(subscriptionPlans);
  } catch (error) {
    console.error("[Database] Failed to get subscription plans:", error);
    return [];
  }
}

/**
 * Audit log queries
 */
export async function createAuditLog(log: InsertAuditLog): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  try {
    await db.insert(auditLogs).values(log);
  } catch (error) {
    console.error("[Database] Failed to create audit log:", error);
  }
}

/**
 * CRM Lead queries
 */
export async function createCrmLead(lead: InsertCrmLead): Promise<CrmLead | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  try {
    await db.insert(crmLeads).values(lead);
    const created = await db.select().from(crmLeads).where(eq(crmLeads.id, lead.id)).limit(1);
    return created.length > 0 ? created[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create CRM lead:", error);
    throw error;
  }
}

export async function getCrmLeadsByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(crmLeads).where(eq(crmLeads.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get CRM leads:", error);
    return [];
  }
}

/**
 * Campaign metrics queries
 */
export async function recordCampaignMetric(metric: InsertCampaignMetric): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  try {
    await db.insert(campaignMetrics).values(metric);
  } catch (error) {
    console.error("[Database] Failed to record campaign metric:", error);
  }
}

export async function getCampaignMetrics(campaignId: string) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(campaignMetrics).where(eq(campaignMetrics.campaignId, campaignId));
  } catch (error) {
    console.error("[Database] Failed to get campaign metrics:", error);
    return [];
  }
}

/**
 * WhatsApp interaction queries
 */
export async function createWhatsappInteraction(interaction: InsertWhatsappInteraction): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  try {
    await db.insert(whatsappInteractions).values(interaction);
  } catch (error) {
    console.error("[Database] Failed to create WhatsApp interaction:", error);
  }
}
