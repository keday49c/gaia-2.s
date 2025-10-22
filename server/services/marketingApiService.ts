import axios, { AxiosInstance } from "axios";
import crypto from "crypto";

/**
 * Marketing API Service
 * Handles integration with Google Ads, Meta Ads, TikTok Ads, and other platforms
 */

export interface GoogleAdsConfig {
  customerId: string;
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface MetaAdsConfig {
  accessToken: string;
  accountId: string;
  appSecret: string;
}

export interface TikTokAdsConfig {
  accessToken: string;
  advertiserId: string;
  appId: string;
  appSecret: string;
}

export class MarketingApiService {
  private googleAdsClient: AxiosInstance | null = null;
  private metaAdsClient: AxiosInstance | null = null;
  private tiktokAdsClient: AxiosInstance | null = null;

  /**
   * Initialize Google Ads API client
   */
  initializeGoogleAds(config: GoogleAdsConfig) {
    this.googleAdsClient = axios.create({
      baseURL: "https://googleads.googleapis.com/v17",
      headers: {
        "developer-token": config.developerToken,
        "login-customer-id": config.customerId,
      },
    });
  }

  /**
   * Initialize Meta Ads API client
   */
  initializeMetaAds(config: MetaAdsConfig) {
    this.metaAdsClient = axios.create({
      baseURL: "https://graph.instagram.com/v18.0",
      params: {
        access_token: config.accessToken,
      },
    });
  }

  /**
   * Initialize TikTok Ads API client
   */
  initializeTikTokAds(config: TikTokAdsConfig) {
    this.tiktokAdsClient = axios.create({
      baseURL: "https://ads.tiktok.com/open_api/v1.3",
      headers: {
        "Access-Token": config.accessToken,
      },
    });
  }

  /**
   * Create a campaign on Google Ads
   */
  async createGoogleAdsCampaign(campaignData: {
    name: string;
    budget: number;
    status: string;
  }) {
    if (!this.googleAdsClient) {
      throw new Error("Google Ads client not initialized");
    }

    try {
      const response = await this.googleAdsClient.post("/customers/campaigns", {
        campaign: {
          name: campaignData.name,
          status: campaignData.status,
          advertisingChannelType: "SEARCH",
          biddingStrategyType: "MAXIMIZE_CONVERSIONS",
          dailyBudgetMicros: campaignData.budget * 1000000,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating Google Ads campaign:", error);
      throw error;
    }
  }

  /**
   * Create a campaign on Meta Ads
   */
  async createMetaAdsCampaign(campaignData: {
    name: string;
    budget: number;
    objective: string;
    accountId: string;
  }) {
    if (!this.metaAdsClient) {
      throw new Error("Meta Ads client not initialized");
    }

    try {
      const response = await this.metaAdsClient.post(
        `/${campaignData.accountId}/campaigns`,
        {
          name: campaignData.name,
          objective: campaignData.objective,
          status: "PAUSED",
          daily_budget: campaignData.budget * 100,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating Meta Ads campaign:", error);
      throw error;
    }
  }

  /**
   * Create a campaign on TikTok Ads
   */
  async createTikTokAdsCampaign(campaignData: {
    name: string;
    budget: number;
    objective: string;
    advertiserId: string;
  }) {
    if (!this.tiktokAdsClient) {
      throw new Error("TikTok Ads client not initialized");
    }

    try {
      const response = await this.tiktokAdsClient.post("/campaign/create", {
        advertiser_id: campaignData.advertiserId,
        campaign_name: campaignData.name,
        objective_type: campaignData.objective,
        budget: campaignData.budget,
        budget_mode: "DAILY",
      });

      return response.data;
    } catch (error) {
      console.error("Error creating TikTok Ads campaign:", error);
      throw error;
    }
  }

  /**
   * Get campaign metrics from Google Ads
   */
  async getGoogleAdsMetrics(campaignId: string) {
    if (!this.googleAdsClient) {
      throw new Error("Google Ads client not initialized");
    }

    try {
      const response = await this.googleAdsClient.post("/customers/googleAds/search", {
        query: `
          SELECT
            campaign.id,
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.conversions,
            metrics.cost_micros
          WHERE campaign.id = ${campaignId}
        `,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching Google Ads metrics:", error);
      throw error;
    }
  }

  /**
   * Get campaign metrics from Meta Ads
   */
  async getMetaAdsMetrics(campaignId: string) {
    if (!this.metaAdsClient) {
      throw new Error("Meta Ads client not initialized");
    }

    try {
      const response = await this.metaAdsClient.get(`/${campaignId}/insights`, {
        params: {
          fields: "impressions,clicks,actions,spend",
          date_preset: "last_7d",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching Meta Ads metrics:", error);
      throw error;
    }
  }

  /**
   * Get campaign metrics from TikTok Ads
   */
  async getTikTokAdsMetrics(campaignId: string) {
    if (!this.tiktokAdsClient) {
      throw new Error("TikTok Ads client not initialized");
    }

    try {
      const response = await this.tiktokAdsClient.get("/campaign/get", {
        params: {
          campaign_ids: [campaignId],
          fields: "impressions,clicks,conversions,spend",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching TikTok Ads metrics:", error);
      throw error;
    }
  }

  /**
   * Encrypt sensitive credentials
   */
  static encryptCredential(credential: string, encryptionKey: string): string {
    const key = crypto.scryptSync(encryptionKey, "salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(credential, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  }

  /**
   * Decrypt sensitive credentials
   */
  static decryptCredential(encrypted: string, encryptionKey: string): string {
    const key = crypto.scryptSync(encryptionKey, "salt", 32);
    const parts = encrypted.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(parts[1], "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  /**
   * Validate API credentials
   */
  async validateCredentials(platform: string, credentials: any): Promise<boolean> {
    try {
      switch (platform) {
        case "google_ads":
          this.initializeGoogleAds(credentials);
          await this.googleAdsClient?.get("/customers");
          return true;

        case "meta_ads":
          this.initializeMetaAds(credentials);
          await this.metaAdsClient?.get("/me");
          return true;

        case "tiktok_ads":
          this.initializeTikTokAds(credentials);
          await this.tiktokAdsClient?.get("/advertiser/get");
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error(`Credential validation failed for ${platform}:`, error);
      return false;
    }
  }
}

export const marketingApiService = new MarketingApiService();

