import { createClient } from "@/lib/supabase/server";
import { PlansRepository } from "../repositories/plans.repository";
import { SubscriptionsRepository } from "../repositories/subscriptions.repository";
import { PaymentsRepository } from "../repositories/payments.repository";
import { RazorpayService } from "./razorpay.service";
import {
  BillingOverviewResponse,
  CreateCheckoutOptions,
  CancelSubscriptionOptions,
  ChangePlanOptions,
  BillingErrorCode,
} from "../types";
import { BillingServiceError, getRazorpayPlanId } from "../utils";
import { UsageRecord, DbPlanRecord } from "@/types/billing";

export class BillingService {
  private static instance: BillingService;
  private plansRepo: PlansRepository;
  private subscriptionsRepo: SubscriptionsRepository;
  private paymentsRepo: PaymentsRepository;
  private razorpayService: RazorpayService;

  private constructor() {
    this.plansRepo = PlansRepository.getInstance();
    this.subscriptionsRepo = SubscriptionsRepository.getInstance();
    this.paymentsRepo = PaymentsRepository.getInstance();
    this.razorpayService = RazorpayService.getInstance();
  }

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  public async getBillingOverview(userId: string): Promise<BillingOverviewResponse> {
    console.log("[BILLING] Fetching billing overview for user:", userId);

    const [subscription, allPlans, paymentHistory, usage] = await Promise.all([
      this.subscriptionsRepo.getByUserId(userId),
      this.plansRepo.getAllActive(),
      this.paymentsRepo.getByUserId(userId, 50),
      this.getUserUsage(userId),
    ]);

    let currentPlan: DbPlanRecord;
    if (subscription) {
      const plan = await this.plansRepo.getById(subscription.plan_id);
      if (!plan) {
        throw new BillingServiceError(
          BillingErrorCode.PLAN_NOT_FOUND,
          "Associated plan not found"
        );
      }
      currentPlan = plan;
    } else {
      currentPlan = await this.plansRepo.getFreePlan();
    }

    const latestPayment = paymentHistory[0] || null;

    const billingCycle = subscription?.billing_cycle || null;
    const nextBillingDate = subscription?.current_period_end || null;
    const renewalDate =
      subscription?.cancel_at_period_end ? null : subscription?.current_period_end || null;
    const status = subscription ? subscription.status : "free";

    console.log("[BILLING] Billing overview fetched for user:", {
      userId,
      status,
      planKey: currentPlan.key,
    });

    return {
      currentPlan,
      subscription,
      availablePlans: allPlans,
      paymentHistory,
      usage,
      lastPaymentDate: latestPayment?.created_at || null,
      lastPaymentAmount: latestPayment?.amount_paise || null,
      billingCycle,
      nextBillingDate,
      renewalDate,
      status,
    };
  }

