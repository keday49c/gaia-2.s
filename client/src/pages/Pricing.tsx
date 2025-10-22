import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Check, X } from "lucide-react";

const pricingPlans = [
  {
    id: "basic",
    name: "Básico",
    description: "Para iniciantes",
    price: 99,
    period: "mês",
    features: [
      { name: "Até 5 campanhas", included: true },
      { name: "1 plataforma de anúncios", included: true },
      { name: "Analytics básico", included: true },
      { name: "Suporte por email", included: true },
      { name: "Geração de conteúdo com IA", included: false },
      { name: "Bot WhatsApp", included: false },
      { name: "Análise de concorrência", included: false },
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para profissionais",
    price: 299,
    period: "mês",
    features: [
      { name: "Até 20 campanhas", included: true },
      { name: "3 plataformas de anúncios", included: true },
      { name: "Analytics avançado", included: true },
      { name: "Suporte por email e chat", included: true },
      { name: "Geração de conteúdo com IA", included: true },
      { name: "Bot WhatsApp", included: false },
      { name: "Análise de concorrência", included: false },
    ],
    highlighted: false,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Para agências",
    price: 699,
    period: "mês",
    features: [
      { name: "Campanhas ilimitadas", included: true },
      { name: "Todas as plataformas", included: true },
      { name: "Analytics em tempo real", included: true },
      { name: "Suporte prioritário 24/7", included: true },
      { name: "Geração de conteúdo com IA", included: true },
      { name: "Bot WhatsApp omnichannel", included: true },
      { name: "Análise de concorrência", included: false },
    ],
    highlighted: true,
  },
  {
    id: "ouro",
    name: "Ouro",
    description: "Solução empresarial",
    price: 1499,
    period: "mês",
    features: [
      { name: "Campanhas ilimitadas", included: true },
      { name: "Todas as plataformas", included: true },
      { name: "Analytics em tempo real", included: true },
      { name: "Suporte dedicado 24/7", included: true },
      { name: "Geração de conteúdo com IA", included: true },
      { name: "Bot WhatsApp omnichannel", included: true },
      { name: "Análise de concorrência avançada", included: true },
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const { data: userPlan } = trpc.subscriptions.getUserPlan.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Header */}
      <nav className="border-b border-purple-700/30 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Apogeu" className="h-8 w-8" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              APOGEU Planos
            </span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Planos de Assinatura
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Escolha o plano perfeito para suas necessidades de marketing digital
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-slate-400">Faturamento Mensal</span>
            <div className="bg-slate-800/50 rounded-full p-1 flex">
              <button className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium">
                Mensal
              </button>
              <button className="px-6 py-2 rounded-full text-slate-400 hover:text-white">
                Anual (20% desconto)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.highlighted
                  ? "bg-gradient-to-br from-purple-900/60 to-blue-900/60 border-purple-600/80 ring-2 ring-purple-600/50"
                  : "bg-slate-800/40 border-slate-700/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <CardDescription className="text-slate-400">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">R$ {plan.price}</span>
                    <span className="text-slate-400">/{plan.period}</span>
                  </div>
                </div>

                <Button
                  className={`w-full mb-8 font-semibold ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {userPlan?.planId === plan.id ? "Plano Atual" : "Escolher Plano"}
                </Button>

                <div className="space-y-3 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Perguntas Frequentes</h2>

          <div className="space-y-4">
            <Card className="bg-slate-800/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Posso mudar de plano a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças
                entram em vigor no próximo ciclo de faturamento.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Qual é a política de cancelamento?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento.
                Seu acesso continuará até o final do período de faturamento.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Vocês oferecem período de teste gratuito?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Sim! Todos os planos incluem 14 dias de teste gratuito. Nenhum cartão de crédito
                necessário para começar.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Quais métodos de pagamento vocês aceitam?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Aceitamos PIX (instantâneo), Boleto Bancário e Cartão de Crédito através do PagBrasil.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Há desconto para pagamento anual?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Sim! Oferecemos 20% de desconto se você pagar anualmente em vez de mensalmente.
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

