import Razorpay from "razorpay";
import crypto from "crypto";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET } from "@/features/billing/config";

export interface RazorpayCreateSubscriptionOptions {
  planId: string;
  customer_notify?: 0 | 1;
  totalCount?: number;
  notes?: Record<string, any>;
}

export interface RazorpaySubscription {
  id: string;
  entity: string;
  plan_id: string;
  customer_id: string;
  status: string;
  current_start?: number;
  current_end?: number;
  ended_at?: number;
  quantity: number;
  notes: Record<string, any>;
  charge_at?: number;
  start_at?: number;
  end_at?: number;
  auth_attempts?: number;
  total_count?: number;
  paid_count?: number;
  customer_notify?: boolean;
  short_url?: string;
  has_scheduled_changes?: boolean;
  change_scheduled_at?: number;
  source?: string;
  remaining_count?: number;
}

export interface RazorpayWebhookEvent {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: any;
  created_at: number;
}

export class RazorpayService {
  private static instance: RazorpayService;
  private client: Razorpay | null = null;

  private constructor() {
    if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      this.client = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });
    }
  }

  public static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  private ensureClient(): Razorpay {
    if (!this.client) {
      throw new Error("Razorpay credentials are not configured");
    }
    return this.client;
  }

  public async createSubscription(
    options: RazorpayCreateSubscriptionOptions
  ): Promise<RazorpaySubscription> {
    const client = this.ensureClient();

    try {
      console.log("[BILLING] Creating Razorpay subscription:", {
        planId: options.planId,
        notes: options.notes,
      });

      const subscription = await client.subscriptions.create({
        plan_id: options.planId,
        customer_notify: (options.customer_notify ?? 1) as 0 | 1,
        total_count: options.totalCount ?? 120,
        notes: options.notes ?? {},
      });

      console.log("[BILLING] Razorpay subscription created:", {
        subscriptionId: subscription.id,
        status: subscription.status,
      });

      return subscription as unknown as RazorpaySubscription;
    } catch (error) {
      console.error("[BILLING ERROR] Failed to create Razorpay subscription:", error);
      throw new Error("Failed to create subscription with Razorpay");
    }
  }

  public async cancelSubscription(
    subscriptionId: string,
    cancelImmediately: boolean = false
  ): Promise<void> {
    const client = this.ensureClient();

    try {
      console.log("[BILLING] Cancelling Razorpay subscription:", {
        subscriptionId,
        cancelImmediately,
      });

      await client.subscriptions.cancel(subscriptionId, cancelImmediately);

      console.log("[BILLING] Razorpay subscription cancelled:", { subscriptionId });
    } catch (error) {
      console.error("[BILLING ERROR] Failed to cancel Razorpay subscription:", {
        subscriptionId,
        error,
      });
      throw new Error("Failed to cancel subscription with Razorpay");
    }
  }

  public async getSubscription(subscriptionId: string): Promise<RazorpaySubscription> {
    const client = this.ensureClient();

    try {
      const subscription = await client.subscriptions.fetch(subscriptionId);
      return subscription as unknown as RazorpaySubscription;
    } catch (error) {
      console.error("[BILLING ERROR] Failed to fetch Razorpay subscription:", {
        subscriptionId,
        error,
      });
      throw new Error("Failed to fetch subscription from Razorpay");
    }
  }

  public async fetchPayment(paymentId: string): Promise<any> {
    const client = this.ensureClient();

    try {
      const payment = await client.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error("[BILLING ERROR] Failed to fetch Razorpay payment:", {
        paymentId,
        error,
      });
      throw new Error("Failed to fetch payment from Razorpay");
    }
  }

  public async fetchInvoice(invoiceId: string): Promise<any> {
    const client = this.ensureClient();

    try {
      const invoice = await client.invoices.fetch(invoiceId);
      return invoice;
    } catch (error) {
      console.error("[BILLING ERROR] Failed to fetch Razorpay invoice:", {
        invoiceId,
        error,
      });
      throw new Error("Failed to fetch invoice from Razorpay");
    }
  }

  public verifyWebhookSignature(
    payload: string,
    signature: string
  ): boolean {
    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.warn("[BILLING WARN] Webhook secret not configured, skipping verification");
      return true;
    }

    try {
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
        .update(payload)
        .digest("hex");

      return expectedSignature === signature;
    } catch (error) {
      console.error("[BILLING ERROR] Webhook signature verification failed:", error);
      return false;
    }
  }

  public verifyPaymentSignature(
    paymentId: string,
    orderId: string,
    signature: string
  ): boolean {
    if (!RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay key secret not configured");
    }

    try {
      const body = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      return expectedSignature === signature;
    } catch (error) {
      console.error("[BILLING ERROR] Payment signature verification failed:", error);
      return false;
    }
  }
}
