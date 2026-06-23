import React from "react";
import { BillingClient } from "./components/billing-client";

export const metadata = {
  title: "Billing & Subscription - PlannerHQ",
  description: "Manage your PlannerHQ subscription and billing details.",
};

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-indigo-500/20">
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Billing & Usage
            </h1>
            <p className="text-neutral-500 mt-1 text-base">
              Manage your subscription, view your usage, and download invoices.
            </p>
          </div>
        </section>

        <BillingClient />
      </main>
    </div>
  );
}
