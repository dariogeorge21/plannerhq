import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscription } from "@/features/billing/service";
import { getUserUsage } from "@/features/billing/usage";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: user } = await supabase.auth.getUser();

        if (!user?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { subscription, plan, dbPlan } = await getUserSubscription(user.user.id);
        const usage = await getUserUsage(user.user.id);

        // Fetch the most recent successful payment for display on dashboard/billing
        const { data: lastPayment } = await supabase
            .from("payments")
            .select("created_at, amount_paise, currency")
            .eq("user_id", user.user.id)
            .eq("status", "captured")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        return NextResponse.json({
            success: true,
            data: {
                subscription,
                plan,
                usage,
                dbPlan,
                lastPaymentDate: lastPayment?.created_at ?? null,
                lastPaymentAmount: lastPayment?.amount_paise ?? null,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
