"use server";

import { createClient } from "@/lib/supabase/server";
import { BillingService } from "../services/billing.service";
import { ApiResponse } from "../types";
import { BillingServiceError } from "../utils";
import { CreateCheckoutSchema, CreateCheckoutInput } from "../validators/billing.validator";

export async function createCheckout(input: CreateCheckoutInput): Promise<ApiResponse> {
  try {
    const validated = CreateCheckoutSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid input",
        code: "INVALID_INPUT",
        details: validated.error.flatten(),
      };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      };
    }

    const billingService = BillingService.getInstance();
    const result = await billingService.createCheckout({
      userId: user.id,
      planKey: validated.data.planKey,
      billingCycle: validated.data.billingCycle,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("[BILLING ERROR] createCheckout failed:", error);

    if (error instanceof BillingServiceError) {
      return {
        success: false,
        message: error.message,
        code: error.code,
        details: error.details,
      };
    }

    return {
      success: false,
      message: "Failed to create checkout",
      code: "INTERNAL_ERROR",
    };
  }
}
