/**
 * Competitor Analysis Service
 * Analyzes competitor strategies, pricing, and marketing tactics ethically
 */

export interface Competitor {
  id: string;
  name: string;
  website: string;
  industry: string;
  estimatedMonthlyRevenue?: number;
  marketShare?: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitorMetrics {
  competitorId: string;
  date: Date;
  websiteTraffic?: number;
  socialMediaFollowers: {
    instagram?: number;
    facebook?: number;
    linkedin?: number;
    twitter?: number;
  };
  contentStrategy: {
    postsPerWeek: number;
    engagementRate: number;
    topicsFocused: string[];
  };
  pricingStrategy: {
    productCount: number;
    averagePrice: number;
    discountFrequency: number;
  };
  marketingChannels: string[];
}

export interface CompetitorAnalysisReport {
  competitorId: string;
  competitorName: string;
  analysisDate: Date;
  metrics: CompetitorMetrics;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
  marketPosition: "leader" | "challenger" | "follower" | "niche";
}

export class CompetitorAnalysisService {
  /**
   * Analyze competitor SWOT
   */
  analyzeSWOT(competitor: Competitor): CompetitorAnalysisReport["swotAnalysis"] {
    return {
      strengths: competitor.strengths,
      weaknesses: competitor.weaknesses,
      opportunities: competitor.opportunities,
      threats: competitor.threats,
    };
  }

  /**
   * Assess market position
   */
  assessMarketPosition(
    marketShare?: number,
    revenue?: number
  ): CompetitorAnalysisReport["marketPosition"] {
    if (!marketShare && !revenue) return "niche";

    if (marketShare && marketShare > 30) return "leader";
    if (marketShare && marketShare > 15) return "challenger";
    if (marketShare && marketShare > 5) return "follower";
    if (revenue && revenue > 1000000) return "leader";
    if (revenue && revenue > 500000) return "challenger";
    if (revenue && revenue > 100000) return "follower";

    return "niche";
  }

  /**
   * Assess risk level
   */
  assessRiskLevel(metrics: CompetitorMetrics, marketShare?: number): CompetitorAnalysisReport["riskLevel"] {
    let riskScore = 0;

    // Traffic analysis
    if (metrics.websiteTraffic && metrics.websiteTraffic > 100000) riskScore += 3;
    else if (metrics.websiteTraffic && metrics.websiteTraffic > 50000) riskScore += 2;
    else if (metrics.websiteTraffic && metrics.websiteTraffic > 10000) riskScore += 1;

    // Social media presence
    const totalFollowers =
      (metrics.socialMediaFollowers.instagram || 0) +
      (metrics.socialMediaFollowers.facebook || 0) +
      (metrics.socialMediaFollowers.linkedin || 0) +
      (metrics.socialMediaFollowers.twitter || 0);

    if (totalFollowers > 100000) riskScore += 3;
    else if (totalFollowers > 50000) riskScore += 2;
    else if (totalFollowers > 10000) riskScore += 1;

    // Content engagement
    if (metrics.contentStrategy.engagementRate > 5) riskScore += 2;
    else if (metrics.contentStrategy.engagementRate > 2) riskScore += 1;

    // Market share
    if (marketShare && marketShare > 30) riskScore += 3;
    else if (marketShare && marketShare > 15) riskScore += 2;
    else if (marketShare && marketShare > 5) riskScore += 1;

    if (riskScore >= 7) return "high";
    if (riskScore >= 4) return "medium";
    return "low";
  }

