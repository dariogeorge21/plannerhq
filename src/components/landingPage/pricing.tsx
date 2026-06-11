"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PricingPlans } from "@/data/data";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section
      id="pricing"
      className="bg-white py-24 lg:py-32"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            Simple pricing that scales with your team.
          </h2>

          {/* Billing Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center rounded-full border border-[#EAEAEA] bg-[#FAFAFA] p-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  billing === "monthly"
                    ? "bg-[#111111] text-white"
                    : "text-[#111111]/60"
                }`}
              >
                Monthly
              </button>

              <button
                onClick={() => setBilling("yearly")}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  billing === "yearly"
                    ? "bg-[#111111] text-white"
                    : "text-[#111111]/60"
                }`}
              >
                Yearly
                <span className="ml-2 text-xs text-green-500">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {PricingPlans.map((plan) => {
            const price =
              billing === "monthly"
                ? plan.monthlyPrice
                : plan.yearlyPrice;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                  plan.highlighted
                    ? "border-[#4F46E5] shadow-xl ring-1 ring-[#4F46E5]/20"
                    : "border-[#EAEAEA] shadow-sm hover:shadow-md"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#4F46E5] px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold text-[#111111]">
                    {plan.name}
                  </h3>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-bold text-[#111111]">
                      {price}
                    </span>

                    {price !== "Free" && price !== "Custom" && (
                      <span className="pb-1 text-sm text-[#111111]/50">
                        /user/month
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-[#111111]/50">
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-8 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Check className="h-4 w-4 text-[#10B981]" />
                      <span className="text-[#111111]/70">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.href}
                  className={`mt-8 block rounded-full px-4 py-3 text-center text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-[#111111] text-white hover:bg-[#111111]/90"
                      : "border border-[#EAEAEA] bg-white text-[#111111] hover:bg-[#FAFAFA]"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}