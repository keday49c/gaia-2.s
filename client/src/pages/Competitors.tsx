import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TrendingUp, AlertTriangle, Target, Zap } from "lucide-react";

const mockCompetitors = [
  {
    id: "comp1",
    name: "MarketingPro",
    website: "marketingpro.com.br",
    marketShare: 28,
    traffic: 250000,
    riskLevel: "high",
    position: "leader",
    strengths: ["Strong brand", "Large audience", "Advanced features"],
    weaknesses: ["High pricing", "Poor UX", "Limited support"],
  },
  {
    id: "comp2",
    name: "CampaignBoost",
    website: "campaignboost.com.br",
    marketShare: 18,
    traffic: 150000,
    riskLevel: "medium",
    position: "challenger",
    strengths: ["Good pricing", "Easy to use", "Fast support"],
    weaknesses: ["Limited integrations", "Small team", "New in market"],
  },
  {
    id: "comp3",
    name: "DigitalFlow",
    website: "digitalflow.com.br",
    marketShare: 12,
    traffic: 80000,
    riskLevel: "medium",
    position: "follower",
    strengths: ["Niche focus", "Specialized tools", "Community"],
    weaknesses: ["Limited scalability", "Outdated tech", "Poor marketing"],
  },
  {
    id: "comp4",
    name: "AutoMarketing",
    website: "automarketing.com.br",
    marketShare: 8,
    traffic: 45000,
    riskLevel: "low",
    position: "niche",
    strengths: ["AI-powered", "Automation", "Affordable"],
    weaknesses: ["No support", "Limited features", "Unstable"],
  },
];

export default function Competitors() {
  const { isAuthenticated } = useAuth();
  const [selectedCompetitor, setSelectedCompetitor] = useState(mockCompetitors[0]);
  const [searchTerm, setSearchTerm] = useState("");

  if (!isAuthenticated) {
    return <div>Acesso não autorizado</div>;
  }

  const filteredCompetitors = mockCompetitors.filter((comp) =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-slate-400";
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500/20";
      case "medium":
        return "bg-yellow-500/20";
      case "low":
        return "bg-green-500/20";
      default:
        return "bg-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Header */}
      <nav className="border-b border-purple-700/30 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Apogeu" className="h-8 w-8" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              APOGEU Análise de Concorrentes
            </span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Buscar concorrente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Competitors List */}
          <div className="md:col-span-1">
            <Card className="bg-slate-800/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Concorrentes</CardTitle>
                <CardDescription className="text-slate-400">
                  {filteredCompetitors.length} concorrentes encontrados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredCompetitors.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompetitor(comp)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedCompetitor.id === comp.id
                        ? "bg-blue-600/30 border border-blue-600/50"
                        : "bg-slate-700/30 hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{comp.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getRiskBg(comp.riskLevel)} ${getRiskColor(comp.riskLevel)}`}>
                        {comp.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{comp.website}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Competitor Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="bg-slate-800/40 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{selectedCompetitor.name}</CardTitle>
                    <CardDescription className="text-slate-400">{selectedCompetitor.website}</CardDescription>
                  </div>
                  <span className={`px-4 py-2 rounded-lg font-semibold ${getRiskBg(selectedCompetitor.riskLevel)} ${getRiskColor(selectedCompetitor.riskLevel)}`}>
                    {selectedCompetitor.riskLevel === "high" && <AlertTriangle className="inline mr-2 h-4 w-4" />}
                    Risco: {selectedCompetitor.riskLevel.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Market Share</p>
                    <p className="text-2xl font-bold text-white">{selectedCompetitor.marketShare}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Traffic Mensal</p>
                    <p className="text-2xl font-bold text-white">{(selectedCompetitor.traffic / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Posição</p>
                    <p className="text-2xl font-bold text-white capitalize">{selectedCompetitor.position}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SWOT Analysis */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-green-900/20 border-green-700/50">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Forças
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedCompetitor.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-green-300">
                        ✓ {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-700/50">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Fraquezas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedCompetitor.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm text-red-300">
                        ✗ {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="bg-slate-800/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-300">
                  {selectedCompetitor.riskLevel === "high"
                    ? "Este é um concorrente forte. Foque em diferenciação e inovação."
                    : selectedCompetitor.riskLevel === "medium"
                    ? "Concorrente moderado. Compete em recursos específicos ou preço."
                    : "Concorrente fraco. Oportunidade de ganhar market share."}
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Ver Análise Completa
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Overview */}
        <Card className="bg-slate-800/40 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Visão Geral do Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Líder de Mercado</p>
                <p className="text-lg font-bold text-white">{mockCompetitors[0].name}</p>
                <p className="text-xs text-slate-500">{mockCompetitors[0].marketShare}% market share</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Preço Médio</p>
                <p className="text-lg font-bold text-white">R$ 450</p>
                <p className="text-xs text-slate-500">Por plano/mês</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Tendência</p>
                <p className="text-lg font-bold text-green-400">↑ +12%</p>
                <p className="text-xs text-slate-500">Crescimento anual</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Oportunidade</p>
                <p className="text-lg font-bold text-blue-400">Alta</p>
                <p className="text-xs text-slate-500">Mercado em expansão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

