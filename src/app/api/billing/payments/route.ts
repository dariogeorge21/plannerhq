import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PaymentsRepository } from "@/server/billing/repositories/payments.repository";
import { BillingServiceError } from "@/server/billing/utils";

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

        const paymentsRepo = PaymentsRepository.getInstance();
        const payments = await paymentsRepo.getByUserId(user.id);

        return NextResponse.json({ success: true, data: payments });
    } catch (error) {
        console.error("[BILLING ERROR] Payments API error:", error);

        if (error instanceof BillingServiceError) {
            return NextResponse.json(
                { success: false, message: error.message, code: error.code },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Failed to fetch payments", code: "INTERNAL_ERROR" },
            { status: 500 }
        );
    }
}