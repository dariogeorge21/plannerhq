"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Pricing from "@/components/landingPage/pricing";

import { BillingCycle, Plan, Cell } from "@/types/types";
import { pricingPageContent } from "@/data/data";

function formatPlanPrice(plan: Plan, cycle: BillingCycle) {
  const value = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const suffix = cycle === "monthly" ? plan.monthlySuffix : plan.yearlySuffix;
  return { value, suffix };
}

function CellContent({ cell }: { cell: Cell }) {
  if (cell.kind === "check") {
    return (
      <span className="inline-flex items-center justify-center text-[#111111]">
        <Check className="h-5 w-5" />
      </span>
    );
  }

  if (cell.kind === "blank") {
    return <span className="text-[#111111]/20">—</span>;
  }

  return (
    <div className="space-y-1">
      {cell.lines.map((line, index) => (
        <p
          key={`${line}-${index}`}
          className={
            cell.mutedLines?.includes(index)
              ? "text-[#111111]/45"
              : "text-[#111111]/80"
          }
        >
          {line}
        </p>
      ))}
    </div>
  );
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const activeLabel = useMemo(
    () => (billingCycle === "monthly" ? "Monthly billing" : "Yearly billing"),
    [billingCycle]
  );

  return (
    <>
      <Header />
      <Pricing />
      <main className="min-h-screen bg-white text-[#111111]">
        <section
          id="pricing"
          className="relative overflow-hidden py-16 lg:py-24"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-64 bg-gradient-to-b from-[#4F46E5]/5 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-16 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#4F46E5]/5 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EAEAEA] bg-white px-4 py-2 text-sm text-[#111111]/60 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#4F46E5]" />
                {activeLabel}
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-[#111111] lg:text-6xl">
                {pricingPageContent.title}
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#111111]/55 lg:text-lg">
                {pricingPageContent.subtitle}
              </p>

              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-full border border-[#EAEAEA] bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    aria-pressed={billingCycle === "monthly"}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                      billingCycle === "monthly"
                        ? "bg-[#111111] text-white shadow-sm"
                        : "text-[#111111]/60 hover:text-[#111111]"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    aria-pressed={billingCycle === "yearly"}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                      billingCycle === "yearly"
                        ? "bg-[#111111] text-white shadow-sm"
                        : "text-[#111111]/60 hover:text-[#111111]"
                    }`}
                  >
                    Yearly
                    <span className="ml-2 text-xs text-emerald-500">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-14">
              <div className="grid gap-4 lg:grid-cols-4">
                {pricingPageContent.plans.map((plan) => {
                  const price = formatPlanPrice(plan, billingCycle);

                  return (
                    <article
                      key={plan.key}
                      className={`relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg lg:p-8 ${
                        plan.featured
                          ? "border-[#4F46E5] ring-1 ring-[#4F46E5]/15"
                          : "border-[#EAEAEA]"
                      }`}
                    >
                      {plan.ribbon ? (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#4F46E5] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          {plan.ribbon}
                        </div>
                      ) : null}

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                              {plan.name}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-[#111111]/55">
                              {plan.description}
                            </p>
                          </div>
                          {plan.featured ? (
                            <span className="rounded-full bg-[#4F46E5]/10 px-3 py-1 text-xs font-medium text-[#4F46E5]">
                              Recommended
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-6 flex items-end gap-2">
                          <span className="text-4xl font-bold tracking-tight">
                            {price.value}
                          </span>
                          {price.suffix ? (
                            <span className="pb-1 text-sm text-[#111111]/50">
                              {price.suffix}
                            </span>
                          ) : null}
                        </div>

                        <Link
                          href={plan.href}
                          className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-all ${
                            plan.featured
                              ? "bg-[#111111] text-white hover:bg-[#111111]/90"
                              : "border border-[#EAEAEA] bg-white text-[#111111] hover:bg-[#FAFAFA]"
                          }`}
                        >
                          <span>{plan.ctaLabel}</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-12 overflow-hidden rounded-[28px] border border-[#EAEAEA] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <div className="min-w-[1120px]">
                    <div className="grid grid-cols-[minmax(260px,1.3fr)_repeat(4,minmax(185px,1fr))] border-b border-[#EAEAEA] bg-[#FAFAFA] px-6 py-4 text-sm font-medium text-[#111111]/60">
                      <div>Feature</div>
                      {pricingPageContent.plans.map((plan) => (
                        <div key={plan.key} className="text-left">
                          {plan.name}
                        </div>
                      ))}
                    </div>

                    {pricingPageContent.groups.map((group) => (
                      <div key={group.title}>
                        <div className="border-b border-[#EAEAEA] px-6 py-4 text-sm font-medium text-[#111111]/45">
                          {group.title}
                        </div>

                        {group.rows.map((row) => (
                          <div
                            key={row.label}
                            className="grid grid-cols-[minmax(260px,1.3fr)_repeat(4,minmax(185px,1fr))] items-start border-b border-[#EAEAEA] px-6 py-5 transition-colors last:border-b-0 hover:bg-[#FAFAFA]/70"
                          >
                            <div className="pr-6 text-sm font-semibold leading-6 text-[#111111]">
                              {row.label}
                            </div>

                            {pricingPageContent.plans.map((plan) => (
                              <div
                                key={plan.key}
                                className="pr-6 text-sm leading-6 text-[#111111]/75"
                              >
                                <CellContent cell={row.values[plan.key]} />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}