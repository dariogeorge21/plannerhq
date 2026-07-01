import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BillingService } from "@/server/billing/services/billing.service";
import { BillingServiceError } from "@/server/billing/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const billingService = BillingService.getInstance();
    const overview = await billingService.getBillingOverview(user.id);

    return NextResponse.json({ success: true, data: overview });
  } catch (error) {
    console.error("[BILLING ERROR] API overview failed:", error);

    if (error instanceof BillingServiceError) {
      return NextResponse.json(
        { success: false, message: error.message, code: error.code, details: error.details },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
