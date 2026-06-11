'use client';

import Header from "@/components/header";
import Hero from "@/components/landingPage/hero";
import Products from "@/components/landingPage/products";
import Features from "@/components/landingPage/features";
import Pricing from "@/components/landingPage/pricing";
import Testimonials from "@/components/landingPage/testimonials";
import FAQ from "@/components/landingPage/faq";
import Footer from "@/components/footer";

export default function App() {
  return (
    <div>
      <Header />
      <Hero />
      <Products />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}