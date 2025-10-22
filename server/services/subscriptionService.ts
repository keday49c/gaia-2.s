/**
 * Subscription Service
 * Manages user subscriptions, billing, and plan upgrades/downgrades
 */

export type SubscriptionPlan = "basic" | "pro" | "premium" | "ouro";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "past_due";
export type PaymentMethod = "pix" | "boleto" | "credit_card";

export interface SubscriptionPlanDetails {
  id: SubscriptionPlan;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  maxCampaigns: number;
  maxPlatforms: number;
  features: {
    aiContentGeneration: boolean;
    whatsappBot: boolean;
    competitorAnalysis: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
  };
}

export interface UserSubscription {
  userId: string;
  planId: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  renewalDate: Date;
  cancelledDate?: Date;
  paymentMethod: PaymentMethod;
  monthlyPrice: number;
  billingCycle: "monthly" | "annual";
  autoRenew: boolean;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  dueDate: Date;
  reference: string; // PIX QR Code, Boleto barcode, etc
  transactionId?: string;
}

export class SubscriptionService {
  private plans: Map<SubscriptionPlan, SubscriptionPlanDetails> = new Map([
    [
      "basic",
      {
        id: "basic",
        name: "Básico",
        monthlyPrice: 99,
        annualPrice: 950.4, // 20% discount
        maxCampaigns: 5,
        maxPlatforms: 1,
        features: {
          aiContentGeneration: false,
          whatsappBot: false,
          competitorAnalysis: false,
          advancedAnalytics: false,
          prioritySupport: false,
        },
      },
    ],
    [
      "pro",
      {
        id: "pro",
        name: "Pro",
        monthlyPrice: 299,
        annualPrice: 2871.6, // 20% discount
        maxCampaigns: 20,
        maxPlatforms: 3,
        features: {
          aiContentGeneration: true,
          whatsappBot: false,
          competitorAnalysis: false,
          advancedAnalytics: true,
          prioritySupport: false,
        },
      },
    ],
    [
      "premium",
      {
        id: "premium",
        name: "Premium",
        monthlyPrice: 699,
        annualPrice: 6710.4, // 20% discount
        maxCampaigns: Infinity,
        maxPlatforms: Infinity,
        features: {
          aiContentGeneration: true,
          whatsappBot: true,
          competitorAnalysis: false,
          advancedAnalytics: true,
          prioritySupport: true,
        },
      },
    ],
    [
      "ouro",
      {
        id: "ouro",
        name: "Ouro",
        monthlyPrice: 1499,
        annualPrice: 14391.6, // 20% discount
        maxCampaigns: Infinity,
        maxPlatforms: Infinity,
        features: {
          aiContentGeneration: true,
          whatsappBot: true,
          competitorAnalysis: true,
          advancedAnalytics: true,
          prioritySupport: true,
        },
      },
    ],
  ]);

  /**
   * Get plan details
   */
  getPlan(planId: SubscriptionPlan): SubscriptionPlanDetails | null {
    return this.plans.get(planId) || null;
  }

  /**
   * Get all available plans
   */
  getAllPlans(): SubscriptionPlanDetails[] {
    return Array.from(this.plans.values());
  }

