import axios, { AxiosInstance } from "axios";
import * as db from "../db";

/**
 * WhatsApp Business Service
 * Handles WhatsApp Business API integration with real functionality
 * Setup: Get your credentials from https://developers.facebook.com/docs/whatsapp/cloud-api
 */

export interface WhatsAppBusinessConfig {
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookToken: string;
  phoneNumber: string; // e.g., +5521973240704
}

export interface WhatsAppMessage {
  id: string;
  phoneNumber: string;
  messageType: "text" | "image" | "video" | "document" | "audio";
  content: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class WhatsAppBusinessService {
  private client: AxiosInstance | null = null;
  private config: WhatsAppBusinessConfig | null = null;
  private conversationContexts: Map<string, any> = new Map();

  /**
   * Initialize WhatsApp Business API client
   * Get credentials from: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
   */
  initialize(config: WhatsAppBusinessConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `https://graph.instagram.com/v18.0/${config.phoneNumberId}`,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`[WhatsApp Business] Initialized with phone: ${config.phoneNumber}`);
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.client !== null && this.config !== null;
  }

  /**
   * Send text message
   */
  async sendTextMessage(phoneNumber: string, message: string): Promise<WhatsAppMessage> {
    if (!this.client) {
      throw new Error("WhatsApp Business service not initialized");
    }

    try {
      const response = await this.client.post("/messages", {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber.replace(/\D/g, ""), // Remove non-digits
        type: "text",
        text: {
          body: message,
        },
      });

      const messageId = response.data.messages[0].id;

      // Save to database
      await db.createWhatsappInteraction({
        id: messageId,
        userId: "system",
        phoneNumber,
        messageType: "text",
        messageContent: message,
        senderType: "bot",
        status: "sent",
      });

      return {
        id: messageId,
        phoneNumber,
        messageType: "text",
        content: message,
        status: "sent",
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("[WhatsApp Business] Error sending text message:", error);
      throw error;
    }
  }

  /**
   * Send interactive buttons message
   */
  async sendButtonMessage(
    phoneNumber: string,
    headerText: string,
    bodyText: string,
    footerText: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<WhatsAppMessage> {
    if (!this.client) {
      throw new Error("WhatsApp Business service not initialized");
    }

    try {
      const response = await this.client.post("/messages", {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber.replace(/\D/g, ""),
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
          footer: {
            text: footerText,
          },
          action: {
            buttons: buttons.map((btn, index) => ({
              type: "reply",
              reply: {
                id: btn.id,
                title: btn.title,
              },
            })),
          },
        },
      });

      const messageId = response.data.messages[0].id;

      return {
        id: messageId,
        phoneNumber,
        messageType: "text",
        content: `Interactive: ${headerText}`,
        status: "sent",
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("[WhatsApp Business] Error sending button message:", error);
      throw error;
    }
  }

  /**
   * Send media message (image, video, document)
   */
  async sendMediaMessage(
    phoneNumber: string,
    mediaType: "image" | "video" | "document" | "audio",
    mediaUrl: string,
    caption?: string
  ): Promise<WhatsAppMessage> {
    if (!this.client) {
      throw new Error("WhatsApp Business service not initialized");
    }

    try {
      const payload: any = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber.replace(/\D/g, ""),
        type: mediaType,
        [mediaType]: {
          link: mediaUrl,
        },
      };

      if (caption && (mediaType === "image" || mediaType === "video")) {
        payload[mediaType].caption = caption;
      }

      const response = await this.client.post("/messages", payload);
      const messageId = response.data.messages[0].id;

      return {
        id: messageId,
        phoneNumber,
        messageType: mediaType,
        content: mediaUrl,
        status: "sent",
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("[WhatsApp Business] Error sending media message:", error);
      throw error;
    }
  }

  /**
   * Send template message (pre-approved templates)
   */
  async sendTemplateMessage(
    phoneNumber: string,
    templateName: string,
    templateLanguage: string = "pt_BR",
    parameters?: string[]
  ): Promise<WhatsAppMessage> {
    if (!this.client) {
      throw new Error("WhatsApp Business service not initialized");
    }

    try {
      const payload: any = {
        messaging_product: "whatsapp",
        to: phoneNumber.replace(/\D/g, ""),
        type: "template",
        template: {
          name: templateName,
          language: {
            code: templateLanguage,
          },
        },
      };

      if (parameters) {
        payload.template.components = [
          {
            type: "body",
            parameters: parameters.map((param) => ({
              type: "text",
              text: param,
            })),
          },
        ];
      }

      const response = await this.client.post("/messages", payload);
      const messageId = response.data.messages[0].id;

      return {
        id: messageId,
        phoneNumber,
        messageType: "text",
        content: `Template: ${templateName}`,
        status: "sent",
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("[WhatsApp Business] Error sending template message:", error);
      throw error;
    }
  }

  /**
   * Process incoming webhook message
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

      // Save incoming message to database
      await db.createWhatsappInteraction({
        id: `interaction_${Date.now()}`,
        userId,
        phoneNumber,
        messageType: "text",
        messageContent: messageText,
        senderType: "user",
        status: "received",
      });

      // Generate intelligent response
      const botResponse = await this.generateIntelligentResponse(messageText, context);

      // Send response
      await this.sendTextMessage(phoneNumber, botResponse);

      return botResponse;
    } catch (error) {
      console.error("[WhatsApp Business] Error processing incoming message:", error);
      throw error;
    }
  }

  /**
   * Generate intelligent bot response
   */
  private async generateIntelligentResponse(userMessage: string, context: any): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();

    // Intent recognition
    if (
      lowerMessage.includes("oi") ||
      lowerMessage.includes("olá") ||
      lowerMessage.includes("opa")
    ) {
      return "👋 Olá! Bem-vindo ao Apogeu. Como posso ajudá-lo?";
    }

    if (lowerMessage.includes("preço") || lowerMessage.includes("plano")) {
      return "💎 Temos 3 planos:\n\n📦 Standard: R$50/mês\n💎 Premium: R$100/mês\n👑 Ouro: R$150/mês\n\nQual te interessa?";
    }

    if (lowerMessage.includes("funcionalidade") || lowerMessage.includes("feature")) {
      return "✨ Nossas principais features:\n✅ Automação de campanhas\n✅ Analytics em tempo real\n✅ Bot omnichannel\n✅ Integração com múltiplas plataformas\n\nDeseja saber mais?";
    }

    if (lowerMessage.includes("demo") || lowerMessage.includes("demonstração")) {
      return "🎯 Gostaria de agendar uma demonstração? Qual dia e horário funcionam melhor para você?";
    }

    if (lowerMessage.includes("contato") || lowerMessage.includes("suporte")) {
      return "📞 Você pode nos contatar:\n📧 Email: support@apogeu.com\n💬 Chat: https://apogeu.com/chat\n\nComo posso ajudá-lo agora?";
    }

    return "Entendi sua pergunta. Deixe-me processar isso. Você pode também falar com nosso time de suporte.";
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string): Promise<boolean> {
    if (!this.client) {
      throw new Error("WhatsApp Business service not initialized");
    }

    try {
      await this.client.post("/messages", {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      });

      return true;
    } catch (error) {
      console.error("[WhatsApp Business] Error marking message as read:", error);
      return false;
    }
  }

  /**
   * Get message status
   */
  async getMessageStatus(messageId: string): Promise<string> {
    if (!this.client) {
      throw new Error("WhatsApp Business service not initialized");
    }

    try {
      const response = await this.client.get(`/${messageId}`);
      return response.data.status;
    } catch (error) {
      console.error("[WhatsApp Business] Error getting message status:", error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(phoneNumber: string): any {
    return this.conversationContexts.get(phoneNumber);
  }

  /**
   * Clear conversation context
   */
  clearConversationContext(phoneNumber: string): void {
    this.conversationContexts.delete(phoneNumber);
  }

  /**
   * Setup webhook for receiving messages
   */
  async setupWebhook(webhookUrl: string): Promise<boolean> {
    if (!this.client) {
      throw new Error("WhatsApp Business service not initialized");
    }

    try {
      // This would be done through Facebook App Dashboard
      console.log(
        `[WhatsApp Business] Configure webhook in Facebook App Dashboard: ${webhookUrl}`
      );
      return true;
    } catch (error) {
      console.error("[WhatsApp Business] Error setting up webhook:", error);
      return false;
    }
  }

  /**
   * Verify webhook token
   */
  verifyWebhookToken(token: string): boolean {
    return token === this.config?.webhookToken;
  }

  /**
   * Get business phone number info
   */
  getPhoneNumberInfo(): { phoneNumber: string; phoneNumberId: string } | null {
    if (!this.config) return null;

    return {
      phoneNumber: this.config.phoneNumber,
      phoneNumberId: this.config.phoneNumberId,
    };
  }
}

export const whatsappBusinessService = new WhatsAppBusinessService();

