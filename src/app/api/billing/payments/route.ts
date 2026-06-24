import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPaymentHistory } from "@/features/billing/service";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: user } = await supabase.auth.getUser();

        if (!user?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payments = await getPaymentHistory(user.user.id);

        return NextResponse.json({ success: true, data: payments });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}