  /**
   * Create new subscription
   */
  createSubscription(
    userId: string,
    planId: SubscriptionPlan,
    billingCycle: "monthly" | "annual",
    paymentMethod: PaymentMethod
  ): UserSubscription {
    const plan = this.getPlan(planId);
    if (!plan) {
      throw new Error(`Invalid plan: ${planId}`);
    }

    const startDate = new Date();
    const renewalDate = new Date(startDate);

    if (billingCycle === "monthly") {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    const monthlyPrice =
      billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice / 12;

    return {
      userId,
      planId,
      status: "active",
      startDate,
      renewalDate,
      paymentMethod,
      monthlyPrice,
      billingCycle,
      autoRenew: true,
    };
  }

  /**
   * Upgrade subscription to a higher plan
   */
  upgradeSubscription(
    currentSubscription: UserSubscription,
    newPlanId: SubscriptionPlan
  ): UserSubscription {
    const currentPlan = this.getPlan(currentSubscription.planId);
    const newPlan = this.getPlan(newPlanId);

    if (!currentPlan || !newPlan) {
      throw new Error("Invalid plan");
    }

    // Calculate prorated credit
    const daysRemaining = this.calculateDaysRemaining(currentSubscription.renewalDate);
    const totalDays = currentSubscription.billingCycle === "monthly" ? 30 : 365;
    const proratedCredit = (currentPlan.monthlyPrice / totalDays) * daysRemaining;

    const currentPrice =
      currentSubscription.billingCycle === "monthly"
        ? currentPlan.monthlyPrice
        : currentPlan.annualPrice / 12;

    const newPrice =
      currentSubscription.billingCycle === "monthly"
        ? newPlan.monthlyPrice
        : newPlan.annualPrice / 12;

    const upgradeCost = newPrice - currentPrice;
    const amountDue = Math.max(0, upgradeCost - proratedCredit);

    return {
      ...currentSubscription,
      planId: newPlanId,
      monthlyPrice: newPrice,
      status: "active",
    };
  }

  /**
   * Downgrade subscription to a lower plan
   */
  downgradeSubscription(
    currentSubscription: UserSubscription,
    newPlanId: SubscriptionPlan
  ): UserSubscription {
    const newPlan = this.getPlan(newPlanId);
    if (!newPlan) {
      throw new Error("Invalid plan");
    }

    const newPrice =
      currentSubscription.billingCycle === "monthly"
        ? newPlan.monthlyPrice
        : newPlan.annualPrice / 12;

    return {
      ...currentSubscription,
      planId: newPlanId,
      monthlyPrice: newPrice,
      status: "active",
    };
  }

  /**
   * Cancel subscription
   */
  cancelSubscription(subscription: UserSubscription): UserSubscription {
    return {
      ...subscription,
      status: "cancelled",
      autoRenew: false,
      cancelledDate: new Date(),
    };
  }

  /**
   * Check if user can create more campaigns
   */
  canCreateCampaign(subscription: UserSubscription, currentCampaignCount: number): boolean {
    const plan = this.getPlan(subscription.planId);
    if (!plan) return false;
    return currentCampaignCount < plan.maxCampaigns;
  }

  /**
   * Check if user has access to feature
   */
  hasFeatureAccess(subscription: UserSubscription, feature: keyof SubscriptionPlanDetails["features"]): boolean {
    const plan = this.getPlan(subscription.planId);
    if (!plan) return false;
    return plan.features[feature];
  }

  /**
   * Generate PIX payment
   */
  generatePixPayment(subscription: UserSubscription, amount: number): {
    qrCode: string;
    pixKey: string;
    amount: number;
    expiresIn: number; // minutes
  } {
    // In production, this would call PagBrasil API
    const pixKey = "apogeu@pagbrasil.com.br"; // Example
    const qrCode = `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540510.00`;

    return {
      qrCode,
      pixKey,
      amount,
      expiresIn: 30,
    };
  }

  /**
   * Generate Boleto payment
   */
  generateBoletoPayment(subscription: UserSubscription, amount: number): {
    barcode: string;
    barcodeUrl: string;
    dueDate: Date;
    amount: number;
  } {
    // In production, this would call PagBrasil API
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const barcode = this.generateBarcodeNumber();

    return {
      barcode,
      barcodeUrl: `https://api.pagbrasil.com/boleto/${barcode}`,
      dueDate,
      amount,
    };
  }

  /**
   * Create payment record
   */
  createPaymentRecord(
    userId: string,
    subscriptionId: string,
    amount: number,
    paymentMethod: PaymentMethod
  ): PaymentRecord {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    return {
      id: `payment_${Date.now()}`,
      userId,
      subscriptionId,
      amount,
      currency: "BRL",
      status: "pending",
      paymentMethod,
      paymentDate: new Date(),
      dueDate,
      reference: this.generateReference(),
    };
  }

  /**
   * Process payment
   */
  processPayment(payment: PaymentRecord, transactionId: string): PaymentRecord {
    return {
      ...payment,
      status: "completed",
      transactionId,
    };
  }

  /**
   * Refund payment
   */
  refundPayment(payment: PaymentRecord): PaymentRecord {
    return {
      ...payment,
      status: "refunded",
    };
  }

  /**
   * Check if subscription needs renewal
   */
  needsRenewal(subscription: UserSubscription): boolean {
    const today = new Date();
    const daysUntilRenewal = Math.ceil(
      (subscription.renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilRenewal <= 0;
  }

  /**
   * Renew subscription
   */
  renewSubscription(subscription: UserSubscription): UserSubscription {
    const renewalDate = new Date(subscription.renewalDate);

    if (subscription.billingCycle === "monthly") {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    return {
      ...subscription,
      renewalDate,
      status: "active",
    };
  }

  /**
   * Calculate days remaining until renewal
   */
  private calculateDaysRemaining(renewalDate: Date): number {
    const today = new Date();
    const daysRemaining = Math.ceil(
      (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, daysRemaining);
  }

  /**
   * Generate barcode number for Boleto
   */
  private generateBarcodeNumber(): string {
    const random = Math.random().toString().slice(2, 11);
    return `12345.67890 12345.678901 12345.678901 1 ${random}`;
  }

  /**
   * Generate payment reference
   */
  private generateReference(): string {
    return `REF${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
  }

  /**
   * Get subscription price for period
   */
  getSubscriptionPrice(planId: SubscriptionPlan, billingCycle: "monthly" | "annual"): number {
    const plan = this.getPlan(planId);
    if (!plan) return 0;
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  }

  /**
   * Calculate annual savings
   */
  calculateAnnualSavings(planId: SubscriptionPlan): number {
    const plan = this.getPlan(planId);
    if (!plan) return 0;
    const monthlyTotal = plan.monthlyPrice * 12;
    return monthlyTotal - plan.annualPrice;
  }
}

export const subscriptionService = new SubscriptionService();

