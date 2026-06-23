import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createRazorpaySubscription } from "@/features/billing/service";
import { BillingCycle, PlanKey } from "@/types/types";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: user } = await supabase.auth.getUser();

        if (!user?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { planKey, billingCycle } = body as { planKey: PlanKey, billingCycle: BillingCycle };

        if (!planKey || !billingCycle) {
            return NextResponse.json({ error: "Missing plan or billing cycle" }, { status: 400 });
        }

        const data = await createRazorpaySubscription(user.user.id, planKey, billingCycle);

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
