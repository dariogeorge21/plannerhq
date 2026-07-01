import { BillingErrorCode } from "../types";
import { BillingCycle } from "@/types/types";

export class BillingServiceError extends Error {
  public code: BillingErrorCode;
  public details?: Record<string, any>;

  constructor(code: BillingErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = "BillingServiceError";
    this.code = code;
    this.details = details;
  }
}

export function formatPaiseToRupees(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 MB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`;
  return tokens.toString();
}

export function getSubscriptionStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    past_due: "Past Due",
    cancelled: "Cancelled",
    expired: "Expired",
  };
  return labels[status] || status;
}

export function getRazorpayPlanId(
  plan: { razorpay_plan_id_monthly?: string | null; razorpay_plan_id_yearly?: string | null },
  billingCycle: BillingCycle
): string {
  const planId = billingCycle === "yearly" ? plan.razorpay_plan_id_yearly : plan.razorpay_plan_id_monthly;
  if (!planId) {
    throw new BillingServiceError(
      BillingErrorCode.PLAN_NOT_FOUND,
      `Razorpay plan ID not configured for ${billingCycle} billing`
    );
  }
  return planId;
}
