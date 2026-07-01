import { NextResponse } from "next/server";
import { BillingService } from "@/server/billing/services/billing.service";
import { BillingServiceError } from "@/server/billing/utils";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const billingService = BillingService.getInstance();
        const overview = await billingService.getBillingOverview(user.id);

        // Maintain backward compatibility with existing frontend
        return NextResponse.json({
            success: true,
            data: {
                subscription: overview.subscription,
                dbPlan: overview.currentPlan,
                allPlans: overview.availablePlans,
                usage: overview.usage,
                lastPaymentDate: overview.lastPaymentDate,
                lastPaymentAmount: overview.lastPaymentAmount,
            },
        });
    } catch (error) {
        console.error("[BILLING ERROR] Subscription API error:", error);

        if (error instanceof BillingServiceError) {
            return NextResponse.json(
                { success: false, message: error.message, code: error.code },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
