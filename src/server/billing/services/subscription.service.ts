import { SubscriptionsRepository } from "../repositories/subscriptions.repository";
import { PaymentsRepository } from "../repositories/payments.repository";
import { RazorpayService, RazorpayWebhookEvent } from "./razorpay.service";
import { BillingErrorCode } from "../types";
import { BillingServiceError } from "../utils";

export class SubscriptionService {
  private static instance: SubscriptionService;
  private subscriptionsRepo: SubscriptionsRepository;
  private paymentsRepo: PaymentsRepository;
  private razorpayService: RazorpayService;

  private constructor() {
    this.subscriptionsRepo = SubscriptionsRepository.getInstance();
    this.paymentsRepo = PaymentsRepository.getInstance();
    this.razorpayService = RazorpayService.getInstance();
  }

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  public async processWebhook(
    payload: string,
    signature: string
  ): Promise<void> {
    const isValid = this.razorpayService.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      throw new BillingServiceError(
        BillingErrorCode.UNAUTHORIZED,
        "Invalid webhook signature"
      );
    }

    const event: RazorpayWebhookEvent = JSON.parse(payload);

    console.log("[BILLING] Processing webhook event:", {
      event: event.event,
      entity: event.entity,
    });

    switch (event.event) {
      case "subscription.charged":
        await this.handleSubscriptionCharged(event);
        break;
      case "subscription.activated":
        await this.handleSubscriptionActivated(event);
        break;
      case "subscription.cancelled":
        await this.handleSubscriptionCancelled(event);
        break;
      case "subscription.halted":
        await this.handleSubscriptionHalted(event);
        break;
      case "subscription.paused":
        await this.handleSubscriptionPaused(event);
        break;
      case "subscription.resumed":
        await this.handleSubscriptionResumed(event);
        break;
      case "payment.failed":
        await this.handlePaymentFailed(event);
        break;
      case "payment.captured":
        await this.handlePaymentCaptured(event);
        break;
      default:
        console.log("[BILLING] Unhandled webhook event:", event.event);
    }

