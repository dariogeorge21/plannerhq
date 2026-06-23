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

        return NextResponse.json({
            success: true,
            data: { subscription, plan, usage, dbPlan }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
