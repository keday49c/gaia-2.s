import { eq } from 'drizzle-orm';
import { getDb } from '../db';

/**
 * Serviço Avançado de Controle de Campanhas
 * Fornece controle refinado e apurado de campanhas com métricas avançadas
 */

export interface AdvancedCampaignMetrics {
  campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  
  // Métricas calculadas
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpa: number; // Cost per acquisition
  roas: number; // Return on ad spend
  roi: number; // Return on investment
  conversionRate: number; // Conversion rate
  
  // Métricas avançadas
  cpm: number; // Cost per thousand impressions
  cpv: number; // Cost per view
  engagement: number; // Taxa de engajamento
  quality_score: number; // Score de qualidade
  
  // Dados temporais
  date: Date;
  hour?: number;
  dayOfWeek?: number;
}

export interface CampaignOptimizationRecommendation {
  campaignId: string;
  type: 'budget' | 'targeting' | 'creative' | 'bidding' | 'schedule';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedImpact: number; // Percentual de melhoria esperada
  action: string;
}

export interface CampaignPerformanceComparison {
  campaignId: string;
  campaignName: string;
  period: 'daily' | 'weekly' | 'monthly';
  currentMetrics: AdvancedCampaignMetrics;
  previousMetrics: AdvancedCampaignMetrics;
  changePercentage: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
    roi: number;
  };
  trend: 'improving' | 'declining' | 'stable';
}

/**
 * Calcula métricas avançadas de campanha
 */
