import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { campaignAutomationService } from "./services/campaignAutomationService";
import { contentGenerationService } from "./services/contentGenerationService";
import { voiceSynthesisService } from "./services/voiceSynthesisService";
import { contentAnalysisService } from "./services/contentAnalysisService";
import { subscriptionService } from "./services/subscriptionService";
import { analyticsService } from "./services/analyticsService";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  campaigns: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getCampaignsByUser(ctx.user.id)
    ),
    create: protectedProcedure
      .input((val: any) => val)
      .mutation(({ ctx, input }) => {
        const id = `campaign_${Date.now()}`;
        return db.createCampaign({
          id,
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  credentials: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getApiCredentialsByUser(ctx.user.id)
    ),
    save: protectedProcedure
      .input((val: any) => val)
      .mutation(({ ctx, input }) => {
        const id = `cred_${Date.now()}`;
        return db.saveApiCredential({
          id,
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  subscriptions: router({
    getPlans: publicProcedure.query(() => db.getSubscriptionPlans()),
    getUserPlan: protectedProcedure.query(({ ctx }) =>
      db.getUserSubscription(ctx.user.id)
    ),
  }),

  crm: router({
    getLeads: protectedProcedure.query(({ ctx }) =>
      db.getCrmLeadsByUser(ctx.user.id)
    ),
    createLead: protectedProcedure
      .input((val: any) => val)
      .mutation(({ ctx, input }) => {
        const id = `lead_${Date.now()}`;
        return db.createCrmLead({
          id,
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  analytics: router({
    getCampaignMetrics: protectedProcedure
      .input((val: any) => val)
      .query(({ input }) => db.getCampaignMetrics(input.campaignId)),
  }),

  automation: router({
    createAutomatedCampaign: protectedProcedure
      .input((val: any) => val)
      .mutation(({ ctx, input }) =>
        campaignAutomationService.createAutomatedCampaign(ctx.user.id, input)
      ),
    fetchMetrics: protectedProcedure
      .input((val: any) => val)
      .mutation(({ input }) =>
        campaignAutomationService.fetchAndRecordMetrics(input.campaignId, input.platform)
      ),
    optimizeCampaign: protectedProcedure
      .input((val: any) => val)
      .query(({ input }) =>
        campaignAutomationService.optimizeCampaign(input.campaignId, input.metrics)
      ),
  }),

  content: router({
    generate: protectedProcedure
      .input((val: any) => val)
      .mutation(({ ctx, input }) => {
        if (!contentGenerationService.isInitialized()) {
          throw new Error("Content generation service not initialized. Configure API keys.");
        }
        return contentGenerationService.generateContent(input);
      }),
    analyze: publicProcedure
      .input((val: any) => val)
      .query(({ input }) => {
        return contentAnalysisService.analyzeContent(input.content, input.platform);
      }),
    optimizeForSEO: protectedProcedure
      .input((val: any) => val)
      .mutation(({ input }) => {
        if (!contentGenerationService.isInitialized()) {
          throw new Error("Content generation service not initialized.");
        }
        return contentGenerationService.optimizeForSEO(input.content, input.keywords);
      }),
  }),

  voice: router({
    synthesize: protectedProcedure
      .input((val: any) => val)
      .mutation(({ input }) => {
        if (!voiceSynthesisService.isInitialized()) {
          throw new Error("Voice synthesis service not initialized. Configure ElevenLabs API key.");
        }
        return voiceSynthesisService.synthesizeVoice(input);
      }),
    getAvailableVoices: protectedProcedure.query(() => {
      if (!voiceSynthesisService.isInitialized()) {
        throw new Error("Voice synthesis service not initialized.");
      }
      return voiceSynthesisService.getAvailableVoices();
    }),
    synthesizeWithVariety: protectedProcedure
      .input((val: any) => val)
      .mutation(({ input }) => {
        if (!voiceSynthesisService.isInitialized()) {
          throw new Error("Voice synthesis service not initialized.");
        }
        return voiceSynthesisService.synthesizeWithVariety(input.text, input.voiceIds);
      }),
  }),

  billing: router({
    getAllPlans: publicProcedure.query(() => subscriptionService.getAllPlans()),

    getPlan: publicProcedure
      .input((val: any) => val)
      .query(({ input }) => subscriptionService.getPlan(input.planId)),

    createSubscription: protectedProcedure
      .input((val: any) => val)
      .mutation(({ ctx, input }) => {
        const subscription = subscriptionService.createSubscription(
          ctx.user.id,
          input.planId,
          input.billingCycle,
          input.paymentMethod
        );
        return db.createUserSubscription(subscription);
      }),

    getPaymentHistory: protectedProcedure.query(({ ctx }) => {
      return db.getPaymentRecordsByUser(ctx.user.id);
    }),
  }),

  reports: router({
    generateAnalyticsReport: protectedProcedure
      .input((val: any) => val)
      .query(async ({ input }) => {
        const metrics = await db.getCampaignMetrics(input.campaignId);
        return analyticsService.generateReport(input.campaignId, metrics as any);
      }),

    comparePlatforms: protectedProcedure
      .input((val: any) => val)
      .query(async ({ input }) => {
        const metrics = await db.getCampaignMetrics(input.campaignId);
        return analyticsService.comparePlatforms(metrics as any);
      }),
  }),
});

export type AppRouter = typeof appRouter;

