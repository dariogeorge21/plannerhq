// components/Pricing.tsx
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For personal use and getting started.",
    features: [
      "Up to 3 team members",
      "Basic collaboration",
      "5 GB storage",
      "Community support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "per user/month",
    description: "Advanced collaboration for growing teams.",
    features: [
      "Unlimited members",
      "AI writing assistant",
      "Team workspaces",
      "100 GB storage",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations that need scale and security.",
    features: [
      "Unlimited scale",
      "SSO & SAML",
      "Advanced permissions",
      "Audit logs",
      "Dedicated support",
      "SLA agreement",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#FAFAFA] py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            Simple pricing that scales with your team.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border ${
                plan.highlighted
                  ? "border-[#4F46E5] shadow-xl ring-1 ring-[#4F46E5]/20 relative bg-white"
                  : "border-[#EAEAEA] shadow-sm bg-white"
              } p-8 transition-all hover:shadow-md`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#111111]">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#111111]">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-[#111111]/40">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[#111111]/50">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[#111111]/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`block text-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-[#111111] text-white hover:bg-[#111111]/90"
                    : "bg-white text-[#111111] border border-[#EAEAEA] hover:bg-[#FAFAFA]"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}