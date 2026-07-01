import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BillingService } from "@/server/billing/services/billing.service";
import { BillingServiceError } from "@/server/billing/utils";
import { ChangePlanSchema } from "@/server/billing/validators/billing.validator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ChangePlanSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          code: "INVALID_INPUT",
          details: validated.error.flatten(),
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const billingService = BillingService.getInstance();
    const result = await billingService.changePlan({
      userId: user.id,
      newPlanKey: validated.data.newPlanKey,
      newBillingCycle: validated.data.newBillingCycle,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[BILLING ERROR] API change-plan failed:", error);

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
