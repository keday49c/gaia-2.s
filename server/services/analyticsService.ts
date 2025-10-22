/**
 * Analytics Service
 * Handles campaign analytics, metrics calculation, and forecasting
 */

export interface CampaignMetrics {
  campaignId: string;
  date: Date;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  platform: string;
}

export interface AnalyticsReport {
  campaignId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  metrics: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    totalSpend: number;
    totalRevenue: number;
    ctr: number; // Click-through rate
    conversionRate: number;
    cpc: number; // Cost per click
    cpa: number; // Cost per acquisition
    roas: number; // Return on ad spend
    roi: number; // Return on investment
  };
  trends: {
    impressionsTrend: number;
    clicksTrend: number;
    conversionsTrend: number;
  };
  forecast: {
    projectedRevenue: number;
    projectedSpend: number;
    projectedROI: number;
    confidence: number; // 0-100
  };
  recommendations: string[];
}

export interface PlatformComparison {
  platform: string;
  metrics: {
    totalSpend: number;
    totalRevenue: number;
    roi: number;
    roas: number;
    ctr: number;
    conversionRate: number;
  };
  performance: "excellent" | "good" | "average" | "poor";
}

export class AnalyticsService {
  /**
   * Calculate campaign metrics
   */
  calculateMetrics(data: CampaignMetrics[]): AnalyticsReport["metrics"] {
    const totalImpressions = data.reduce((sum, d) => sum + d.impressions, 0);
    const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0);
    const totalConversions = data.reduce((sum, d) => sum + d.conversions, 0);
    const totalSpend = data.reduce((sum, d) => sum + d.spend, 0);
    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
    const roas = totalSpend > 0 ? (totalRevenue / totalSpend) * 100 : 0;
    const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

    return {
      totalImpressions,
      totalClicks,
      totalConversions,
      totalSpend,
      totalRevenue,
      ctr: parseFloat(ctr.toFixed(2)),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      cpc: parseFloat(cpc.toFixed(2)),
      cpa: parseFloat(cpa.toFixed(2)),
      roas: parseFloat(roas.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
    };
  }

  /**
   * Calculate trends (percentage change)
   */
  calculateTrends(
    currentData: CampaignMetrics[],
    previousData: CampaignMetrics[]
  ): AnalyticsReport["trends"] {
    const currentImpressions = currentData.reduce((sum, d) => sum + d.impressions, 0);
    const previousImpressions = previousData.reduce((sum, d) => sum + d.impressions, 0);

    const currentClicks = currentData.reduce((sum, d) => sum + d.clicks, 0);
    const previousClicks = previousData.reduce((sum, d) => sum + d.clicks, 0);

    const currentConversions = currentData.reduce((sum, d) => sum + d.conversions, 0);
    const previousConversions = previousData.reduce((sum, d) => sum + d.conversions, 0);

    const impressionsTrend =
      previousImpressions > 0
        ? ((currentImpressions - previousImpressions) / previousImpressions) * 100
        : 0;

    const clicksTrend =
      previousClicks > 0 ? ((currentClicks - previousClicks) / previousClicks) * 100 : 0;

    const conversionsTrend =
      previousConversions > 0
        ? ((currentConversions - previousConversions) / previousConversions) * 100
        : 0;

    return {
      impressionsTrend: parseFloat(impressionsTrend.toFixed(2)),
      clicksTrend: parseFloat(clicksTrend.toFixed(2)),
      conversionsTrend: parseFloat(conversionsTrend.toFixed(2)),
    };
  }

  /**
   * Forecast future performance using simple linear regression
   */
  forecast(data: CampaignMetrics[], daysAhead: number = 7): AnalyticsReport["forecast"] {
    if (data.length < 2) {
      return {
        projectedRevenue: 0,
        projectedSpend: 0,
        projectedROI: 0,
        confidence: 0,
      };
    }

    // Simple linear regression for revenue
    const revenueData = data.map((d) => d.revenue);
    const spendData = data.map((d) => d.spend);

    const revenueSlope = this.calculateSlope(revenueData);
    const spendSlope = this.calculateSlope(spendData);

    const lastRevenue = revenueData[revenueData.length - 1];
    const lastSpend = spendData[spendData.length - 1];

    const projectedRevenue = lastRevenue + revenueSlope * daysAhead;
    const projectedSpend = lastSpend + spendSlope * daysAhead;
    const projectedROI =
      projectedSpend > 0 ? ((projectedRevenue - projectedSpend) / projectedSpend) * 100 : 0;

    // Calculate confidence based on data consistency
    const confidence = Math.min(100, Math.max(0, 50 + data.length * 5));

    return {
      projectedRevenue: parseFloat(projectedRevenue.toFixed(2)),
      projectedSpend: parseFloat(projectedSpend.toFixed(2)),
      projectedROI: parseFloat(projectedROI.toFixed(2)),
      confidence: Math.round(confidence),
    };
  }

