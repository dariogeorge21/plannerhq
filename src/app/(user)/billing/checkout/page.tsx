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

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;

  return <CheckoutClient planKey={planKey} defaultCycle={billingCycle} razorpayKeyId={razorpayKeyId} />;
}