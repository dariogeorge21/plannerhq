import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createRazorpaySubscription } from "@/features/billing/service";
import { BillingCycle, PlanKey } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planKey, billingCycle }: { planKey: PlanKey; billingCycle: BillingCycle } = body;

    if (!planKey || !billingCycle) {
      return NextResponse.json({ success: false, message: "Missing plan or cycle" }, { status: 400 });
    }

    // Validate plan
    const validPlans: PlanKey[] = ["pro", "ultra"];
    if (!validPlans.includes(planKey)) {
      return NextResponse.json({ success: false, message: "Invalid plan" }, { status: 400 });
    }

    const result = await createRazorpaySubscription(user.id, planKey, billingCycle);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ success: false, message: error.message || "Checkout failed" }, { status: 500 });
  }
}