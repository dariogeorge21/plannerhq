import React from "react";
import { BillingClient } from "./components/billing-client";

export const metadata = {
  title: "Billing & Subscription — PlannerHQ",
  description: "Manage your PlannerHQ subscription, view usage, and access payment history.",
};

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main className="max-w-4xl w-full mx-auto px-5 py-10 flex flex-col gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Account</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Billing & Subscription</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your plan, review usage, and access payment history.
          </p>
        </div>
        <BillingClient />
      </main>
    </div>
  );
}