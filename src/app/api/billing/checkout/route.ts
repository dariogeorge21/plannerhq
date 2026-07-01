import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createRazorpaySubscription } from "@/features/billing/service";
import { PlanKey, BillingCycle } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planKey, billingCycle }: { planKey: PlanKey; billingCycle: BillingCycle } = body;

    const result = await createRazorpaySubscription(user.id, planKey, billingCycle);

    console.info("[billing/checkout] Created new subscription", {
      userId: user.id,
      planKey,
      billingCycle,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[BILLING ERROR] Checkout API error:", error);

    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json(
      { success: false, message, code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
