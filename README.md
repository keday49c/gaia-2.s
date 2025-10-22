# 🚀 APOGEU - Plataforma de Marketing Digital Automatizada

> **Seu Pico de Sucesso em Marketing Digital**

![Apogeu Logo](./client/public/logo.png)

## 📋 Visão Geral

**APOGEU** é uma plataforma completa de marketing digital automatizada que integra inteligência artificial, automação de campanhas, análise de concorrência e gerenciamento de assinaturas. Desenvolvida com tecnologias modernas e segurança robusta, oferece uma solução end-to-end para agências e profissionais de marketing.

### ✨ Características Principais

- **🤖 Automação de Campanhas**: Integração com Google Ads, Meta Ads e TikTok Ads
- **💬 Bot Omnichannel**: WhatsApp Business com IA e processamento de linguagem natural
- **✍️ Geração de Conteúdo**: Integração com OpenAI, Gemini e ElevenLabs
- **📊 Dashboards Inteligentes**: Visualizações em tempo real com Recharts
- **💳 Sistema de Assinaturas**: Pagamento via PIX e Boleto com PagBrasil
- **🔍 Análise de Concorrência**: Monitoramento e SWOT analysis
- **🔐 Segurança Robusta**: 32 testes de segurança passando
- **🖥️ Desktop Multiplataforma**: Windows, macOS e Linux

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Interface moderna e responsiva
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes profissionais
- **Recharts** - Visualizações gráficas
- **Wouter** - Roteamento SPA
- **Framer Motion** - Animações

### Backend
- **Express.js** - Framework web
- **tRPC** - RPC type-safe
- **Drizzle ORM** - Gerenciamento de banco de dados
- **MySQL/TiDB** - Banco de dados
- **Firebase** - Banco de dados em tempo real

### Integrações
- **OpenAI** - Geração de conteúdo com GPT-4
- **Google Gemini** - Análise e processamento
- **ElevenLabs** - Síntese de voz
- **Twilio** - WhatsApp Business API
- **PagBrasil** - Gateway de pagamento

### Desktop
- **Electron** - Aplicativo desktop multiplataforma
- **electron-builder** - Empacotamento e build

### Testes & Qualidade
- **Vitest** - Framework de testes
- **TypeScript** - Type checking
- **Prettier** - Code formatting

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- pnpm 10+
- MySQL 8+ (ou TiDB)

### Desenvolvimento

```bash
# Clonar repositório
git clone https://github.com/keday49c/flower-bloom-network.git
cd apogeu

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrações do banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev

# Em outro terminal, iniciar frontend
cd client
pnpm dev
```

### Build para Produção

```bash
# Build completo
pnpm build

# Build desktop (Windows)
pnpm electron-build-win

# Build desktop (macOS)
pnpm electron-build-mac

# Build desktop (Linux)
pnpm electron-build-linux
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/apogeu

# OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# APIs de Marketing
GOOGLE_ADS_API_KEY=your_key
META_BUSINESS_ACCOUNT_ID=your_id
TIKTOK_BUSINESS_ACCOUNT_ID=your_id

# Integrações
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key

# WhatsApp
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
WHATSAPP_BUSINESS_NUMBER=+5521973240704

# PagBrasil
PAGBRASIL_MERCHANT_ID=your_id
PAGBRASIL_API_KEY=your_key

# Storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket
```

## 📚 Documentação

### Estrutura do Projeto

```
apogeu/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilitários
│   └── public/            # Assets estáticos
├── server/                # Backend Express
│   ├── services/          # Lógica de negócio
│   ├── routers.ts         # Rotas tRPC
│   └── db.ts              # Queries do banco
├── drizzle/               # Schema do banco de dados
├── electron-main.ts       # Entrada do Electron
└── package.json           # Dependências
```

### Rotas Principais

#### Públicas
- `GET /` - Landing page
- `GET /pricing` - Planos de assinatura
- `POST /api/oauth/callback` - Callback OAuth

#### Autenticadas
- `GET /dashboard` - Dashboard principal
- `GET /campaigns` - Gerenciamento de campanhas
- `GET /credentials` - Configuração de APIs
- `GET /analytics` - Análise de dados
- `GET /crm` - Gerenciamento de leads
- `GET /competitors` - Análise de concorrentes
- `POST /api/trpc/*` - Endpoints tRPC

