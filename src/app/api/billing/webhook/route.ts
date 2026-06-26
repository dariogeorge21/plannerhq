import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { RAZORPAY_WEBHOOK_SECRET } from "@/features/billing/config";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature || !RAZORPAY_WEBHOOK_SECRET) {
            return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(body);

        // Log the webhook event
        try {
            await supabaseAdmin.from("webhook_events").insert({
                razorpay_event_id: event.id || null,
                event_type: event.event,
                payload: event,
            });
        } catch (logError) {
            console.error("Failed to log webhook event:", logError);
            // We continue processing even if logging fails
        }
        
        switch (event.event) {
            case "subscription.activated":
            case "subscription.charged":
            case "subscription.completed":
            case "subscription.cancelled":
                await handleSubscriptionEvent(event);
                break;
            case "payment.captured":
                await handlePaymentCaptured(event);
                break;
            case "payment.failed":
                await handlePaymentFailed(event);
                break;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function handleSubscriptionEvent(event: any) {
    const payload = event.payload.subscription.entity;
    const subscriptionId = payload.id;
    const customerId = payload.customer_id;
    const status = payload.status; 
    const currentPeriodStart = payload.current_start ? new Date(payload.current_start * 1000).toISOString() : null;
    const currentPeriodEnd = payload.current_end ? new Date(payload.current_end * 1000).toISOString() : null;
    const notes = payload.notes || {};
    
    // Notes contain user_id, plan_key, billing_cycle from checkout creation
    const userId = notes.user_id;
    const planKey = notes.plan_key;
    const billingCycle = notes.billing_cycle;

    if (!userId || !planKey) return; // Skip if it's not our app's subscription

    // Get the plan ID
    const { data: plan } = await supabaseAdmin
        .from("plans")
        .select("id")
        .eq("key", planKey)
        .single();
        
    if (!plan) return;

    // We map razorpay status (created, authenticated, active, pending, halted, cancelled, completed, expired)
    // To our db status ('active', 'trialing', 'past_due', 'cancelled', 'expired')
    let dbStatus = "active";
    if (status === "cancelled") dbStatus = "cancelled";
    if (status === "completed" || status === "expired") dbStatus = "expired";
    if (status === "halted" || status === "pending") dbStatus = "past_due";
    if (status === "created" || status === "authenticated") dbStatus = "active";

    // Update existing or create new subscription
    const { data: existingSub } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .in("status", ["active", "trialing", "past_due"])
        .single();

    if (existingSub) {
        await supabaseAdmin
            .from("subscriptions")
            .update({
                razorpay_subscription_id: subscriptionId,
                razorpay_customer_id: customerId,
                status: dbStatus,
                current_period_start: currentPeriodStart,
                current_period_end: currentPeriodEnd,
                plan_id: plan.id,
                billing_cycle: billingCycle,
            })
            .eq("id", existingSub.id);
    } else {
        await supabaseAdmin
            .from("subscriptions")
            .insert({
                user_id: userId,
                plan_id: plan.id,
                status: dbStatus,
                billing_cycle: billingCycle,
                razorpay_subscription_id: subscriptionId,
                razorpay_customer_id: customerId,
                current_period_start: currentPeriodStart,
                current_period_end: currentPeriodEnd,
            });
    }
}

async function handlePaymentCaptured(event: any) {
    const payload = event.payload.payment.entity;
    
    // Use idempotency check by attempting to insert the payment.
    // If razorpay_payment_id already exists, it will fail (which is good)
    const paymentData = {
        razorpay_payment_id: payload.id,
        razorpay_order_id: payload.order_id,
        amount_paise: payload.amount,
        currency: payload.currency,
        status: payload.status,
        invoice_reference: payload.invoice_id,
        user_id: payload.notes?.user_id,
    };
    
    if (!paymentData.user_id) return;

    await supabaseAdmin.from("payments").insert(paymentData);
}

async function handlePaymentFailed(event: any) {
    const payload = event.payload.payment.entity;
    
    const paymentData = {
        razorpay_payment_id: payload.id,
        razorpay_order_id: payload.order_id,
        amount_paise: payload.amount,
        currency: payload.currency,
        status: "failed",
        invoice_reference: payload.invoice_id,
        user_id: payload.notes?.user_id,
    };
    
    if (!paymentData.user_id) return;

    await supabaseAdmin.from("payments").insert(paymentData);
}