    await this.recordWebhookEvent(event, true);
  }

  private async handleSubscriptionCharged(event: RazorpayWebhookEvent): Promise<void> {
    const subscriptionData = event.payload.subscription?.entity;
    const paymentData = event.payload.payment?.entity;

    if (!subscriptionData?.id) {
      console.warn("[BILLING] Subscription charged event missing subscription ID");
      return;
    }

    console.log("[BILLING] Handling subscription.charged:", {
      subscriptionId: subscriptionData.id,
    });

    const subscription = await this.subscriptionsRepo.getByRazorpayId(subscriptionData.id);
    if (!subscription) {
      console.warn("[BILLING] Subscription not found for charged event:", subscriptionData.id);
      return;
    }

    await this.subscriptionsRepo.update(subscription.id, {
      status: "active",
      currentPeriodStart: subscriptionData.current_start
        ? new Date(subscriptionData.current_start * 1000).toISOString()
        : undefined,
      currentPeriodEnd: subscriptionData.current_end
        ? new Date(subscriptionData.current_end * 1000).toISOString()
        : undefined,
    });

    if (paymentData) {
      await this.createOrUpdatePayment(subscription.user_id, subscription.id, paymentData);
    }
  }

  private async handleSubscriptionActivated(event: RazorpayWebhookEvent): Promise<void> {
    const subscriptionData = event.payload.subscription?.entity;
    if (!subscriptionData?.id) return;

    console.log("[BILLING] Handling subscription.activated:", subscriptionData.id);

    const subscription = await this.subscriptionsRepo.getByRazorpayId(subscriptionData.id);
    if (!subscription) return;

    await this.subscriptionsRepo.update(subscription.id, {
      status: "active",
      currentPeriodStart: subscriptionData.current_start
        ? new Date(subscriptionData.current_start * 1000).toISOString()
        : undefined,
      currentPeriodEnd: subscriptionData.current_end
        ? new Date(subscriptionData.current_end * 1000).toISOString()
        : undefined,
    });
  }

  private async handleSubscriptionCancelled(event: RazorpayWebhookEvent): Promise<void> {
    const subscriptionData = event.payload.subscription?.entity;
    if (!subscriptionData?.id) return;

    console.log("[BILLING] Handling subscription.cancelled:", subscriptionData.id);

    const subscription = await this.subscriptionsRepo.getByRazorpayId(subscriptionData.id);
    if (!subscription) return;

    await this.subscriptionsRepo.update(subscription.id, {
      status: subscriptionData.status === "cancelled" ? "cancelled" : subscription.status,
      cancelledAt: new Date().toISOString(),
      cancelAtPeriodEnd: subscriptionData.cancel_at_period_end ?? true,
    });
  }

  private async handleSubscriptionHalted(event: RazorpayWebhookEvent): Promise<void> {
    const subscriptionData = event.payload.subscription?.entity;
    if (!subscriptionData?.id) return;

    console.log("[BILLING] Handling subscription.halted:", subscriptionData.id);

    const subscription = await this.subscriptionsRepo.getByRazorpayId(subscriptionData.id);
    if (!subscription) return;

    await this.subscriptionsRepo.update(subscription.id, {
      status: "past_due",
    });
  }

  private async handleSubscriptionPaused(event: RazorpayWebhookEvent): Promise<void> {
    const subscriptionData = event.payload.subscription?.entity;
    if (!subscriptionData?.id) return;

    console.log("[BILLING] Handling subscription.paused:", subscriptionData.id);

    const subscription = await this.subscriptionsRepo.getByRazorpayId(subscriptionData.id);
    if (!subscription) return;

    await this.subscriptionsRepo.update(subscription.id, {
      status: "cancelled",
    });
  }

  private async handleSubscriptionResumed(event: RazorpayWebhookEvent): Promise<void> {
    const subscriptionData = event.payload.subscription?.entity;
    if (!subscriptionData?.id) return;

    console.log("[BILLING] Handling subscription.resumed:", subscriptionData.id);

    const subscription = await this.subscriptionsRepo.getByRazorpayId(subscriptionData.id);
    if (!subscription) return;

    await this.subscriptionsRepo.update(subscription.id, {
      status: "active",
    });
  }

  private async handlePaymentCaptured(event: RazorpayWebhookEvent): Promise<void> {
    const paymentData = event.payload.payment?.entity;
    if (!paymentData?.id) return;

    console.log("[BILLING] Handling payment.captured:", paymentData.id);

    const existingPayment = await this.paymentsRepo.getByRazorpayPaymentId(paymentData.id);
    if (existingPayment) {
      await this.paymentsRepo.update(existingPayment.id, {
        status: "captured",
        paidAt: paymentData.created_at
          ? new Date(paymentData.created_at * 1000).toISOString()
          : undefined,
      });
      return;
    }

    const razorpaySubscriptionId = paymentData.subscription_id;
    if (razorpaySubscriptionId) {
      const subscription = await this.subscriptionsRepo.getByRazorpayId(razorpaySubscriptionId);
      if (subscription) {
        await this.paymentsRepo.create({
          userId: subscription.user_id,
          subscriptionId: subscription.id,
          razorpayPaymentId: paymentData.id,
          razorpaySubscriptionId: razorpaySubscriptionId,
          amountPaise: paymentData.amount,
          currency: paymentData.currency?.toUpperCase() || "INR",
          status: "captured",
          paymentMethod: paymentData.method,
          paidAt: paymentData.created_at
            ? new Date(paymentData.created_at * 1000).toISOString()
            : undefined,
        });
      }
    }
  }

  private async handlePaymentFailed(event: RazorpayWebhookEvent): Promise<void> {
    const paymentData = event.payload.payment?.entity;
    if (!paymentData?.id) return;

    console.log("[BILLING] Handling payment.failed:", paymentData.id);

    const existingPayment = await this.paymentsRepo.getByRazorpayPaymentId(paymentData.id);
    if (existingPayment) {
      await this.paymentsRepo.update(existingPayment.id, {
        status: "failed",
        failureReason: paymentData.error_description || paymentData.error_reason,
      });
    }
  }

  private async createOrUpdatePayment(
    userId: string,
    subscriptionId: string,
    paymentData: any
  ): Promise<void> {
    const existingPayment = await this.paymentsRepo.getByRazorpayPaymentId(paymentData.id);

    if (existingPayment) {
      await this.paymentsRepo.update(existingPayment.id, {
        status: paymentData.status,
        paymentMethod: paymentData.method,
        paidAt: paymentData.created_at
          ? new Date(paymentData.created_at * 1000).toISOString()
          : undefined,
      });
    } else {
      await this.paymentsRepo.create({
        userId,
        subscriptionId,
        razorpayPaymentId: paymentData.id,
        razorpaySubscriptionId: paymentData.subscription_id,
        amountPaise: paymentData.amount,
        currency: paymentData.currency?.toUpperCase() || "INR",
        status: paymentData.status,
        paymentMethod: paymentData.method,
        paidAt: paymentData.created_at
          ? new Date(paymentData.created_at * 1000).toISOString()
          : undefined,
      });
    }
  }

  private async recordWebhookEvent(
    event: RazorpayWebhookEvent,
    processed: boolean
  ): Promise<void> {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase.from("webhook_events").insert({
        razorpay_event_id: event.payload?.payment?.entity?.id || event.payload?.subscription?.entity?.id,
        event_type: event.event,
        payload: event,
        processed,
      });
    } catch (error) {
      console.error("[BILLING ERROR] Failed to record webhook event:", error);
    }
  }
}
