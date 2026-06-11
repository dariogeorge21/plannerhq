'use client';

import Header from "@/components/header";
import HeroSection from "@/components/landingPage/hero";
import ProductsSection from "@/components/landingPage/products";
import FeaturesSection from "@/components/landingPage/features";
import PricingSection from "@/components/landingPage/pricing";
import TestimonialsSection from "@/components/landingPage/testimonials";
import FAQSection from "@/components/landingPage/faq";
import Footer from "@/components/footer";

export default function App() {
  return (
    <div>
      <Header />
      <HeroSection />
      <ProductsSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}