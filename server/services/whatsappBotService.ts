import axios, { AxiosInstance } from "axios";
import * as db from "../db";

/**
 * WhatsApp Bot Service
 * Handles WhatsApp Business API integration and conversational AI
 */

export interface WhatsAppConfig {
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookToken: string;
}

export interface ConversationContext {
  phoneNumber: string;
  userId: string;
  conversationHistory: Array<{
    role: "user" | "bot";
    content: string;
    timestamp: Date;
  }>;
  leadData?: Record<string, any>;
}

export class WhatsAppBotService {
  private whatsappClient: AxiosInstance | null = null;
  private conversationContexts: Map<string, ConversationContext> = new Map();

  /**
   * Initialize WhatsApp API client
   */
  initializeWhatsApp(config: WhatsAppConfig) {
    this.whatsappClient = axios.create({
      baseURL: `https://graph.instagram.com/v18.0/${config.phoneNumberId}`,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Send a message via WhatsApp
   */
  async sendMessage(phoneNumber: string, message: string) {
    if (!this.whatsappClient) {
      throw new Error("WhatsApp client not initialized");
    }

    try {
      const response = await this.whatsappClient.post("/messages", {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: {
          body: message,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      throw error;
    }
  }

  /**
   * Send an interactive message (buttons, lists)
   */
  async sendInteractiveMessage(
    phoneNumber: string,
    headerText: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
  ) {
    if (!this.whatsappClient) {
      throw new Error("WhatsApp client not initialized");
    }

    try {
      const response = await this.whatsappClient.post("/messages", {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "text",
            text: headerText,
          },
          body: {
            text: bodyText,
          },
          action: {
            buttons: buttons.map((btn) => ({
              type: "reply",
              reply: {
                id: btn.id,
                title: btn.title,
              },
            })),
          },
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error sending interactive message:", error);
      throw error;
    }
  }

  /**
   * Send media message (image, video, document)
   */
  async sendMediaMessage(
    phoneNumber: string,
    mediaType: "image" | "video" | "document",
    mediaUrl: string,
    caption?: string
  ) {
    if (!this.whatsappClient) {
      throw new Error("WhatsApp client not initialized");
    }

    try {
      const payload: any = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: mediaType,
        [mediaType]: {
          link: mediaUrl,
        },
      };

      if (caption && mediaType === "image") {
        payload.image.caption = caption;
      }

      const response = await this.whatsappClient.post("/messages", payload);
      return response.data;
    } catch (error) {
      console.error("Error sending media message:", error);
      throw error;
    }
  }

  /**
   * Process incoming message and generate response using NLP
   */
  async processIncomingMessage(
    userId: string,
    phoneNumber: string,
    messageText: string
  ): Promise<string> {
    try {
      // Get or create conversation context
      let context = this.conversationContexts.get(phoneNumber);
      if (!context) {
        context = {
          phoneNumber,
          userId,
          conversationHistory: [],
          leadData: {},
        };
        this.conversationContexts.set(phoneNumber, context);
      }

      // Add user message to history
      context.conversationHistory.push({
        role: "user",
        content: messageText,
        timestamp: new Date(),
      });

      // Save interaction to database
      await db.createWhatsappInteraction({
        id: `interaction_${Date.now()}`,
        userId,
        phoneNumber,
        messageType: "text",
        messageContent: messageText,
        senderType: "user",
        status: "received",
      });

      // Generate bot response using NLP
      const botResponse = await this.generateBotResponse(context, messageText);

      // Add bot response to history
      context.conversationHistory.push({
        role: "bot",
        content: botResponse,
        timestamp: new Date(),
      });

      // Save bot response to database
      await db.createWhatsappInteraction({
        id: `interaction_${Date.now() + 1}`,
        userId,
        phoneNumber,
        messageType: "text",
        messageContent: botResponse,
        senderType: "bot",
        status: "sent",
      });

      return botResponse;
    } catch (error) {
      console.error("Error processing incoming message:", error);
      throw error;
    }
  }

  /**
   * Generate bot response using NLP and intent recognition
   */
  private async generateBotResponse(
    context: ConversationContext,
    userMessage: string
  ): Promise<string> {
    // Intent recognition
    const intent = this.recognizeIntent(userMessage);

    switch (intent) {
      case "greeting":
        return "Olá! 👋 Bem-vindo à nossa plataforma de marketing digital. Como posso ajudá-lo?";

      case "pricing":
        return "Temos 3 planos disponíveis:\n\n📦 Standard: R$50/mês\n💎 Premium: R$100/mês\n👑 Ouro: R$150/mês\n\nQual plano te interessa?";

      case "features":
        return "Nossas principais features incluem:\n✅ Automação de campanhas\n✅ Analytics em tempo real\n✅ Bot omnichannel\n✅ Integração com múltiplas plataformas\n\nDeseja saber mais sobre alguma?";

      case "contact_info":
        return "Você pode nos contatar através deste chat ou enviar um email para support@platform.com";

      case "lead_qualification":
        return "Ótimo! Para melhor atendê-lo, qual é seu nome e email?";

      case "schedule_demo":
        return "Gostaria de agendar uma demonstração? Qual dia e horário funcionam melhor para você?";

      default:
        return "Entendi sua pergunta. Deixe-me processar isso e retorno com uma resposta mais precisa. Você pode também falar com nosso time de suporte.";
    }
  }

  /**
   * Recognize user intent from message
   */
  private recognizeIntent(message: string): string {
    const lowerMessage = message.toLowerCase();

    const intents: Record<string, string[]> = {
      greeting: [
        "oi",
        "olá",
        "opa",
        "e aí",
        "como vai",
        "tudo bem",
        "bom dia",
        "boa tarde",
        "boa noite",
      ],
      pricing: [
        "preço",
        "plano",
        "custa",
        "valor",
        "quanto custa",
        "tabela de preço",
        "assinatura",
      ],
      features: [
        "funcionalidades",
        "features",
        "o que vocês fazem",
        "recursos",
        "capacidades",
      ],
      contact_info: [
        "contato",
        "telefone",
        "email",
        "como entrar em contato",
        "suporte",
      ],
      lead_qualification: [
        "interessado",
        "quero saber mais",
        "me interessa",
        "gostaria de",
      ],
      schedule_demo: [
        "demo",
        "demonstração",
        "agendar",
        "marcar",
        "teste",
        "trial",
      ],
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return "unknown";
  }

  /**
   * Extract lead information from conversation
   */
  async extractLeadInfo(
    userId: string,
    phoneNumber: string,
    context: ConversationContext
  ) {
    try {
      const leadData = context.leadData || {};

      // Create CRM lead if we have enough information
      if (leadData.name && leadData.email) {
        const lead = await db.createCrmLead({
          id: `lead_${Date.now()}`,
          userId,
          name: leadData.name,
          email: leadData.email,
          phone: phoneNumber,
          source: "whatsapp_bot",
          status: "new",
          metadata: JSON.stringify(leadData),
        });

        return lead;
      }

      return null;
    } catch (error) {
      console.error("Error extracting lead info:", error);
      throw error;
    }
  }

  /**
   * Get conversation history for a phone number
   */
  getConversationHistory(phoneNumber: string): ConversationContext | undefined {
    return this.conversationContexts.get(phoneNumber);
  }

  /**
   * Clear conversation context (e.g., after lead conversion)
   */
  clearConversationContext(phoneNumber: string) {
    this.conversationContexts.delete(phoneNumber);
  }

  /**
   * Handle webhook events from WhatsApp
   */
  async handleWebhookEvent(event: any) {
    try {
      const message = event.entry[0].changes[0].value.messages?.[0];
      if (!message) return;

      const phoneNumber = event.entry[0].changes[0].value.contacts?.[0].wa_id;
      const messageText = message.text?.body;

      if (phoneNumber && messageText) {
        // Process the message (userId would need to be determined from phoneNumber)
        return await this.processIncomingMessage("user_id", phoneNumber, messageText);
      }
    } catch (error) {
      console.error("Error handling webhook event:", error);
      throw error;
    }
  }
}

export const whatsappBotService = new WhatsAppBotService();