  private async getUserUsage(userId: string): Promise<UsageRecord | null> {
    const supabase = await createClient();
    const { data } = await supabase
      .from("subscription_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    return data as UsageRecord | null;
  }

  public async createCheckout(options: CreateCheckoutOptions) {
    console.log("[BILLING] Creating checkout for user:", {
      userId: options.userId,
      planKey: options.planKey,
      billingCycle: options.billingCycle,
    });

    const plan = await this.plansRepo.getByKey(options.planKey as any);
    if (!plan) {
      throw new BillingServiceError(
        BillingErrorCode.PLAN_NOT_FOUND,
        `Plan not found: ${options.planKey}`
      );
    }

    const existingSubscription = await this.subscriptionsRepo.getByUserId(options.userId);
    // Only throw ALREADY_SUBSCRIBED if user has an ACTIVE, NON-CANCELLING paid subscription
    if (existingSubscription && 
        !existingSubscription.cancel_at_period_end && 
        existingSubscription.status !== "cancelled" && 
        existingSubscription.status !== "expired") {
      throw new BillingServiceError(
        BillingErrorCode.ALREADY_SUBSCRIBED,
        "User already has an active subscription"
      );
    }

    const razorpayPlanId = getRazorpayPlanId(plan, options.billingCycle);

    const razorpaySubscription = await this.razorpayService.createSubscription({
      planId: razorpayPlanId,
      customer_notify: 1,
      notes: {
        user_id: options.userId,
        plan_key: options.planKey,
        billing_cycle: options.billingCycle,
      },
      totalCount: options.billingCycle === "yearly" ? 10 : 120,
    });

    const subscription = await this.subscriptionsRepo.create({
      userId: options.userId,
      planId: plan.id,
      status: razorpaySubscription.status as any,
      billingCycle: options.billingCycle,
      razorpaySubscriptionId: razorpaySubscription.id,
      razorpayCustomerId: razorpaySubscription.customer_id,
      currentPeriodStart: razorpaySubscription.current_start
        ? new Date(razorpaySubscription.current_start * 1000).toISOString()
        : null,
      currentPeriodEnd: razorpaySubscription.current_end
        ? new Date(razorpaySubscription.current_end * 1000).toISOString()
        : null,
    });

    await this.paymentsRepo.create({
      userId: options.userId,
      subscriptionId: subscription.id,
      razorpayPaymentId: razorpaySubscription.id,
      razorpaySubscriptionId: razorpaySubscription.id,
      amountPaise: 0,
      currency: "INR",
      status: razorpaySubscription.status,
    });

    await this.updateUserProfile(options.userId, plan.key, subscription.id);

    return {
      success: true,
      subscriptionId: razorpaySubscription.id,
      shortUrl: razorpaySubscription.short_url,
    };
  }

  public async cancelSubscription(options: CancelSubscriptionOptions) {
    console.log("[BILLING] Cancelling subscription for user:", options.userId);

    const subscription = await this.subscriptionsRepo.getByUserId(options.userId);
    if (!subscription) {
      throw new BillingServiceError(
        BillingErrorCode.SUBSCRIPTION_NOT_FOUND,
        "No active subscription found"
      );
    }

    if (subscription.razorpay_subscription_id) {
      await this.razorpayService.cancelSubscription(
        subscription.razorpay_subscription_id,
        !options.cancelAtPeriodEnd
      );
    }

    await this.subscriptionsRepo.update(subscription.id, {
      cancelAtPeriodEnd: options.cancelAtPeriodEnd ?? true,
      cancelledAt: options.cancelAtPeriodEnd ? null : new Date().toISOString(),
      status: options.cancelAtPeriodEnd ? subscription.status : "cancelled",
    });

    console.log("[BILLING] Subscription cancelled for user:", options.userId);

    return { success: true };
  }

  public async changePlan(options: ChangePlanOptions) {
    console.log("[BILLING] Changing plan for user:", {
      userId: options.userId,
      newPlanKey: options.newPlanKey,
    });

    const currentSubscription = await this.subscriptionsRepo.getByUserId(options.userId);
    if (!currentSubscription) {
      throw new BillingServiceError(
        BillingErrorCode.SUBSCRIPTION_NOT_FOUND,
        "No active subscription found"
      );
    }

    const newPlan = await this.plansRepo.getByKey(options.newPlanKey);
    if (!newPlan) {
      throw new BillingServiceError(
        BillingErrorCode.PLAN_NOT_FOUND,
        `Plan not found: ${options.newPlanKey}`
      );
    }

    const newBillingCycle = options.newBillingCycle || currentSubscription.billing_cycle;

    await this.subscriptionsRepo.update(currentSubscription.id, {
      planId: newPlan.id,
      billingCycle: newBillingCycle,
    });

    await this.updateUserProfile(options.userId, newPlan.key, currentSubscription.id);

    console.log("[BILLING] Plan changed for user:", {
      userId: options.userId,
      newPlanKey: options.newPlanKey,
    });

    return { success: true };
  }

  private async updateUserProfile(
    userId: string,
    planKey: string,
    subscriptionId: string
  ): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from("profiles")
      .update({
        current_plan: planKey,
        subscription_id: subscriptionId,
      })
      .eq("user_id", userId);
  }
}