  /**
   * Generate analytics report
   */
  generateReport(
    campaignId: string,
    currentData: CampaignMetrics[],
    previousData: CampaignMetrics[] = []
  ): AnalyticsReport {
    const metrics = this.calculateMetrics(currentData);
    const trends = previousData.length > 0 ? this.calculateTrends(currentData, previousData) : {
      impressionsTrend: 0,
      clicksTrend: 0,
      conversionsTrend: 0,
    };
    const forecast = this.forecast(currentData);
    const recommendations = this.generateRecommendations(metrics, trends);

    const startDate = currentData.length > 0 ? new Date(currentData[0].date) : new Date();
    const endDate = currentData.length > 0 ? new Date(currentData[currentData.length - 1].date) : new Date();

    return {
      campaignId,
      period: { startDate, endDate },
      metrics,
      trends,
      forecast,
      recommendations,
    };
  }

  /**
   * Compare performance across platforms
   */
  comparePlatforms(data: CampaignMetrics[]): PlatformComparison[] {
    const platformGroups = this.groupByPlatform(data);
    const comparisons: PlatformComparison[] = [];

    platformGroups.forEach((platformData, platform) => {
      const metrics = this.calculateMetrics(platformData);
      const performance = this.assessPerformance(metrics);

      comparisons.push({
        platform,
        metrics: {
          totalSpend: metrics.totalSpend,
          totalRevenue: metrics.totalRevenue,
          roi: metrics.roi,
          roas: metrics.roas,
          ctr: metrics.ctr,
          conversionRate: metrics.conversionRate,
        },
        performance,
      });
    });

    return comparisons.sort((a, b) => b.metrics.roi - a.metrics.roi);
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(
    metrics: AnalyticsReport["metrics"],
    trends: AnalyticsReport["trends"]
  ): string[] {
    const recommendations: string[] = [];

    // CTR recommendations
    if (metrics.ctr < 1) {
      recommendations.push("CTR is below 1%. Consider improving ad copy or targeting.");
    } else if (metrics.ctr > 5) {
      recommendations.push("Excellent CTR! Consider scaling this campaign.");
    }

    // Conversion rate recommendations
    if (metrics.conversionRate < 1) {
      recommendations.push("Low conversion rate. Review landing page and user experience.");
    } else if (metrics.conversionRate > 5) {
      recommendations.push("Outstanding conversion rate! Analyze what's working and replicate.");
    }

    // ROI recommendations
    if (metrics.roi < 0) {
      recommendations.push("Negative ROI. Consider pausing or optimizing this campaign.");
    } else if (metrics.roi > 100) {
      recommendations.push("Exceptional ROI! This campaign is highly profitable.");
    }

    // Trend recommendations
    if (trends.clicksTrend < -20) {
      recommendations.push("Clicks are declining. Refresh ad creative or adjust targeting.");
    } else if (trends.clicksTrend > 20) {
      recommendations.push("Clicks are increasing. Maintain current strategy.");
    }

    // CPA recommendations
    if (metrics.cpa > 100) {
      recommendations.push("High cost per acquisition. Consider optimizing conversion funnel.");
    }

    return recommendations;
  }

  /**
   * Assess platform performance
   */
  private assessPerformance(metrics: AnalyticsReport["metrics"]): PlatformComparison["performance"] {
    if (metrics.roi > 100 && metrics.conversionRate > 3) {
      return "excellent";
    } else if (metrics.roi > 50 && metrics.conversionRate > 2) {
      return "good";
    } else if (metrics.roi > 0 && metrics.conversionRate > 1) {
      return "average";
    }
    return "poor";
  }

  /**
   * Group metrics by platform
   */
  private groupByPlatform(data: CampaignMetrics[]): Map<string, CampaignMetrics[]> {
    const groups = new Map<string, CampaignMetrics[]>();

    data.forEach((item) => {
      if (!groups.has(item.platform)) {
        groups.set(item.platform, []);
      }
      groups.get(item.platform)!.push(item);
    });

    return groups;
  }

  /**
   * Calculate slope for linear regression
   */
  private calculateSlope(data: number[]): number {
    if (data.length < 2) return 0;

    const n = data.length;
    const xMean = (n - 1) / 2;
    const yMean = data.reduce((sum, val) => sum + val, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (data[i] - yMean);
      denominator += (i - xMean) * (i - xMean);
    }

    return denominator !== 0 ? numerator / denominator : 0;
  }

  /**
   * Export report as JSON
   */
  exportAsJSON(report: AnalyticsReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Export report as CSV
   */
  exportAsCSV(report: AnalyticsReport): string {
    const lines: string[] = [];

    lines.push("Campaign Analytics Report");
    lines.push(`Campaign ID,${report.campaignId}`);
    lines.push(`Period,"${report.period.startDate} to ${report.period.endDate}"`);
    lines.push("");

    lines.push("Metrics");
    lines.push("Metric,Value");
    Object.entries(report.metrics).forEach(([key, value]) => {
      lines.push(`${key},${value}`);
    });

    lines.push("");
    lines.push("Trends");
    lines.push("Metric,Percentage Change");
    Object.entries(report.trends).forEach(([key, value]) => {
      lines.push(`${key},${value}%`);
    });

    lines.push("");
    lines.push("Forecast");
    lines.push("Metric,Value");
    Object.entries(report.forecast).forEach(([key, value]) => {
      lines.push(`${key},${value}`);
    });

    lines.push("");
    lines.push("Recommendations");
    report.recommendations.forEach((rec) => {
      lines.push(`"${rec}"`);
    });

    return lines.join("\n");
  }
}

export const analyticsService = new AnalyticsService();

