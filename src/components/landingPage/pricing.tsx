"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight, Building2 } from "lucide-react";
import { DbPlanRecord } from "@/types/billing";

function paise(amount: number): string {
  if (amount === 0) return "Free";
  return `₹${(amount / 100).toLocaleString("en-IN")}`;
}

export default function PricingSection({ allPlans }: { allPlans: DbPlanRecord[] }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const activePlans = allPlans.filter(p => p.key !== "free");

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32 selection:bg-indigo-500/30 font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-0 w-250 h-125 bg-linear-to-b from-indigo-500/5 to-transparent blur-3xl rounded-full opacity-70 -translate-y-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/10 bg-indigo-50/50 px-3 py-1 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              Pricing & Plans
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 text-balance mb-6"
          >
            Simple pricing that scales with your team.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-neutral-500 leading-relaxed text-balance max-w-2xl mx-auto"
          >
            Start for free and upgrade when you need more power. Transparent pricing with no hidden fees or unexpected overages.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex justify-center"
          >
            <div className="relative flex items-center rounded-full border border-neutral-200/80 bg-neutral-50/50 p-1.5 shadow-sm backdrop-blur-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`relative w-32 py-2.5 text-sm font-semibold rounded-full transition-colors z-10 ${
                  billingCycle === "monthly" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`relative w-40 py-2.5 text-sm font-semibold rounded-full transition-colors z-10 flex items-center justify-center gap-1.5 ${
                  billingCycle === "yearly" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Yearly
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider transition-colors ${
                  billingCycle === "yearly" ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-500"
                }`}>
                  Save 20%
                </span>
              </button>
              
              {/* Active Toggle Background */}
              <div
                className={`absolute top-1.5 bottom-1.5 w-32 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-neutral-200/50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  billingCycle === "yearly" ? "translate-x-32 w-40" : "translate-x-0"
                }`}
              />
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto items-start">
          {activePlans.map((plan, idx) => {
            const isHighlighted = plan.key === "ultra";
            const isEnterprise = plan.key === "enterprise";
            const monthlyPrice = isEnterprise ? "Custom" : paise(plan.monthly_price_paise);
            const yearlyPrice = isEnterprise ? "Custom" : paise(plan.yearly_price_paise / 12);
            
            return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
              className={`relative flex flex-col h-full rounded-4xl bg-white transition-all duration-300 ${
                isHighlighted
                  ? "border border-indigo-200 shadow-[0_0_40px_rgba(79,70,229,0.1)] hover:shadow-[0_0_60px_rgba(79,70,229,0.15)] ring-1 ring-indigo-50 z-10 lg:-mt-4 lg:mb-4"
                  : "border border-neutral-200/80 shadow-sm hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-1"
              }`}
            >
              {isHighlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-linear-to-r from-indigo-500 to-emerald-500 rounded-full text-xs font-bold text-white shadow-md tracking-wide uppercase">
                  Best Value
                </div>
              )}

              <div className="p-8 xl:p-10 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className={`text-xl font-bold tracking-tight mb-2 ${isHighlighted ? "text-indigo-600" : "text-neutral-900"}`}>
                    {plan.name}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed h-10">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 border-b border-neutral-100 pb-8">
                  <div className="flex items-end gap-2">
                    {isEnterprise ? (
                      <span className="text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900">
                        Custom
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 flex items-start">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={billingCycle === "yearly" ? yearlyPrice : monthlyPrice}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {billingCycle === "yearly" ? yearlyPrice : monthlyPrice}
                            </motion.span>
                          </AnimatePresence>
                        </span>
                        <div className="flex flex-col pb-1.5">
                          <span className="text-sm font-medium text-neutral-500">/ user</span>
                          <span className="text-xs text-neutral-400">/ month</span>
                        </div>
                      </>
                    )}
                  </div>
                  {!isEnterprise && (
                    <div className="h-4 mt-2">
                      <AnimatePresence>
                        {billingCycle === "yearly" && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs font-medium text-emerald-600"
                          >
                            {/* Billed ${ (parseInt(plan.yearlyPrice) * 12 ).toLocaleString() } annually per user */}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <ul className="space-y-4 flex-1 mb-10">
                  <li className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-sm text-neutral-600 leading-snug">
                      {plan.key === "enterprise" ? "Unlimited Workspaces" : `Up to ${plan.max_workspaces} Workspaces`}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-sm text-neutral-600 leading-snug">
                      {plan.key === "enterprise" ? "Unlimited Storage" : `${plan.max_storage_bytes / (1024 * 1024 * 1024)} GB Storage`}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-sm text-neutral-600 leading-snug">
                      {plan.key === "enterprise" ? "Unlimited AI tokens" : `${plan.max_ai_tokens >= 1000000 ? `${plan.max_ai_tokens / 1000000}M` : `${plan.max_ai_tokens / 1000}K`} tokens/day`}
                    </span>
                  </li>
                </ul>

                <a
                  href={isEnterprise ? "/contact" : "/signup"}
                  className={`group relative flex items-center justify-center gap-2 w-full rounded-full py-3.5 text-sm font-bold transition-all ${
                    isHighlighted
                      ? "bg-neutral-950 text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:bg-neutral-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-95"
                      : "bg-white border-2 border-neutral-200/80 text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 active:scale-95"
                  }`}
                >
                  {isEnterprise ? "Contact Sales" : "Get Started"}
                  {isEnterprise ? (
                    <Building2 className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </a>
              </div>
            </motion.div>
          )}
          )}
        </div>

        {/* Enterprise Trusted By Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 pt-10 border-t border-neutral-200/60"
        >
          <div className="flex flex-col items-center justify-center gap-6">
            <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest text-center">
              Trusted by innovative teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale">
              {/* Abstract minimalist logo shapes to represent trust */}
              <div className="flex items-center gap-2 font-bold text-xl text-neutral-800"><div className="w-6 h-6 rounded bg-neutral-800" />Vellum</div>
              <div className="flex items-center gap-2 font-bold text-xl text-neutral-800"><div className="w-6 h-6 rounded-full bg-neutral-800" />Lumen</div>
              <div className="flex items-center gap-2 font-bold text-xl text-neutral-800"><div className="w-6 h-6 rotate-45 bg-neutral-800" />Aether</div>
              <div className="flex items-center gap-2 font-bold text-xl text-neutral-800"><div className="w-6 h-6 rounded-tr-xl rounded-bl-xl bg-neutral-800" />Northstar</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}