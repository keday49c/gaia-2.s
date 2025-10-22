import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Página Avançada de Controle de Campanhas
 * Controle refinado e apurado com métricas profissionais
 */
export default function AdvancedCampaignControl() {
  const [selectedCampaign, setSelectedCampaign] = useState('campaign-001');
  const [dateRange, setDateRange] = useState('7days');
  const [activeTab, setActiveTab] = useState('overview');

  // Dados de exemplo de campanhas
  const campaigns = [
    {
      id: 'campaign-001',
      name: 'Black Friday 2024',
      platform: 'Google Ads',
      status: 'ativa',
      impressions: 125430,
      clicks: 3847,
      conversions: 287,
      spend: 4230.50,
      revenue: 14320.00,
      ctr: 3.06,
      cpc: 1.10,
      cpa: 14.74,
      roas: 3.38,
      roi: 238.5,
      quality_score: 8.5,
    },
    {
      id: 'campaign-002',
      name: 'Promoção Verão',
      platform: 'Meta Ads',
      status: 'ativa',
      impressions: 98765,
      clicks: 2543,
      conversions: 156,
      spend: 2150.00,
      revenue: 8920.00,
      ctr: 2.57,
      cpc: 0.85,
      cpa: 13.78,
      roas: 4.15,
      roi: 315.0,
      quality_score: 8.2,
    },
    {
      id: 'campaign-003',
      name: 'TikTok Viral',
      platform: 'TikTok Ads',
      status: 'pausada',
      impressions: 456789,
      clicks: 8934,
      conversions: 234,
      spend: 1500.00,
      revenue: 7020.00,
      ctr: 1.96,
      cpc: 0.17,
      cpa: 6.41,
      roas: 4.68,
      roi: 368.0,
      quality_score: 7.8,
    },
  ];

  const currentCampaign = campaigns.find(c => c.id === selectedCampaign) || campaigns[0];

  // Dados de performance ao longo do tempo
  const performanceData = [
    { date: '22 Oct', impressions: 12543, clicks: 385, conversions: 28, spend: 423 },
    { date: '23 Oct', impressions: 15234, clicks: 467, conversions: 35, spend: 512 },
    { date: '24 Oct', impressions: 18765, clicks: 578, conversions: 42, spend: 634 },
    { date: '25 Oct', impressions: 14321, clicks: 441, conversions: 32, spend: 487 },
    { date: '26 Oct', impressions: 19876, clicks: 612, conversions: 48, spend: 721 },
    { date: '27 Oct', impossions: 21345, clicks: 657, conversions: 52, spend: 798 },
    { date: '28 Oct', impressions: 17654, clicks: 543, conversions: 39, spend: 623 },
  ];

  // Recomendações de otimização
  const recommendations = [
    {
      type: 'budget',
      priority: 'high',
      title: 'Aumentar Orçamento',
      description: 'ROAS excelente (3.38x). Aumente o orçamento em 20-50% para escalar.',
      impact: '+30%',
    },
    {
      type: 'creative',
      priority: 'medium',
      title: 'Testar Novos Criativos',
      description: 'CTR está bom, mas teste 3-5 variações para otimizar ainda mais.',
      impact: '+15%',
    },
    {
      type: 'targeting',
      priority: 'low',
      title: 'Refinar Público-Alvo',
      description: 'Considere segmentar por comportamento de compra anterior.',
      impact: '+10%',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Controle Avançado de Campanhas</h1>
          <p className="text-gray-300">Métricas refinadas e apuradas para máximo controle</p>
        </div>

        {/* Seletor de Campanha */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              onClick={() => setSelectedCampaign(campaign.id)}
              className={`p-4 cursor-pointer transition-all ${
                selectedCampaign === campaign.id
                  ? 'bg-blue-600 border-blue-400'
                  : 'bg-gray-800 border-gray-700 hover:border-blue-500'
              }`}
            >
              <p className="text-white font-semibold">{campaign.name}</p>
              <p className="text-gray-300 text-sm">{campaign.platform}</p>
              <p className={`text-sm mt-2 ${campaign.status === 'ativa' ? 'text-green-400' : 'text-yellow-400'}`}>
                {campaign.status === 'ativa' ? '✅ Ativa' : '⏸️ Pausada'}
              </p>
            </Card>
          ))}
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'ROAS', value: `${currentCampaign.roas.toFixed(2)}x`, icon: '📈', color: 'text-green-400' },
            { label: 'ROI', value: `${currentCampaign.roi.toFixed(1)}%`, icon: '💰', color: 'text-blue-400' },
            { label: 'CTR', value: `${currentCampaign.ctr.toFixed(2)}%`, icon: '🎯', color: 'text-purple-400' },
            { label: 'Quality Score', value: `${currentCampaign.quality_score}/10`, icon: '⭐', color: 'text-yellow-400' },
          ].map((kpi, idx) => (
            <Card key={idx} className="bg-gray-800 border-gray-700 p-6">
              <div className="text-3xl mb-2">{kpi.icon}</div>
              <p className="text-gray-400 text-sm">{kpi.label}</p>
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="metrics">Métricas Detalhadas</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            <TabsTrigger value="forecast">Previsões</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Performance ao Longo do Tempo</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Distribuição de Gastos</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Google Ads', value: 4230 },
                        { name: 'Meta Ads', value: 2150 },
                        { name: 'TikTok', value: 1500 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: R$ ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#8b5cf6" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="bg-gray-800 border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Comparação de Métricas</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={campaigns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="roas" fill="#10b981" name="ROAS" />
                    <Bar dataKey="ctr" fill="#3b82f6" name="CTR (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Métricas Detalhadas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Impressões', value: currentCampaign.impressions.toLocaleString(), unit: '' },
                  { label: 'Cliques', value: currentCampaign.clicks.toLocaleString(), unit: '' },
                  { label: 'Conversões', value: currentCampaign.conversions.toLocaleString(), unit: '' },
                  { label: 'Gasto Total', value: `R$ ${currentCampaign.spend.toFixed(2)}`, unit: '' },
                  { label: 'Receita Total', value: `R$ ${currentCampaign.revenue.toFixed(2)}`, unit: '' },
                  { label: 'CPC', value: `R$ ${currentCampaign.cpc.toFixed(2)}`, unit: 'por clique' },
                  { label: 'CPA', value: `R$ ${currentCampaign.cpa.toFixed(2)}`, unit: 'por conversão' },
                  { label: 'Taxa de Conversão', value: `${((currentCampaign.conversions / currentCampaign.clicks) * 100).toFixed(2)}%`, unit: '' },
                  { label: 'CPM', value: `R$ ${((currentCampaign.spend / currentCampaign.impressions) * 1000).toFixed(2)}`, unit: 'por mil impressões' },
                ].map((metric, idx) => (
                  <div key={idx} className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-400 text-sm">{metric.label}</p>
                    <p className="text-2xl font-bold text-white mt-2">{metric.value}</p>
                    {metric.unit && <p className="text-gray-500 text-xs mt-1">{metric.unit}</p>}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recomendações de Otimização</h2>
              
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{rec.title}</p>
                        <p className="text-gray-300 text-sm mt-1">{rec.description}</p>
                        <div className="mt-3 flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            rec.priority === 'high' ? 'bg-red-900 text-red-300' :
                            rec.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-blue-900 text-blue-300'
                          }`}>
                            {rec.priority.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-semibold">
                            Impacto: {rec.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Previsão de Performance (7 dias)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                  <Legend />
                  <Line type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Gasto Previsto" />
                  <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} name="Conversões Previstas" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

