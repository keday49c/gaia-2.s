import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { campaignAutomationService } from "./services/campaignAutomationService";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
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
});

export type AppRouter = typeof appRouter;

