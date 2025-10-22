import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { BarChart3, Zap, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: plans } = trpc.subscriptions.getPlans.useQuery();
  const { data: campaigns } = trpc.campaigns.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
              <span className="text-xl font-bold">{APP_TITLE}</span>
            </div>
            <Button asChild variant="default">
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h1 className="text-5xl font-bold mb-6">
              Automação Inteligente de Marketing Digital
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Crie, gerencie e otimize campanhas em múltiplas plataformas com robôs de automação alimentados por IA
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href={getLoginUrl()}>Começar Gratuitamente</a>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Zap className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle>Automação Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Automatize campanhas em Google Ads, Meta, TikTok e muito mais
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle>Analytics Avançado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Dashboards em tempo real com métricas detalhadas e insights acionáveis
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle>Bot Omnichannel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Atendimento automático via WhatsApp, chat e redes sociais
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Planos de Assinatura</h2>
            <p className="text-slate-300 mb-8">
              Escolha o plano ideal para suas necessidades
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href={getLoginUrl()}>Ver Planos</a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <span className="text-xl font-bold">{APP_TITLE}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Olá, {user?.name || "Usuário"}</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account">Minha Conta</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaigns?.filter(c => c.status === "active").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Premium</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Próxima Renovação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">30 dias</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesse as principais funcionalidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline">
                <Link href="/campaigns">Gerenciar Campanhas</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/credentials">Configurar APIs</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/analytics">Ver Analytics</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/crm">Gerenciar Leads</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
              <CardDescription>Configure sua conta para começar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-medium">Conta Criada</p>
                  <p className="text-sm text-slate-600">Você já está registrado</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Adicionar Credenciais</p>
                  <p className="text-sm text-slate-600">Conecte suas APIs de marketing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Criar Primeira Campanha</p>
                  <p className="text-sm text-slate-600">Lance sua primeira automação</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

