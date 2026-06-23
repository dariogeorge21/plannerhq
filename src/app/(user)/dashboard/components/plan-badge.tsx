"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { useSubscription } from "@/features/billing/hooks/useSubscription";

export function PlanBadge() {
  const { data, loading } = useSubscription();

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 shadow-sm text-xs font-semibold tracking-wide text-neutral-400 mb-4 h-6 w-24">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      </div>
    );
  }

  const planName = data?.dbPlan?.name || "Free Starter";
  const isPaid = data?.dbPlan?.key && data.dbPlan.key !== "free";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm text-xs font-semibold tracking-wide mb-4 ${isPaid ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-neutral-200 text-neutral-600"}`}>
      <Sparkles className={`w-3.5 h-3.5 ${isPaid ? "text-indigo-600" : "text-indigo-500"}`} /> {planName}
    </div>
  );
}
