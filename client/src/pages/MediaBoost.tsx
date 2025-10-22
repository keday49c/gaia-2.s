import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Página de Impulsionamento de Mídias e Postagens
 * Boost automático em redes sociais
 */
export default function MediaBoost() {
  const [activeTab, setActiveTab] = useState('create-boost');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [boostBudget, setBoostBudget] = useState('1000');
  const [boostDuration, setBoostDuration] = useState('24');
  const [boostType, setBoostType] = useState('reach');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-500' },
    { id: 'facebook', name: 'Facebook', icon: '👍', color: 'from-blue-600 to-blue-400' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-black to-gray-800' },
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'from-gray-900 to-black' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-700 to-blue-500' },
    { id: 'youtube', name: 'YouTube', icon: '🎬', color: 'from-red-600 to-red-400' },
  ];

  const activeBoosts = [
    {
      id: 'boost-001',
      title: 'Black Friday Campaign',
      platform: 'Instagram',
      budget: 500,
      spent: 245.50,
      impressions: 45230,
      clicks: 1203,
      engagement: 3.2,
      roi: 245,
      status: 'running',
      daysLeft: 2,
    },
    {
      id: 'boost-002',
      title: 'Promoção Verão',
      platform: 'TikTok',
      budget: 300,
      spent: 298.75,
      impressions: 123456,
      clicks: 4567,
      engagement: 5.8,
      roi: 380,
      status: 'running',
      daysLeft: 1,
    },
    {
      id: 'boost-003',
      title: 'LinkedIn B2B',
      platform: 'LinkedIn',
      budget: 200,
      spent: 200.00,
      impressions: 12345,
      clicks: 234,
      engagement: 1.9,
      roi: 120,
      status: 'completed',
      daysLeft: 0,
    },
  ];

  const boostPerformanceData = [
    { day: 'Dia 1', impressions: 15000, clicks: 450, spend: 250 },
    { day: 'Dia 2', impressions: 18000, clicks: 540, spend: 300 },
    { day: 'Dia 3', impressions: 12000, clicks: 360, spend: 200 },
    { day: 'Dia 4', impressions: 20000, clicks: 600, spend: 350 },
    { day: 'Dia 5', impressions: 25000, clicks: 750, spend: 420 },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const calculateBudgetPerPlatform = () => {
    if (selectedPlatforms.length === 0) return 0;
    return (parseFloat(boostBudget) / selectedPlatforms.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🚀 Impulsionamento de Mídias</h1>
          <p className="text-gray-300">Boost automático de postagens em redes sociais</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="create-boost">Criar Boost</TabsTrigger>
            <TabsTrigger value="active-boosts">Boosts Ativos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Create Boost Tab */}
          <TabsContent value="create-boost" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Criar Novo Boost</h2>

              {/* Seleção de Plataformas */}
              <div className="mb-8">
                <Label className="text-white text-lg mb-4 block">Selecione as Plataformas</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-900'
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-3xl mb-2">{platform.icon}</div>
                      <p className="text-white font-semibold">{platform.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuração de Boost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Tipo de Boost */}
                <div>
                  <Label className="text-gray-300 mb-2 block">Tipo de Boost</Label>
                  <Select value={boostType} onValueChange={setBoostType}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="reach">📢 Alcance (Impressões)</SelectItem>
                      <SelectItem value="engagement">❤️ Engajamento (Likes/Comentários)</SelectItem>
                      <SelectItem value="conversions">🛒 Conversões (Vendas)</SelectItem>
                      <SelectItem value="traffic">🔗 Tráfego (Cliques)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Orçamento */}
                <div>
                  <Label className="text-gray-300 mb-2 block">Orçamento Total (R$)</Label>
                  <Input
                    type="number"
                    value={boostBudget}
                    onChange={(e) => setBoostBudget(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="1000"
                  />
                </div>

                {/* Duração */}
                <div>
                  <Label className="text-gray-300 mb-2 block">Duração (horas)</Label>
                  <Select value={boostDuration} onValueChange={setBoostDuration}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="12">12 horas</SelectItem>
                      <SelectItem value="24">24 horas</SelectItem>
                      <SelectItem value="48">48 horas</SelectItem>
                      <SelectItem value="72">72 horas</SelectItem>
                      <SelectItem value="168">7 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Orçamento por Plataforma */}
                <div>
                  <Label className="text-gray-300 mb-2 block">Orçamento por Plataforma</Label>
                  <Input
                    type="text"
                    value={`R$ ${calculateBudgetPerPlatform()}`}
                    readOnly
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Público-Alvo */}
              <div className="mb-8">
                <Label className="text-white text-lg mb-4 block">Configurar Público-Alvo</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Idade Mínima</Label>
                    <Input type="number" defaultValue="18" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Idade Máxima</Label>
                    <Input type="number" defaultValue="65" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Gênero</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Localização</Label>
                    <Input type="text" placeholder="Brasil" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                  ✅ Iniciar Boost
                </Button>
                <Button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 text-lg">
                  📋 Salvar como Rascunho
                </Button>
              </div>
            </Card>

            {/* Recomendações */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">💡 Recomendações</h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-900 rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-200">
                    <strong>Melhor horário:</strong> Publique entre 19h-21h para máximo engajamento
                  </p>
                </div>
                <div className="p-3 bg-purple-900 rounded-lg border-l-4 border-purple-500">
                  <p className="text-purple-200">
                    <strong>Orçamento recomendado:</strong> R$ 500-1000 para teste inicial
                  </p>
                </div>
                <div className="p-3 bg-green-900 rounded-lg border-l-4 border-green-500">
                  <p className="text-green-200">
                    <strong>Melhor plataforma:</strong> TikTok tem melhor ROI (4.68x) no momento
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Active Boosts Tab */}
          <TabsContent value="active-boosts" className="space-y-6">
            {activeBoosts.map(boost => (
              <Card key={boost.id} className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{boost.title}</h3>
                    <p className="text-gray-400">{boost.platform}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    boost.status === 'running' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {boost.status === 'running' ? '🔴 Ativo' : '✅ Concluído'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Orçamento', value: `R$ ${boost.budget.toFixed(2)}`, icon: '💰' },
                    { label: 'Gasto', value: `R$ ${boost.spent.toFixed(2)}`, icon: '💸' },
                    { label: 'Impressões', value: boost.impressions.toLocaleString(), icon: '👁️' },
                    { label: 'ROI', value: `${boost.roi}%`, icon: '📈' },
                  ].map((stat, idx) => (
                    <div key={idx} className="p-3 bg-gray-700 rounded-lg">
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-white font-bold mt-1">{stat.icon} {stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {boost.status === 'running' && (
                    <>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        ⚙️ Editar
                      </Button>
                      <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                        ⏸️ Pausar
                      </Button>
                    </>
                  )}
                  <Button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white">
                    📊 Ver Detalhes
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Performance dos Boosts</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={boostPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="day" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                  <Legend />
                  <Line type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Gasto', value: 'R$ 1.244,25', icon: '💰', color: 'bg-red-900' },
                { label: 'Total Impressões', value: '180.031', icon: '👁️', color: 'bg-blue-900' },
                { label: 'ROI Médio', value: '248%', icon: '📈', color: 'bg-green-900' },
              ].map((stat, idx) => (
                <Card key={idx} className={`${stat.color} border-gray-700 p-6`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-gray-300 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