  /**
   * Generate competitive recommendations
   */
  generateRecommendations(
    report: CompetitorAnalysisReport,
    userMetrics?: any
  ): string[] {
    const recommendations: string[] = [];

    // Pricing recommendations
    if (report.metrics.pricingStrategy.averagePrice > 0) {
      recommendations.push(
        `Competitor's average price is R$ ${report.metrics.pricingStrategy.averagePrice.toFixed(2)}. Consider competitive pricing strategy.`
      );
    }

    // Content strategy recommendations
    if (report.metrics.contentStrategy.postsPerWeek > 5) {
      recommendations.push(
        `Competitor posts ${report.metrics.contentStrategy.postsPerWeek} times per week. Increase your content frequency.`
      );
    }

    // Engagement recommendations
    if (report.metrics.contentStrategy.engagementRate > 3) {
      recommendations.push(
        `Competitor has high engagement rate (${report.metrics.contentStrategy.engagementRate.toFixed(1)}%). Analyze their content style.`
      );
    }

    // Market position recommendations
    if (report.marketPosition === "leader") {
      recommendations.push("This is a market leader. Focus on differentiation and niche positioning.");
    } else if (report.marketPosition === "challenger") {
      recommendations.push("This is a strong challenger. Compete on specific features or pricing.");
    }

    // Risk-based recommendations
    if (report.riskLevel === "high") {
      recommendations.push("High competitive threat detected. Accelerate innovation and customer retention.");
    }

    // Topic recommendations
    const topicGaps = this.findTopicGaps(report.metrics.contentStrategy.topicsFocused);
    if (topicGaps.length > 0) {
      recommendations.push(`Competitor focuses on: ${topicGaps.join(", ")}. Consider covering these topics.`);
    }

    return recommendations;
  }

  /**
   * Compare with user's metrics
   */
  compareWithUser(
    competitorMetrics: CompetitorMetrics,
    userMetrics: CompetitorMetrics
  ): {
    advantages: string[];
    disadvantages: string[];
    opportunities: string[];
  } {
    const advantages: string[] = [];
    const disadvantages: string[] = [];
    const opportunities: string[] = [];

    // Traffic comparison
    if (
      userMetrics.websiteTraffic &&
      competitorMetrics.websiteTraffic &&
      userMetrics.websiteTraffic > competitorMetrics.websiteTraffic
    ) {
      advantages.push(
        `Your website traffic (${userMetrics.websiteTraffic}) exceeds competitor (${competitorMetrics.websiteTraffic})`
      );
    } else if (
      userMetrics.websiteTraffic &&
      competitorMetrics.websiteTraffic &&
      userMetrics.websiteTraffic < competitorMetrics.websiteTraffic
    ) {
      disadvantages.push(
        `Competitor has higher traffic (${competitorMetrics.websiteTraffic} vs ${userMetrics.websiteTraffic})`
      );
      opportunities.push("Opportunity to increase SEO and organic traffic");
    }

    // Engagement comparison
    if (userMetrics.contentStrategy.engagementRate > competitorMetrics.contentStrategy.engagementRate) {
      advantages.push(
        `Your engagement rate (${userMetrics.contentStrategy.engagementRate.toFixed(1)}%) exceeds competitor`
      );
    } else {
      disadvantages.push(
        `Competitor has higher engagement (${competitorMetrics.contentStrategy.engagementRate.toFixed(1)}% vs ${userMetrics.contentStrategy.engagementRate.toFixed(1)}%)`
      );
    }

    // Pricing comparison
    if (
      userMetrics.pricingStrategy.averagePrice > 0 &&
      competitorMetrics.pricingStrategy.averagePrice > 0
    ) {
      if (userMetrics.pricingStrategy.averagePrice < competitorMetrics.pricingStrategy.averagePrice) {
        advantages.push("Your pricing is more competitive");
      } else {
        opportunities.push("Consider price optimization strategy");
      }
    }

    return { advantages, disadvantages, opportunities };
  }

  /**
   * Find topic gaps
   */
  private findTopicGaps(competitorTopics: string[]): string[] {
    const commonTopics = [
      "Digital Marketing",
      "Social Media",
      "SEO",
      "Content Marketing",
      "Email Marketing",
      "PPC Advertising",
      "Analytics",
      "Branding",
      "Customer Service",
      "AI & Automation",
    ];

    return commonTopics.filter((topic) =>
      competitorTopics.some((ct) => ct.toLowerCase().includes(topic.toLowerCase()))
    );
  }

