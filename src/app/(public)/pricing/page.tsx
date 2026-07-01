import { createClient } from "@/lib/supabase/server";
import { PricingClient } from "./components/pricing-client";

export const metadata = {
  title: "Pricing — PlannerHQ",
  description: "Flexible pricing plans to suit your needs.",
};

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: allPlans } = await supabase
    .from("plans")
    .select("*")
    .order("monthly_price_paise", { ascending: true });

  return <PricingClient allPlans={allPlans || []} />;
}