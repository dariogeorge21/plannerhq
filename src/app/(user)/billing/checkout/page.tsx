import React from "react";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./components/checkout-client";
import { BILLING_PLANS } from "@/data/data";

export const metadata = {
  title: "Confirm Subscription — PlannerHQ",
  description: "Review and confirm your PlannerHQ plan upgrade.",
};

interface PageProps {
  searchParams: Promise<{ plan?: string; cycle?: string }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { plan, cycle } = params;

  const validPlans = ["pro", "ultra"] as const;
  const validCycles = ["monthly", "yearly"] as const;

  const planKey = validPlans.find((p) => p === plan);
  const billingCycle = validCycles.find((c) => c === cycle) ?? "yearly";

  if (!planKey) {
    redirect("/billing");
  }

  const planData = BILLING_PLANS.find((p) => p.key === planKey);
  if (!planData) redirect("/billing");

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans">
      <main className="max-w-4xl w-full mx-auto px-5 py-10">
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
          <a href="/billing" className="hover:text-neutral-600 transition-colors font-semibold">Billing</a>
          <span>/</span>
          <span className="text-neutral-600 font-semibold">Confirm Subscription</span>
        </nav>
        <CheckoutClient planKey={planKey} defaultCycle={billingCycle} />
      </main>
    </div>
  );
}