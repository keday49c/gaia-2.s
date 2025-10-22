import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, Target, Users, DollarSign, Activity, Calendar } from "lucide-react";

// Sample data for charts
const campaignPerformanceData = [
  { name: "Week 1", clicks: 400, conversions: 240, impressions: 2400 },
  { name: "Week 2", clicks: 300, conversions: 221, impressions: 2210 },
  { name: "Week 3", clicks: 200, conversions: 229, impressions: 2290 },
  { name: "Week 4", clicks: 278, conversions: 200, impressions: 2000 },
  { name: "Week 5", clicks: 189, conversions: 229, impressions: 2181 },
  { name: "Week 6", clicks: 239, conversions: 200, impressions: 2500 },
];

const platformDistributionData = [
  { name: "Google Ads", value: 35, fill: "#3b82f6" },
  { name: "Meta Ads", value: 30, fill: "#a855f7" },
  { name: "TikTok Ads", value: 20, fill: "#ec4899" },
  { name: "LinkedIn Ads", value: 15, fill: "#06b6d4" },
];

const roiByPlatformData = [
  { platform: "Google Ads", roi: 320, spent: 5000 },
  { platform: "Meta Ads", roi: 280, spent: 4500 },
  { platform: "TikTok Ads", roi: 450, spent: 3000 },
  { platform: "LinkedIn Ads", roi: 200, spent: 2500 },
];

const engagementTrendData = [
  { date: "Mon", engagement: 65, reach: 1200 },
  { date: "Tue", engagement: 78, reach: 1400 },
  { date: "Wed", engagement: 82, reach: 1600 },
  { date: "Thu", engagement: 75, reach: 1500 },
  { date: "Fri", engagement: 88, reach: 1800 },
  { date: "Sat", engagement: 92, reach: 2000 },
  { date: "Sun", engagement: 85, reach: 1900 },
];

const COLORS = ["#3b82f6", "#a855f7", "#ec4899", "#06b6d4"];

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { data: campaigns } = trpc.campaigns.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <div>Acesso não autorizado</div>;
  }

  const activeCampaigns = campaigns?.filter((c) => c.status === "active").length || 0;
  const totalSpent = roiByPlatformData.reduce((sum, p) => sum + p.spent, 0);
  const totalROI = roiByPlatformData.reduce((sum, p) => sum + p.roi, 0);
  const avgCTR = ((campaignPerformanceData.reduce((sum, d) => sum + d.clicks, 0) / 
    campaignPerformanceData.reduce((sum, d) => sum + d.impressions, 0)) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Header */}
      <nav className="border-b border-purple-700/30 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Apogeu" className="h-8 w-8" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              APOGEU Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">← Voltar</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-200">Campanhas Ativas</CardTitle>
                <Target className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activeCampaigns}</div>
              <p className="text-xs text-blue-300 mt-2">+2 esta semana</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-200">Gasto Total</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">R$ {(totalSpent / 1000).toFixed(1)}k</div>
              <p className="text-xs text-purple-300 mt-2">Este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 border-pink-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-pink-200">ROI Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-pink-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalROI.toFixed(0)}%</div>
              <p className="text-xs text-pink-300 mt-2">+15% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border-cyan-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-cyan-200">CTR Médio</CardTitle>
                <Activity className="h-4 w-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{avgCTR}%</div>
              <p className="text-xs text-cyan-300 mt-2">Todas as campanhas</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Performance Over Time */}
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Performance ao Longo do Tempo</CardTitle>
              <CardDescription className="text-slate-400">Clicks, conversões e impressões</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }} />
                  <Legend />
                  <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#a855f7" strokeWidth={2} />
                  <Line type="monotone" dataKey="impressions" stroke="#ec4899" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Distribuição por Plataforma</CardTitle>
              <CardDescription className="text-slate-400">Gastos por canal</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* ROI by Platform */}
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">ROI por Plataforma</CardTitle>
              <CardDescription className="text-slate-400">Retorno sobre investimento</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiByPlatformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis stroke="#9ca3af" dataKey="platform" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }} />
                  <Legend />
                  <Bar dataKey="roi" fill="#3b82f6" name="ROI %" />
                  <Bar dataKey="spent" fill="#a855f7" name="Gasto (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Trend */}
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Tendência de Engajamento</CardTitle>
              <CardDescription className="text-slate-400">Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={engagementTrendData}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis stroke="#9ca3af" dataKey="date" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }} />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorEngagement)"
                  />
                  <Area
                    type="monotone"
                    dataKey="reach"
                    stroke="#a855f7"
                    fillOpacity={1}
                    fill="url(#colorReach)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card className="bg-slate-800/40 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Campanhas Recentes</CardTitle>
            <CardDescription className="text-slate-400">Últimas campanhas criadas</CardDescription>
          </CardHeader>
          <CardContent>
            {campaigns && campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div>
                      <p className="font-medium text-white">{campaign.name}</p>
                      <p className="text-sm text-slate-400">{campaign.platform}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        campaign.status === "active"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-slate-500/20 text-slate-300"
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">Nenhuma campanha criada ainda</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

