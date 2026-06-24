import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUserSubscription } from "@/features/billing/service";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { subscription, plan, dbPlan } = await getUserSubscription(user.id);
        // Get usage
        const { data: usage } = await supabase
            .from("subscription_usage")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        // Get last payment
        const { data: lastPayment } = await supabase
            .from("payments")
            .select("amount_paise, created_at")
            .eq("user_id", user.id)
            .eq("status", "captured")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        return NextResponse.json({
            success: true,
            data: {
                subscription,
                plan,
                dbPlan,
                usage: usage || null,
                lastPaymentDate: lastPayment?.created_at || null,
                lastPaymentAmount: lastPayment?.amount_paise || null,
            }
        });
    } catch (error) {
        console.error("Subscription API error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}