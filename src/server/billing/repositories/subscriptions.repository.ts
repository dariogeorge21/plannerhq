import { createClient } from "@/lib/supabase/server";
import { SubscriptionRecord, SubscriptionStatus } from "@/types/billing";

export class SubscriptionsRepository {
  private static instance: SubscriptionsRepository;

  private constructor() {}

  public static getInstance(): SubscriptionsRepository {
    if (!SubscriptionsRepository.instance) {
      SubscriptionsRepository.instance = new SubscriptionsRepository();
    }
    return SubscriptionsRepository.instance;
  }

  public async getByUserId(userId: string): Promise<SubscriptionRecord | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .maybeSingle();

    if (error) {
      console.error("[BILLING ERROR] SubscriptionsRepository.getByUserId failed:", { userId, error });
      throw new Error("Failed to fetch subscription");
    }

    return data as SubscriptionRecord | null;
  }

  public async getById(id: string): Promise<SubscriptionRecord | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[BILLING ERROR] SubscriptionsRepository.getById failed:", { id, error });
      throw new Error("Failed to fetch subscription");
    }

    return data as SubscriptionRecord | null;
  }

  public async getByRazorpayId(razorpaySubscriptionId: string): Promise<SubscriptionRecord | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("razorpay_subscription_id", razorpaySubscriptionId)
      .maybeSingle();

    if (error) {
      console.error("[BILLING ERROR] SubscriptionsRepository.getByRazorpayId failed:", { razorpaySubscriptionId, error });
      throw new Error("Failed to fetch subscription");
    }

    return data as SubscriptionRecord | null;
  }

  public async create(data: {
    userId: string;
    planId: string;
    status: SubscriptionStatus;
    billingCycle: "monthly" | "yearly";
    razorpaySubscriptionId?: string | null;
    razorpayCustomerId?: string | null;
    currentPeriodStart?: string | null;
    currentPeriodEnd?: string | null;
    trialEnd?: string | null;
  }): Promise<SubscriptionRecord> {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: data.userId,
        plan_id: data.planId,
        status: data.status,
        billing_cycle: data.billingCycle,
        razorpay_subscription_id: data.razorpaySubscriptionId,
        razorpay_customer_id: data.razorpayCustomerId,
        current_period_start: data.currentPeriodStart,
        current_period_end: data.currentPeriodEnd,
        trial_end: data.trialEnd,
        cancel_at_period_end: false,
      })
      .select()
      .single();

    if (error || !inserted) {
      console.error("[BILLING ERROR] SubscriptionsRepository.create failed:", { data, error });
      throw new Error("Failed to create subscription");
    }

    console.log("[BILLING] Created subscription:", {
      userId: data.userId,
      subscriptionId: inserted.id,
    });

    return inserted as SubscriptionRecord;
  }

  public async update(
    id: string,
    updates: Partial<{
      status: SubscriptionStatus;
      planId: string;
      billingCycle: "monthly" | "yearly";
      cancelAtPeriodEnd: boolean;
      cancelledAt: string | null;
      currentPeriodStart: string | null;
      currentPeriodEnd: string | null;
      trialEnd: string | null;
      razorpaySubscriptionId: string | null;
      razorpayCustomerId: string | null;
    }>
  ): Promise<SubscriptionRecord> {
    const supabase = await createClient();
    
    const updatePayload: Record<string, any> = {};
    if (updates.status !== undefined) updatePayload.status = updates.status;
    if (updates.planId !== undefined) updatePayload.plan_id = updates.planId;
    if (updates.billingCycle !== undefined) updatePayload.billing_cycle = updates.billingCycle;
    if (updates.cancelAtPeriodEnd !== undefined) updatePayload.cancel_at_period_end = updates.cancelAtPeriodEnd;
    if (updates.cancelledAt !== undefined) updatePayload.cancelled_at = updates.cancelledAt;
    if (updates.currentPeriodStart !== undefined) updatePayload.current_period_start = updates.currentPeriodStart;
    if (updates.currentPeriodEnd !== undefined) updatePayload.current_period_end = updates.currentPeriodEnd;
    if (updates.trialEnd !== undefined) updatePayload.trial_end = updates.trialEnd;
    if (updates.razorpaySubscriptionId !== undefined) updatePayload.razorpay_subscription_id = updates.razorpaySubscriptionId;
    if (updates.razorpayCustomerId !== undefined) updatePayload.razorpay_customer_id = updates.razorpayCustomerId;

    const { data, error } = await supabase
      .from("subscriptions")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("[BILLING ERROR] SubscriptionsRepository.update failed:", { id, updates, error });
      throw new Error("Failed to update subscription");
    }

    console.log("[BILLING] Updated subscription:", {
      subscriptionId: id,
      updates: Object.keys(updates),
    });

    return data as SubscriptionRecord;
  }
}
