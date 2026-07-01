import { createClient } from "@/lib/supabase/server";
import { BillingCycle, PlanKey } from "@/types/types";
import { SubscriptionRecord, PaymentRecord } from "@/types/billing";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "./config";
import Razorpay from "razorpay";

export async function getUserSubscription(userId: string) {
  const supabase = await createClient();

  // Try to get active/trialing first, if none, check for any subscription
  const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*, plan:plans(*)")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .maybeSingle();

  if (subError || !subscription) {
      const { data: freePlan } = await supabase
          .from("plans")
          .select("*")
          .eq("key", "free")
          .single();
      return { subscription: null, dbPlan: freePlan };
  }

  return { subscription: subscription as SubscriptionRecord, dbPlan: subscription.plan };
}

export async function getRazorpayPlanId(planKey: PlanKey, billingCycle: BillingCycle) {
  const supabase = await createClient();
  const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("key", planKey)
      .maybeSingle();

  if (!plan){
      throw new Error(`Razorpay Plan ID not configured for ${planKey} / ${billingCycle}.`);
  }
  if (planError) {
      throw new Error(planError.message);
  }

  if (planKey === "pro") {
      if (billingCycle === "yearly") {
          return plan.razorpay_plan_id_yearly;
      }
      return plan.razorpay_plan_id_monthly;
  } else if (planKey === "ultra") {
      if (billingCycle === "yearly") {
          return plan.razorpay_plan_id_yearly;
      }
      return plan.razorpay_plan_id_monthly;
  } else {
      throw new Error(`Razorpay Plan ID not configured for ${planKey} / ${billingCycle}.`);
  }
}

export async function createRazorpaySubscription(userId: string, planKey: PlanKey, billingCycle: BillingCycle) {
  if (planKey === "free") {
      throw new Error("Cannot create a Razorpay subscription for the Free plan.");
  }
  if (planKey === "enterprise") {
      throw new Error("Cannot create a Razorpay subscription for the Enterprise plan.");
  }

  const supabase = await createClient();

  // Check if user has an ACTIVE or TRIALING subscription (NOT cancelled or expired)
  const { data: activeSubscription, error: activeSubError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .maybeSingle();

  if (activeSubError) {
      throw new Error(activeSubError.message);
  }

  if (activeSubscription && !activeSubscription.cancel_at_period_end) {
      throw new Error("User already has an active subscription");
  }

  // Get the right plan: original code used eq("billing_cycle", billingCycle), but wait—let's check what our plans look like!
  const { data: dbPlan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("key", planKey)
      .maybeSingle();

  if (planError || !dbPlan) {
      throw new Error(`Plan not found for ${planKey} / ${billingCycle}.`);
  }

  const razorpayPlanId = await getRazorpayPlanId(planKey, billingCycle);

  if (!razorpayPlanId) {
      throw new Error(`Razorpay Plan ID not configured for ${planKey} / ${billingCycle}.`);
  }

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials are not configured on the server.");
  }

  const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
  });

  const razorpaySubscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      total_count: billingCycle === "yearly" ? 10 : 120,
      addons: [],
      notes: {
          user_id: userId,
          plan_key: planKey,
          billing_cycle: billingCycle,
      },
  });

  const { data: insertedSubscription, error: subError } = await supabase
      .from("subscriptions")
      .insert({
          user_id: userId,
          plan_id: dbPlan.id,
          status: razorpaySubscription.status,
          billing_cycle: billingCycle,
          razorpay_subscription_id: razorpaySubscription.id,
          razorpay_customer_id: razorpaySubscription.customer_id,
          cancel_at_period_end: false,
          trial_end: null,
          cancelled_at: null,
      })
      .select()
      .single();

  if (subError || !insertedSubscription) {
      throw new Error("Failed to create subscription record.");
  }

  await supabase.from("payments").insert({
      user_id: userId,
      subscription_id: insertedSubscription.id,
      razorpay_payment_id: razorpaySubscription.id,
      razorpay_subscription_id: razorpaySubscription.id,
      amount_paise: (razorpaySubscription as any).plan?.amount || 0,
      currency: "INR",
      status: razorpaySubscription.status,
  });

  await supabase
      .from("profiles")
      .update({
          current_plan: planKey,
          subscription_id: insertedSubscription.id,
      })
      .eq("user_id", userId);

  console.info("[billing/service] Created Razorpay subscription", {
      userId,
      planKey,
      billingCycle,
      subscriptionId: razorpaySubscription.id,
  });

  return {
      subscriptionId: razorpaySubscription.id,
      shortUrl: razorpaySubscription.short_url,
  };
}

export async function cancelSubscription(userId: string) {
  const supabase = await createClient();
  const { subscription } = await getUserSubscription(userId);

  if (!subscription || !subscription.razorpay_subscription_id) {
      throw new Error("No active paid subscription found to cancel.");
  }

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials are not configured on the server.");
  }

  const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
  });

  await razorpay.subscriptions.cancel(subscription.razorpay_subscription_id, false);

  await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: true })
      .eq("id", subscription.id);

  return { success: true };
}

export async function getPaymentHistory(userId: string): Promise<PaymentRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

  if (error) return [];
  return data as PaymentRecord[];
}
