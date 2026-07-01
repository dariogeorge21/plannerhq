import { format } from "date-fns";
import { BillingCycle } from "@/types/types";

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

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function getPlanPrice(
  plan: { monthly_price_paise: number; yearly_price_paise: number },
  billingCycle: BillingCycle,
  showMonthly?: boolean
): { price: string; total?: string; suffix: string } {
  if (billingCycle === "yearly" && showMonthly) {
    const monthlyEquivalent = plan.yearly_price_paise / 12;
    return {
      price: formatPaiseToRupees(monthlyEquivalent),
      total: formatPaiseToRupees(plan.yearly_price_paise),
      suffix: "/mo",
    };
  }
  
  const paise = billingCycle === "monthly" ? plan.monthly_price_paise : plan.yearly_price_paise;
  return {
    price: formatPaiseToRupees(paise),
    suffix: billingCycle === "monthly" ? "/mo" : "/year",
  };
}

export function getSavingsPercentage(plan: { monthly_price_paise: number; yearly_price_paise: number }): number {
  const monthlyTotal = plan.monthly_price_paise * 12;
  const savings = monthlyTotal - plan.yearly_price_paise;
  return Math.round((savings / monthlyTotal) * 100);
}
