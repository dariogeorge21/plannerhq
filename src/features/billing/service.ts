import { createClient } from "@/lib/supabase/server";
import { BillingCycle, PlanKey } from "@/types/types";
import { SubscriptionRecord, PaymentRecord } from "@/types/billing";
import { PLAN_CONFIG, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "./config";
import Razorpay from "razorpay";

export async function getUserSubscription(userId: string) {
    const supabase = await createClient();

    const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .select("*, plan:plans(*)")
        .eq("user_id", userId)
        .in("status", ["active", "trialing"])
        .maybeSingle();

    if (subError || !subscription) {
        return { subscription: null, plan: PLAN_CONFIG.free, dbPlan: null };
    }

    const planKey = subscription.plan?.key as PlanKey || "free";
    const planConfig = PLAN_CONFIG[planKey] || PLAN_CONFIG.free;

    return { subscription: subscription as SubscriptionRecord, plan: planConfig, dbPlan: subscription.plan };
}

export async function createRazorpaySubscription(userId: string, planKey: PlanKey, billingCycle: BillingCycle) {
    if (planKey === "free" || planKey === "enterprise") {
        throw new Error("Cannot create a Razorpay subscription for the Free or Enterprise plan.");
    }

    const planConfig = PLAN_CONFIG[planKey];
    if (!planConfig) throw new Error("Invalid plan key: no config found.");

    const razorpayPlanId = billingCycle === "monthly"
        ? planConfig.razorpayPlanIdMonthly
        : planConfig.razorpayPlanIdYearly;

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

    const subscription = await razorpay.subscriptions.create({
        plan_id: razorpayPlanId,
        customer_notify: 1,
        total_count: billingCycle === "yearly" ? 10 : 120,
        notes: {
            user_id: userId,
            plan_key: planKey,
            billing_cycle: billingCycle,
        }
    });

    return {
        subscriptionId: subscription.id,
        shortUrl: subscription.short_url,
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