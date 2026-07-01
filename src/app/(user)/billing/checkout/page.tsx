import { redirect } from "next/navigation";
import { CheckoutClient } from "./components/checkout-client";
import { createClient } from "@/lib/supabase/server";
import { DbPlanRecord } from "@/types/billing";

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

  const supabase = await createClient();
  const { data: dbPlan } = await supabase
    .from("plans")
    .select("*")
    .eq("key", planKey)
    .single();

  if (!dbPlan) redirect("/billing");

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;

  return <CheckoutClient planKey={planKey} dbPlan={dbPlan} defaultCycle={billingCycle} razorpayKeyId={razorpayKeyId} />;
}