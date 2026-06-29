import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createRazorpaySubscription } from "@/features/billing/service";
import { z } from "zod";
import { PlanKey, BillingCycle } from "@/types/types";

const CheckoutSchema = z.object({
  planKey: z.enum(["pro", "ultra"]),
  billingCycle: z.enum(["monthly", "yearly"]),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input: " + parsed.error.message },
        { status: 400 }
      );
    }

    const { planKey, billingCycle } = parsed.data;

    // IMPORTANT: Never reuse a stale Razorpay subscription_id.
    // Razorpay only accepts subscription_ids in "created" or "authenticated" state.
    // Returning a cancelled/expired/charged ID causes a 400:
    // "The id provided does not exist".
    //
    // Rule: If user has a confirmed ACTIVE subscription, block checkout (409).
    // For any other state, always create a fresh subscription.
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("razorpay_subscription_id, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (existing?.razorpay_subscription_id) {
      console.warn("[billing/checkout] Blocked duplicate checkout for user", user.id);
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have an active subscription. Please visit the billing page to manage it.",
        },
        { status: 409 }
      );
    }

    // Always create a fresh Razorpay subscription for checkout.
    const result = await createRazorpaySubscription(
      user.id,
      planKey as PlanKey,
      billingCycle as BillingCycle
    );

    console.info("[billing/checkout] Created new subscription", {
      userId: user.id,
      planKey,
      billingCycle,
      subscriptionId: result.subscriptionId,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("[billing/checkout] Error:", message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}