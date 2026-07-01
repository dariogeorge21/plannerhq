"use server";

import { createClient } from "@/lib/supabase/server";
import { BillingService } from "../services/billing.service";
import { ApiResponse } from "../types";
import { BillingServiceError } from "../utils";

export async function getBillingOverview(): Promise<ApiResponse> {
  try {
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
    const overview = await billingService.getBillingOverview(user.id);

    return {
      success: true,
      data: overview,
    };
  } catch (error) {
    console.error("[BILLING ERROR] getBillingOverview failed:", error);

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
      message: "Failed to fetch billing overview",
      code: "INTERNAL_ERROR",
    };
  }
}