export function calculateAdvancedMetrics(
  impressions: number,
  clicks: number,
  conversions: number,
  spend: number,
  revenue: number
): AdvancedCampaignMetrics {
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const cpa = conversions > 0 ? spend / conversions : 0;
  const roas = spend > 0 ? revenue / spend : 0;
  const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
  const cpv = clicks > 0 ? spend / clicks : 0;
  const engagement = clicks > 0 ? (conversions / clicks) * 100 : 0;
  const quality_score = calculateQualityScore(ctr, cpc, conversionRate);

  return {
    campaignId: '',
    impressions,
    clicks,
    conversions,
    spend,
    revenue,
    ctr: Math.round(ctr * 100) / 100,
    cpc: Math.round(cpc * 100) / 100,
    cpa: Math.round(cpa * 100) / 100,
    roas: Math.round(roas * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    conversionRate: Math.round(conversionRate * 100) / 100,
    cpm: Math.round(cpm * 100) / 100,
    cpv: Math.round(cpv * 100) / 100,
    engagement: Math.round(engagement * 100) / 100,
    quality_score,
    date: new Date(),
  };
}

/**
 * Calcula score de qualidade da campanha (0-100)
 */
export function calculateQualityScore(
  ctr: number,
  cpc: number,
  conversionRate: number
): number {
  let score = 50; // Base score

  // CTR (0-30 pontos)
  if (ctr > 5) score += 30;
  else if (ctr > 3) score += 20;
  else if (ctr > 1) score += 10;

  // CPC (0-20 pontos)
  if (cpc < 0.5) score += 20;
  else if (cpc < 1) score += 15;
  else if (cpc < 2) score += 10;

  // Conversion Rate (0-20 pontos)
  if (conversionRate > 5) score += 20;
  else if (conversionRate > 2) score += 15;
  else if (conversionRate > 1) score += 10;

  return Math.min(score, 100);
}

/**
 * Gera recomendações de otimização para campanha
 */
export function generateOptimizationRecommendations(
  metrics: AdvancedCampaignMetrics,
  campaignId: string
): CampaignOptimizationRecommendation[] {
  const recommendations: CampaignOptimizationRecommendation[] = [];

  // Recomendação de orçamento
  if (metrics.roas < 1) {
    recommendations.push({
      campaignId,
      type: 'budget',
      priority: 'high',
      title: 'Reduzir Orçamento',
      description: 'ROAS abaixo de 1:1. Considere reduzir o orçamento ou pausar a campanha.',
      estimatedImpact: 15,
      action: 'Reduza o orçamento em 25-50%',
    });
  } else if (metrics.roas > 3) {
    recommendations.push({
      campaignId,
      type: 'budget',
      priority: 'high',
      title: 'Aumentar Orçamento',
      description: 'ROAS excelente. Aumente o orçamento para escalar resultados.',
      estimatedImpact: 30,
      action: 'Aumente o orçamento em 20-50%',
    });
  }

  // Recomendação de CTR
  if (metrics.ctr < 1) {
    recommendations.push({
      campaignId,
      type: 'creative',
      priority: 'high',
      title: 'Melhorar Criativo',
      description: 'CTR muito baixo. Teste novos criativos e copy.',
      estimatedImpact: 40,
      action: 'Crie 3-5 variações de anúncios',
    });
  }

  // Recomendação de CPA
  if (metrics.cpa > 50) {
    recommendations.push({
      campaignId,
      type: 'targeting',
      priority: 'medium',
      title: 'Refinar Segmentação',
      description: 'CPA muito alto. Refine seu público-alvo.',
      estimatedImpact: 25,
      action: 'Ajuste critérios de segmentação',
    });
  }

  // Recomendação de agendamento
  if (metrics.hour !== undefined) {
    const peakHours = [10, 11, 14, 15, 19, 20]; // Horários de pico típicos
    if (!peakHours.includes(metrics.hour)) {
      recommendations.push({
        campaignId,
        type: 'schedule',
        priority: 'low',
        title: 'Otimizar Agendamento',
        description: 'Aumente gastos nos horários de pico.',
        estimatedImpact: 15,
        action: 'Configure agendamento para horários de pico',
      });
    }
  }

  return recommendations;
}

/**
 * Compara performance de campanha entre períodos
 */
export function comparePerformance(
  current: AdvancedCampaignMetrics,
  previous: AdvancedCampaignMetrics,
  campaignName: string
): CampaignPerformanceComparison {
  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const changePercentage = {
    impressions: calculateChange(current.impressions, previous.impressions),
    clicks: calculateChange(current.clicks, previous.clicks),
    conversions: calculateChange(current.conversions, previous.conversions),
    spend: calculateChange(current.spend, previous.spend),
    revenue: calculateChange(current.revenue, previous.revenue),
    roi: calculateChange(current.roi, previous.roi),
  };

  const trend = changePercentage.roi > 5 ? 'improving' : changePercentage.roi < -5 ? 'declining' : 'stable';

  return {
    campaignId: current.campaignId,
    campaignName,
    period: 'daily',
    currentMetrics: current,
    previousMetrics: previous,
    changePercentage,
    trend,
  };
}

/**
 * Detecta anomalias em métricas de campanha
 */
export function detectAnomalies(
  metrics: AdvancedCampaignMetrics,
  historicalAverage: AdvancedCampaignMetrics
): string[] {
  const anomalies: string[] = [];
  const threshold = 0.3; // 30% de desvio

  // Detecção de anomalias
  if (Math.abs(metrics.ctr - historicalAverage.ctr) / historicalAverage.ctr > threshold) {
    anomalies.push(`CTR anormalmente ${metrics.ctr > historicalAverage.ctr ? 'alto' : 'baixo'}`);
  }

  if (Math.abs(metrics.cpc - historicalAverage.cpc) / historicalAverage.cpc > threshold) {
    anomalies.push(`CPC anormalmente ${metrics.cpc > historicalAverage.cpc ? 'alto' : 'baixo'}`);
  }

  if (Math.abs(metrics.conversionRate - historicalAverage.conversionRate) / historicalAverage.conversionRate > threshold) {
    anomalies.push(`Taxa de conversão anormalmente ${metrics.conversionRate > historicalAverage.conversionRate ? 'alta' : 'baixa'}`);
  }

  if (metrics.impressions === 0) {
    anomalies.push('Nenhuma impressão registrada');
  }

  return anomalies;
}

/**
 * Calcula previsão de performance para os próximos dias
 */
export function forecastPerformance(
  historicalMetrics: AdvancedCampaignMetrics[],
  daysAhead: number = 7
): AdvancedCampaignMetrics[] {
  if (historicalMetrics.length === 0) return [];

  const forecast: AdvancedCampaignMetrics[] = [];
  const avgMetrics = calculateAverageMetrics(historicalMetrics);

  for (let i = 0; i < daysAhead; i++) {
    // Aplicar tendência linear simples
    const trend = calculateTrend(historicalMetrics);
    
    const forecastedMetrics: AdvancedCampaignMetrics = {
      ...avgMetrics,
      impressions: Math.round(avgMetrics.impressions * (1 + trend.impressionsTrend)),
      clicks: Math.round(avgMetrics.clicks * (1 + trend.clicksTrend)),
      conversions: Math.round(avgMetrics.conversions * (1 + trend.conversionsTrend)),
      spend: Math.round(avgMetrics.spend * (1 + trend.spendTrend) * 100) / 100,
      revenue: Math.round(avgMetrics.revenue * (1 + trend.revenueTrend) * 100) / 100,
      date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
    };

    // Recalcular métricas derivadas
    const recalculated = calculateAdvancedMetrics(
      forecastedMetrics.impressions,
      forecastedMetrics.clicks,
      forecastedMetrics.conversions,
      forecastedMetrics.spend,
      forecastedMetrics.revenue
    );

    forecast.push(recalculated);
  }

  return forecast;
}

/**
 * Calcula média de métricas
 */
function calculateAverageMetrics(metrics: AdvancedCampaignMetrics[]): AdvancedCampaignMetrics {
  const count = metrics.length;
  
  return {
    campaignId: metrics[0].campaignId,
    impressions: Math.round(metrics.reduce((sum, m) => sum + m.impressions, 0) / count),
    clicks: Math.round(metrics.reduce((sum, m) => sum + m.clicks, 0) / count),
    conversions: Math.round(metrics.reduce((sum, m) => sum + m.conversions, 0) / count),
    spend: Math.round((metrics.reduce((sum, m) => sum + m.spend, 0) / count) * 100) / 100,
    revenue: Math.round((metrics.reduce((sum, m) => sum + m.revenue, 0) / count) * 100) / 100,
    ctr: Math.round((metrics.reduce((sum, m) => sum + m.ctr, 0) / count) * 100) / 100,
    cpc: Math.round((metrics.reduce((sum, m) => sum + m.cpc, 0) / count) * 100) / 100,
    cpa: Math.round((metrics.reduce((sum, m) => sum + m.cpa, 0) / count) * 100) / 100,
    roas: Math.round((metrics.reduce((sum, m) => sum + m.roas, 0) / count) * 100) / 100,
    roi: Math.round((metrics.reduce((sum, m) => sum + m.roi, 0) / count) * 100) / 100,
    conversionRate: Math.round((metrics.reduce((sum, m) => sum + m.conversionRate, 0) / count) * 100) / 100,
    cpm: Math.round((metrics.reduce((sum, m) => sum + m.cpm, 0) / count) * 100) / 100,
    cpv: Math.round((metrics.reduce((sum, m) => sum + m.cpv, 0) / count) * 100) / 100,
    engagement: Math.round((metrics.reduce((sum, m) => sum + m.engagement, 0) / count) * 100) / 100,
    quality_score: Math.round(metrics.reduce((sum, m) => sum + m.quality_score, 0) / count),
    date: new Date(),
  };
}

/**
 * Calcula tendência de métricas
 */
function calculateTrend(metrics: AdvancedCampaignMetrics[]): {
  impressionsTrend: number;
  clicksTrend: number;
  conversionsTrend: number;
  spendTrend: number;
  revenueTrend: number;
} {
  if (metrics.length < 2) {
    return {
      impressionsTrend: 0,
      clicksTrend: 0,
      conversionsTrend: 0,
      spendTrend: 0,
      revenueTrend: 0,
    };
  }

  const first = metrics[0];
  const last = metrics[metrics.length - 1];

  return {
    impressionsTrend: (last.impressions - first.impressions) / first.impressions,
    clicksTrend: (last.clicks - first.clicks) / first.clicks,
    conversionsTrend: (last.conversions - first.conversions) / (first.conversions || 1),
    spendTrend: (last.spend - first.spend) / first.spend,
    revenueTrend: (last.revenue - first.revenue) / (first.revenue || 1),
  };
}

/**
 * Gera relatório executivo de campanha
 */
export function generateExecutiveReport(
  campaignName: string,
  metrics: AdvancedCampaignMetrics,
  recommendations: CampaignOptimizationRecommendation[]
): string {
  return `
RELATÓRIO EXECUTIVO - ${campaignName}
=====================================

RESUMO DE PERFORMANCE:
- Impressões: ${metrics.impressions.toLocaleString()}
- Cliques: ${metrics.clicks.toLocaleString()}
- Conversões: ${metrics.conversions.toLocaleString()}
- Gasto: R$ ${metrics.spend.toFixed(2)}
- Receita: R$ ${metrics.revenue.toFixed(2)}

MÉTRICAS PRINCIPAIS:
- CTR: ${metrics.ctr.toFixed(2)}%
- CPC: R$ ${metrics.cpc.toFixed(2)}
- CPA: R$ ${metrics.cpa.toFixed(2)}
- ROAS: ${metrics.roas.toFixed(2)}x
- ROI: ${metrics.roi.toFixed(2)}%
- Taxa de Conversão: ${metrics.conversionRate.toFixed(2)}%
- Quality Score: ${metrics.quality_score}/100

RECOMENDAÇÕES (${recommendations.length}):
${recommendations.map((r, i) => `${i + 1}. [${r.priority.toUpperCase()}] ${r.title}: ${r.description}`).join('\n')}

Gerado em: ${new Date().toLocaleString('pt-BR')}
  `;
}

