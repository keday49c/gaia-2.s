import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Página de Guia Passo a Passo Interativo
 * Instruções completas para usar o APOGEU
 */
export default function InteractiveGuide() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedDay, setExpandedDay] = useState(0);

  const guideSteps = [
    {
      id: 1,
      title: 'Fazer Login',
      description: 'Acesse sua conta no APOGEU',
      details: [
        'Clique no botão "Login" no canto superior direito',
        'Insira seu email e senha',
        'Clique em "Entrar"',
        'Você será redirecionado para o Dashboard',
      ],
      icon: '🔐',
      duration: '2 minutos',
    },
    {
      id: 2,
      title: 'Criar Primeira Campanha',
      description: 'Configure sua primeira campanha de marketing',
      details: [
        'Acesse "Campanhas" no menu lateral',
        'Clique em "Nova Campanha"',
        'Preencha os dados: Nome, Orçamento, Plataforma',
        'Selecione seu público-alvo',
        'Clique em "Criar Campanha"',
      ],
      icon: '📊',
      duration: '10 minutos',
    },
    {
      id: 3,
      title: 'Configurar Credenciais',
      description: 'Conecte suas contas de marketing',
      details: [
        'Acesse "Credenciais" no menu',
        'Clique em "Adicionar Credencial"',
        'Selecione a plataforma (Google Ads, Meta, TikTok)',
        'Insira sua chave de API',
        'Clique em "Validar e Salvar"',
      ],
      icon: '🔑',
      duration: '5 minutos',
    },
    {
      id: 4,
      title: 'Gerar Conteúdo com IA',
      description: 'Crie conteúdo automaticamente com IA',
      details: [
        'Acesse "Campanhas"',
        'Clique em "Gerar Conteúdo"',
        'Descreva o que você quer',
        'Escolha o tom (Profissional, Criativo, Divertido)',
        'Clique em "Gerar"',
        'Edite se necessário e publique',
      ],
      icon: '🤖',
      duration: '3 minutos',
    },
    {
      id: 5,
      title: 'Impulsionar Postagem',
      description: 'Aumente o alcance de sua postagem',
      details: [
        'Acesse "Impulsionamento de Mídias"',
        'Selecione as plataformas desejadas',
        'Defina o orçamento',
        'Configure o público-alvo',
        'Clique em "Iniciar Boost"',
      ],
      icon: '🚀',
      duration: '5 minutos',
    },
    {
      id: 6,
      title: 'Acompanhar Performance',
      description: 'Veja como suas campanhas estão performando',
      details: [
        'Acesse "Analytics" no menu',
        'Veja os gráficos de performance',
        'Analise as métricas principais (CTR, ROAS, ROI)',
        'Leia as recomendações automáticas',
        'Otimize suas campanhas conforme necessário',
      ],
      icon: '📈',
      duration: '5 minutos',
    },
    {
      id: 7,
      title: 'Analisar Concorrentes',
      description: 'Entenda o que seus concorrentes estão fazendo',
      details: [
        'Acesse "Análise de Concorrentes"',
        'Clique em "Adicionar Concorrente"',
        'Insira o website do concorrente',
        'Aguarde a análise',
        'Veja a análise SWOT e recomendações',
      ],
      icon: '🔍',
      duration: '5 minutos',
    },
    {
      id: 8,
      title: 'Gerenciar Assinatura',
      description: 'Escolha o plano certo para você',
      details: [
        'Acesse "Planos" no menu',
        'Compare os diferentes planos',
        'Clique em "Escolher Plano"',
        'Selecione a forma de pagamento (PIX ou Boleto)',
        'Conclua o pagamento',
      ],
      icon: '💳',
      duration: '5 minutos',
    },
  ];

  const weeklyWorkflow = [
    {
      day: 'SEGUNDA',
      icon: '📋',
      tasks: [
        'Criar nova campanha',
        'Configurar Google Ads, Meta Ads, TikTok',
        'Gerar conteúdo com IA',
        'Publicar automaticamente',
      ],
    },
    {
      day: 'TERÇA A DOMINGO',
      icon: '📊',
      tasks: [
        'APOGEU coleta dados em tempo real',
        'Calcula métricas (CTR, CPA, ROAS)',
        'Analisa performance',
        'Gera recomendações',
        'Bot responde clientes no WhatsApp',
        'Você acompanha no Dashboard',
      ],
    },
    {
      day: 'PRÓXIMA SEGUNDA',
      icon: '✅',
      tasks: [
        'Ver relatório completo',
        'Analisar o que funcionou',
        'Otimizar a campanha',
        'Criar nova campanha',
        'Ciclo continua...',
      ],
    },
  ];

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const progressPercentage = (completedSteps.length / guideSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📚 Guia Passo a Passo Interativo</h1>
          <p className="text-gray-300">Aprenda a usar o APOGEU de forma completa e profissional</p>
        </div>

        {/* Progresso */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Seu Progresso</h2>
            <span className="text-2xl font-bold text-blue-400">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {completedSteps.length} de {guideSteps.length} passos concluídos
          </p>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="steps" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="steps">Passos Básicos</TabsTrigger>
            <TabsTrigger value="workflow">Fluxo Semanal</TabsTrigger>
            <TabsTrigger value="tips">Dicas Profissionais</TabsTrigger>
          </TabsList>

          {/* Steps Tab */}
          <TabsContent value="steps" className="space-y-4">
            {guideSteps.map((step, idx) => (
              <Card
                key={step.id}
                className={`border-gray-700 p-6 cursor-pointer transition-all ${
                  completedSteps.includes(step.id)
                    ? 'bg-green-900 border-green-600'
                    : 'bg-gray-800 hover:border-blue-500'
                }`}
                onClick={() => setCurrentStep(idx)}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={completedSteps.includes(step.id)}
                    onChange={() => toggleStep(step.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-6 h-6 mt-1 cursor-pointer"
                  />

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{step.icon}</span>
                      <div>
                        <h3 className={`text-lg font-bold ${completedSteps.includes(step.id) ? 'text-green-300 line-through' : 'text-white'}`}>
                          {step.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{step.description}</p>
                      </div>
                    </div>

                    {/* Detalhes */}
                    {currentStep === idx && (
                      <div className="mt-4 ml-12 space-y-2 bg-gray-700 p-4 rounded-lg">
                        {step.details.map((detail, detailIdx) => (
                          <div key={detailIdx} className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold">{detailIdx + 1}.</span>
                            <span className="text-gray-300">{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 ml-12">
                      <span className="text-gray-400 text-sm">⏱️ {step.duration}</span>
                      <Button
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentStep(idx);
                        }}
                      >
                        {currentStep === idx ? '▼ Menos detalhes' : '▶ Mais detalhes'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Alert className="bg-blue-900 border-blue-700">
              <AlertDescription className="text-blue-100">
                📅 Este é o fluxo recomendado para máxima eficiência. Siga este padrão para obter melhores resultados!
              </AlertDescription>
            </Alert>

            {weeklyWorkflow.map((day, idx) => (
              <Card
                key={idx}
                className="bg-gray-800 border-gray-700 p-6 cursor-pointer hover:border-blue-500 transition-all"
                onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{day.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{day.day}</h3>
                </div>

                {expandedDay === idx && (
                  <div className="space-y-3 mt-4 pl-16">
                    {day.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="flex items-start gap-3">
                        <span className="text-blue-400 font-bold">✓</span>
                        <span className="text-gray-300">{task}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: '💡 Dica 1: Teste Sempre',
                  content: 'Crie múltiplas variações de anúncios e teste para encontrar o melhor desempenho.',
                  color: 'bg-blue-900',
                },
                {
                  title: '🎯 Dica 2: Segmentação Precisa',
                  content: 'Quanto mais específico seu público-alvo, melhor será seu ROI.',
                  color: 'bg-purple-900',
                },
                {
                  title: '📊 Dica 3: Acompanhe Métricas',
                  content: 'Verifique suas métricas diariamente. Dados são a chave do sucesso.',
                  color: 'bg-green-900',
                },
                {
                  title: '💰 Dica 4: Otimize Orçamento',
                  content: 'Aumente gastos em campanhas com ROAS > 3x e reduza as com ROAS < 1x.',
                  color: 'bg-red-900',
                },
                {
                  title: '🤖 Dica 5: Use IA',
                  content: 'Deixe a IA gerar conteúdo. Economize tempo e obtenha ideias criativas.',
                  color: 'bg-yellow-900',
                },
                {
                  title: '🔄 Dica 6: Ciclo Contínuo',
                  content: 'Siga o fluxo semanal. Criar → Publicar → Analisar → Otimizar.',
                  color: 'bg-indigo-900',
                },
              ].map((tip, idx) => (
                <Card key={idx} className={`${tip.color} border-gray-700 p-6`}>
                  <h3 className="text-lg font-bold text-white mb-3">{tip.title}</h3>
                  <p className="text-gray-200">{tip.content}</p>
                </Card>
              ))}
            </div>

            {/* Checklist de Boas Práticas */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">✅ Checklist de Boas Práticas</h2>
              <div className="space-y-3">
                {[
                  'Sempre validar credenciais antes de criar campanha',
                  'Usar público-alvo específico (não "todos")',
                  'Testar pelo menos 3 variações de criativo',
                  'Acompanhar métricas diariamente',
                  'Ajustar orçamento baseado em performance',
                  'Usar IA para gerar conteúdo',
                  'Responder clientes no WhatsApp',
                  'Fazer backup de dados regularmente',
                  'Revisar concorrentes mensalmente',
                  'Otimizar campanhas a cada semana',
                ].map((practice, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <input type="checkbox" className="w-5 h-5" />
                    <span className="text-gray-300">{practice}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
            🚀 Começar Agora
          </Button>
        </div>
      </div>
    </div>
  );
}

