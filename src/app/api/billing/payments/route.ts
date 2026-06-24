import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaymentHistory } from "@/features/billing/service";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const payments = await getPaymentHistory(user.id);
        return NextResponse.json({ success: true, data: payments });
    } catch (error) {
        console.error("Payments error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch payments" }, { status: 500 });
    }
}