  /**
   * Estimate market share
   */
  estimateMarketShare(
    competitorTraffic: number,
    totalMarketTraffic: number
  ): number {
    if (totalMarketTraffic === 0) return 0;
    return (competitorTraffic / totalMarketTraffic) * 100;
  }

  /**
   * Generate competitive intelligence report
   */
  generateIntelligenceReport(
    competitors: Competitor[],
    metrics: CompetitorMetrics[]
  ): {
    topCompetitors: Competitor[];
    marketLeader: Competitor | null;
    averageMetrics: CompetitorMetrics;
    industryTrends: string[];
  } {
    const topCompetitors = competitors
      .sort((a, b) => (b.estimatedMonthlyRevenue || 0) - (a.estimatedMonthlyRevenue || 0))
      .slice(0, 5);

    const marketLeader = topCompetitors[0] || null;

    // Calculate average metrics
    const avgTraffic =
      metrics.reduce((sum, m) => sum + (m.websiteTraffic || 0), 0) / metrics.length;
    const avgEngagement =
      metrics.reduce((sum, m) => sum + m.contentStrategy.engagementRate, 0) / metrics.length;
    const avgPrice =
      metrics.reduce((sum, m) => sum + m.pricingStrategy.averagePrice, 0) / metrics.length;

    const averageMetrics: CompetitorMetrics = {
      competitorId: "average",
      date: new Date(),
      websiteTraffic: avgTraffic,
      socialMediaFollowers: {
        instagram: 0,
        facebook: 0,
        linkedin: 0,
        twitter: 0,
      },
      contentStrategy: {
        postsPerWeek: 0,
        engagementRate: avgEngagement,
        topicsFocused: [],
      },
      pricingStrategy: {
        productCount: 0,
        averagePrice: avgPrice,
        discountFrequency: 0,
      },
      marketingChannels: [],
    };

    // Identify trends
    const industryTrends: string[] = [];
    if (avgEngagement > 3) industryTrends.push("High engagement content is trending");
    if (avgPrice > 500) industryTrends.push("Premium pricing is common in this market");
    industryTrends.push("Multi-channel marketing is essential");
    industryTrends.push("AI and automation are becoming standard");

    return {
      topCompetitors,
      marketLeader,
      averageMetrics,
      industryTrends,
    };
  }

  /**
   * Monitor competitor changes
   */
  monitorChanges(
    previousMetrics: CompetitorMetrics,
    currentMetrics: CompetitorMetrics
  ): {
    changes: string[];
    significantChanges: boolean;
  } {
    const changes: string[] = [];
    let significantChanges = false;

    // Traffic changes
    if (
      previousMetrics.websiteTraffic &&
      currentMetrics.websiteTraffic &&
      Math.abs(currentMetrics.websiteTraffic - previousMetrics.websiteTraffic) > 10000
    ) {
      const change =
        currentMetrics.websiteTraffic > previousMetrics.websiteTraffic ? "increased" : "decreased";
      changes.push(`Website traffic ${change} significantly`);
      significantChanges = true;
    }

    // Engagement changes
    if (
      Math.abs(currentMetrics.contentStrategy.engagementRate - previousMetrics.contentStrategy.engagementRate) >
      1
    ) {
      const change =
        currentMetrics.contentStrategy.engagementRate >
        previousMetrics.contentStrategy.engagementRate
          ? "increased"
          : "decreased";
      changes.push(`Engagement rate ${change}`);
      significantChanges = true;
    }

    // Pricing changes
    if (
      Math.abs(
        currentMetrics.pricingStrategy.averagePrice - previousMetrics.pricingStrategy.averagePrice
      ) > 50
    ) {
      const change =
        currentMetrics.pricingStrategy.averagePrice > previousMetrics.pricingStrategy.averagePrice
          ? "increased"
          : "decreased";
      changes.push(`Average pricing ${change}`);
      significantChanges = true;
    }

    return { changes, significantChanges };
  }
}

export const competitorAnalysisService = new CompetitorAnalysisService();

