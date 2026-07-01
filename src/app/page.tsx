import { createClient } from "@/lib/supabase/server";

import Header from "@/components/header";
import HeroSection from "@/components/landingPage/hero";
import ProductsSection from "@/components/landingPage/products";
import FeaturesSection from "@/components/landingPage/features";
import PricingSection from "@/components/landingPage/pricing";
import TestimonialsSection from "@/components/landingPage/testimonials";
import FAQSection from "@/components/landingPage/faq";
import Footer from "@/components/footer";

export default async function App() {
  const supabase = await createClient();
  const { data: allPlans } = await supabase
    .from("plans")
    .select("*")
    .order("monthly_price_paise", { ascending: true });

  return (
    <div>
      <Header />
      <HeroSection />
      <ProductsSection />
      <FeaturesSection />
      <PricingSection allPlans={allPlans || []} />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}