import React from "react";
import { BillingClient } from "./components/billing-client";

export const metadata = {
  title: "Billing & Subscription — PlannerHQ",
  description: "Manage your PlannerHQ subscription, view usage, and access payment history.",
};

export default function BillingPage() {
  return <BillingClient />;
}