### tRPC Routers

#### `campaigns`
- `list` - Listar campanhas do usuário
- `create` - Criar nova campanha

#### `automation`
- `createAutomatedCampaign` - Criar campanha automatizada
- `fetchMetrics` - Buscar métricas de plataformas
- `optimizeCampaign` - Otimizar campanha

#### `content`
- `generate` - Gerar conteúdo com IA
- `analyze` - Analisar qualidade do conteúdo
- `optimizeForSEO` - Otimizar para SEO

#### `voice`
- `synthesize` - Sintetizar voz
- `getAvailableVoices` - Listar vozes disponíveis
- `synthesizeWithVariety` - Múltiplas vozes

#### `billing`
- `getAllPlans` - Listar planos
- `createSubscription` - Criar assinatura
- `generatePixPayment` - Gerar PIX
- `generateBoletoPayment` - Gerar Boleto
- `getPaymentHistory` - Histórico de pagamentos

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
pnpm test

# Testes específicos
pnpm test server/__tests__/security.test.ts
pnpm test server/__tests__/payment.test.ts
pnpm test server/__tests__/content.test.ts
```

### Cobertura de Testes

- ✅ 32 testes de segurança
- ✅ Validação de entrada (SQL Injection, XSS, CSRF)
- ✅ Segurança de senha
- ✅ Rate limiting
- ✅ Criptografia de dados
- ✅ Conformidade LGPD

## 🔐 Segurança

### Medidas Implementadas

1. **Input Validation**: Sanitização de entrada contra SQL Injection e XSS
2. **Authentication**: OAuth 2.0 com Manus
3. **Encryption**: AES-256-CBC para dados sensíveis
4. **Rate Limiting**: Proteção contra força bruta
5. **CSRF Protection**: Tokens CSRF validados
6. **HTTPS Only**: Forçado em produção
7. **Secure Headers**: Content-Security-Policy, X-Frame-Options
8. **API Key Management**: Validação e permissões
9. **LGPD Compliance**: Exportação e deleção de dados

## 📊 Planos de Assinatura

| Plano | Preço | Campanhas | Plataformas | IA | WhatsApp | Análise |
|-------|-------|-----------|-------------|----|---------|---------| 
| Básico | R$ 99/mês | 5 | 1 | ❌ | ❌ | ❌ |
| Pro | R$ 299/mês | 20 | 3 | ✅ | ❌ | ✅ |
| Premium | R$ 699/mês | ∞ | ∞ | ✅ | ✅ | ✅ |
| Ouro | R$ 1.499/mês | ∞ | ∞ | ✅ | ✅ | ✅ |

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- **Manus AI** - Desenvolvimento completo da plataforma
- **keday49c** - Proprietário do repositório

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: support@apogeu.com.br
- WhatsApp: +55 21 97324-0704
- GitHub Issues: [Issues](https://github.com/keday49c/flower-bloom-network/issues)

## 🗺️ Roadmap

- [ ] Integração com Google Analytics 4
- [ ] Suporte a mais plataformas de publicidade
- [ ] Marketplace de templates
- [ ] Colaboração em tempo real
- [ ] Mobile app (iOS/Android)
- [ ] Webhooks customizados
- [ ] API pública
- [ ] Machine learning para otimização

## 📈 Status do Projeto

- ✅ Fase 1: Análise e Planejamento
- ✅ Fase 2: Configuração Inicial
- ✅ Fase 3: Backend
- ✅ Fase 4: Frontend
- ✅ Fase 5: APIs de Marketing
- ✅ Fase 6: WhatsApp Bot
- ✅ Fase 7: Geração de Conteúdo
- ✅ Fase 8: Dashboards
- ✅ Fase 9: Sistema de Assinaturas
- ✅ Fase 10: Análise de Concorrência
- ✅ Fase 11: Testes de Segurança
- ✅ Fase 12: Desktop Multiplataforma
- ✅ Fase 13: Documentação e Deploy

---

**APOGEU** - Alcance o Apogeu do Seu Negócio! 🚀

