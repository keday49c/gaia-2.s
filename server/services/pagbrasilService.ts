import axios, { AxiosInstance } from "axios";

/**
 * PagBrasil Payment Service
 * Handles PIX and Boleto payments
 * Configure your credentials in environment variables:
 * PAGBRASIL_API_KEY, PAGBRASIL_MERCHANT_ID, PAGBRASIL_API_URL
 */

export interface PaymentConfig {
  apiKey: string;
  merchantId: string;
  apiUrl: string;
}

export interface PixPayment {
  amount: number;
  description: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  expiresIn?: number; // seconds
}

export interface BoletoPayment {
  amount: number;
  description: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dueDate: Date;
}

export interface PaymentResponse {
  id: string;
  orderId: string;
  status: "pending" | "completed" | "failed" | "expired";
  type: "pix" | "boleto";
  amount: number;
  createdAt: Date;
  expiresAt?: Date;
  pixQrCode?: string;
  pixCopyPaste?: string;
  boletoBarcode?: string;
  boletoUrl?: string;
}

export class PagBrasilService {
  private client: AxiosInstance | null = null;
  private config: PaymentConfig | null = null;

  /**
   * Initialize PagBrasil client with your credentials
   * Get your credentials at: https://www.pagbrasil.com.br
   */
  initialize(config: PaymentConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl || "https://api.pagbrasil.com.br/v1",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "X-Merchant-ID": config.merchantId,
      },
    });

    console.log("[PagBrasil] Service initialized successfully");
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.client !== null && this.config !== null;
  }

  /**
   * Create PIX payment
   */
  async createPixPayment(payment: PixPayment): Promise<PaymentResponse> {
    if (!this.client) {
      throw new Error("PagBrasil service not initialized. Call initialize() first.");
    }

    try {
      const response = await this.client.post("/pix/create", {
        amount: Math.round(payment.amount * 100), // Convert to cents
        description: payment.description,
        orderId: payment.orderId,
        customer: {
          name: payment.customerName,
          email: payment.customerEmail,
          phone: payment.customerPhone,
        },
        expiresIn: payment.expiresIn || 3600, // Default 1 hour
      });

      return {
        id: response.data.id,
        orderId: payment.orderId,
        status: "pending",
        type: "pix",
        amount: payment.amount,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (payment.expiresIn || 3600) * 1000),
        pixQrCode: response.data.qrCode,
        pixCopyPaste: response.data.copyPaste,
      };
    } catch (error) {
      console.error("[PagBrasil] Error creating PIX payment:", error);
      throw new Error(`Failed to create PIX payment: ${error}`);
    }
  }

  /**
   * Create Boleto payment
   */
  async createBoletoPayment(payment: BoletoPayment): Promise<PaymentResponse> {
    if (!this.client) {
      throw new Error("PagBrasil service not initialized. Call initialize() first.");
    }

    try {
      const response = await this.client.post("/boleto/create", {
        amount: Math.round(payment.amount * 100), // Convert to cents
        description: payment.description,
        orderId: payment.orderId,
        customer: {
          name: payment.customerName,
          email: payment.customerEmail,
          phone: payment.customerPhone,
        },
        dueDate: payment.dueDate.toISOString().split("T")[0],
      });

      return {
        id: response.data.id,
        orderId: payment.orderId,
        status: "pending",
        type: "boleto",
        amount: payment.amount,
        createdAt: new Date(),
        expiresAt: payment.dueDate,
        boletoBarcode: response.data.barcode,
        boletoUrl: response.data.url,
      };
    } catch (error) {
      console.error("[PagBrasil] Error creating Boleto payment:", error);
      throw new Error(`Failed to create Boleto payment: ${error}`);
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    if (!this.client) {
      throw new Error("PagBrasil service not initialized. Call initialize() first.");
    }

    try {
      const response = await this.client.get(`/payment/${paymentId}`);

      return {
        id: response.data.id,
        orderId: response.data.orderId,
        status: response.data.status,
        type: response.data.type,
        amount: response.data.amount / 100,
        createdAt: new Date(response.data.createdAt),
        expiresAt: response.data.expiresAt ? new Date(response.data.expiresAt) : undefined,
        pixQrCode: response.data.qrCode,
        pixCopyPaste: response.data.copyPaste,
        boletoBarcode: response.data.barcode,
        boletoUrl: response.data.url,
      };
    } catch (error) {
      console.error("[PagBrasil] Error checking payment status:", error);
      throw new Error(`Failed to check payment status: ${error}`);
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    if (!this.client) {
      throw new Error("PagBrasil service not initialized. Call initialize() first.");
    }

    try {
      await this.client.post(`/payment/${paymentId}/refund`, {
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return true;
    } catch (error) {
      console.error("[PagBrasil] Error refunding payment:", error);
      throw new Error(`Failed to refund payment: ${error}`);
    }
  }

  /**
   * List payments with filters
   */
  async listPayments(filters?: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<PaymentResponse[]> {
    if (!this.client) {
      throw new Error("PagBrasil service not initialized. Call initialize() first.");
    }

    try {
      const params: any = {};
      if (filters?.status) params.status = filters.status;
      if (filters?.startDate) params.startDate = filters.startDate.toISOString();
      if (filters?.endDate) params.endDate = filters.endDate.toISOString();
      if (filters?.limit) params.limit = filters.limit;

      const response = await this.client.get("/payments", { params });

      return response.data.map((payment: any) => ({
        id: payment.id,
        orderId: payment.orderId,
        status: payment.status,
        type: payment.type,
        amount: payment.amount / 100,
        createdAt: new Date(payment.createdAt),
        expiresAt: payment.expiresAt ? new Date(payment.expiresAt) : undefined,
        pixQrCode: payment.qrCode,
        pixCopyPaste: payment.copyPaste,
        boletoBarcode: payment.barcode,
        boletoUrl: payment.url,
      }));
    } catch (error) {
      console.error("[PagBrasil] Error listing payments:", error);
      throw new Error(`Failed to list payments: ${error}`);
    }
  }

  /**
   * Setup webhook for payment notifications
   */
  async setupWebhook(webhookUrl: string): Promise<boolean> {
    if (!this.client) {
      throw new Error("PagBrasil service not initialized. Call initialize() first.");
    }

    try {
      await this.client.post("/webhook/setup", {
        url: webhookUrl,
        events: ["payment.completed", "payment.failed", "payment.expired"],
      });

      console.log("[PagBrasil] Webhook configured successfully");
      return true;
    } catch (error) {
      console.error("[PagBrasil] Error setting up webhook:", error);
      throw new Error(`Failed to setup webhook: ${error}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const crypto = require("crypto");
    const hash = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return hash === signature;
  }
}

export const pagbrasilService = new PagBrasilService();

