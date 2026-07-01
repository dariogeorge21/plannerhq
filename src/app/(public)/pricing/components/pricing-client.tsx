"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Check, Sparkles, Building2, HelpCircle } from "lucide-react";
import { useSession } from "@/features/auth/providers/SessionProvider";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { BillingCycle, Cell } from "@/types/types";
import { pricingPageContent } from "@/data/data";
import { DbPlanRecord } from "@/types/billing";

function paise(amount: number): string {
  if (amount === 0) return "Free";
  return `₹${(amount / 100).toLocaleString("en-IN")}`;
}

function formatPlanPrice(plan: DbPlanRecord, cycle: BillingCycle) {
  if (plan.key === "enterprise") return { value: "Custom", suffix: "" };
  
  const value = cycle === "monthly" ? paise(plan.monthly_price_paise) : paise(plan.yearly_price_paise / 12);
  const suffix = cycle === "monthly" ? "per month" : "per month billed yearly";
  return { value, suffix };
}

function CellContent({ cell }: { cell: Cell }) {
  if (cell.kind === "check") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 shadow-sm">
        <Check className="h-3.5 w-3.5 text-emerald-600 stroke-3" />
      </span>
    );
  }

  if (cell.kind === "blank") {
    return <span className="text-neutral-300 font-bold">—</span>;
  }

  return (
    <div className="space-y-1">
      {cell.lines.map((line, index) => {
        const isMuted = cell.mutedLines?.includes(index);
        return (
          <p
            key={`${line}-${index}`}
            className={
              isMuted
                ? "text-xs font-medium text-neutral-400"
                : "text-sm font-semibold text-neutral-700"
            }
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}

export function PricingClient({ allPlans }: { allPlans: DbPlanRecord[] }) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const { user } = useSession();

  const activePlans = allPlans.filter(p => p.key !== "free" && p.is_active);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-indigo-500/30 font-sans">
      <Header />

      <main className="flex-1 relative pt-24 pb-32">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="absolute top-0 w-300 h-150 bg-linear-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl rounded-full opacity-60 -translate-y-1/3" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center mt-12 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50/50 px-3 py-1 mb-8 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Pricing & Plans
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 text-balance"
          >
            {pricingPageContent.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto text-balance leading-relaxed"
          >
            {pricingPageContent.subtitle}
          </motion.p>

          {/* Billing Cycle Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <div className="relative flex items-center p-1.5 bg-neutral-100/80 rounded-full border border-neutral-200/60 shadow-inner backdrop-blur-md">
              {(["monthly", "yearly"] as const).map((cycle) => {
                const isActive = billingCycle === cycle;
                return (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`relative z-10 flex w-35 items-center justify-center py-2.5 text-sm font-bold capitalize transition-colors duration-300 ${
                      isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 z-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-neutral-200/80"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {cycle}
                      {cycle === "yearly" && (
                        <span
                          className={`text-[9px] leading-none px-1.5 py-0.5 rounded font-black uppercase tracking-wider transition-colors duration-300 ${
                            isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-neutral-200 text-neutral-500"
                          }`}
                        >
                          Save 20%
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="relative z-10 mx-auto mt-20 max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
            {activePlans.map((plan, idx) => {
              const isDark = plan.key === "ultra" || plan.key === "enterprise";
              const ribbon = plan.key === "ultra" ? "Best value" : (plan.key === "pro" ? "Popular" : undefined);
              const cta = plan.key === "enterprise" ? "Contact us" : "Get started";
              const href = plan.key === "enterprise" ? "mailto:sales@plannerhq.com" : `/billing/checkout?plan=${plan.key}`;
              const { value, suffix } = formatPlanPrice(plan, billingCycle);

              return (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  className={`relative flex flex-col rounded-4xl p-8 transition-all duration-300 ${
                    isDark
                      ? "bg-white/80 text-neutral-900 shadow-2xl shadow-indigo-500/10 scale-100 lg:scale-105 z-10 border ring-1 ring-indigo-500/20"
                      : "bg-white/80 backdrop-blur-xl text-neutral-900 border border-neutral-200/80 shadow-xl shadow-neutral-200/40 hover:shadow-2xl hover:shadow-neutral-200/60"
                  }`}
                >
                  {isDark && ribbon && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-linear-to-r from-indigo-500 to-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {ribbon}
                    </div>
                  )}

                  <div className="mb-6 flex-1">
                    <h3
                      className={`text-2xl font-bold tracking-tight ${
                        isDark ? "text-neutral-900" : "text-neutral-900"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`mt-3 text-sm leading-relaxed h-12 ${
                        isDark ? "text-neutral-500" : "text-neutral-500"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div className={`mb-8 border-b pb-8 ${isDark ? "border-neutral-100" : "border-neutral-100"}`}>
                    <div className="flex items-baseline gap-1">
                      {value === "Custom" ? (
                        <span className={`text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
                          Custom
                        </span>
                      ) : (
                        <>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={value}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className={`text-5xl font-extrabold tracking-tight ${isDark ? "text-neutral-900" : "text-neutral-900"}`}
                            >
                              {value}
                            </motion.span>
                          </AnimatePresence>
                          <span className={`text-sm font-medium ml-1 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                            /mo
                          </span>
                        </>
                      )}
                    </div>
                    {value !== "Custom" && (
                      <div className="h-4 mt-2">
                        <AnimatePresence>
                          {billingCycle === "yearly" && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className={`text-xs font-semibold ${isDark ? "text-emerald-600" : "text-emerald-600"}`}
                            >
                              {suffix}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  <Link
                    href={user ? "/billing" : href}
                    className={`group relative flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all duration-300 active:scale-95 ${
                      isDark
                        ? "bg-neutral-950 text-white hover:bg-neutral-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
                        : "bg-neutral-950 text-white hover:bg-neutral-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
                    }`}
                  >
                    {user ? (plan.key === "enterprise" ? "Contact us" : "Manage plan") : cta}
                    {plan.key === "enterprise" ? (
                      <Building2 className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enterprise Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-24 max-w-5xl px-6 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-8">
            Trusted by forward-thinking teams globally
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
            {/* Minimalist abstract logos representing trust */}
            <div className="flex items-center gap-2 font-bold text-xl text-neutral-800">
              <div className="w-6 h-6 rounded bg-neutral-800" /> Vellum
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-neutral-800">
              <div className="w-6 h-6 rounded-full bg-neutral-800" /> Lumen
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-neutral-800">
              <div className="w-6 h-6 rotate-45 bg-neutral-800" /> Aether
            </div>
            <div className="flex items-center gap-2 font-bold text-xl text-neutral-800">
              <div className="w-6 h-6 rounded-tr-xl rounded-bl-xl bg-neutral-800" /> Northstar
            </div>
          </div>
        </motion.div>

        {/* Detailed Comparison Table */}
        <div className="relative z-10 mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">
              Compare features side-by-side
            </h2>
            <p className="mt-4 text-neutral-500 font-medium">
              Everything you need to know to make the right choice.
            </p>
          </div>

          <div className="overflow-x-auto pb-12 -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0">
            <div className="min-w-250 rounded-3xl bg-white/60 border border-neutral-200/80 shadow-2xl shadow-neutral-200/50 backdrop-blur-2xl">
              
              {/* Table Header Sticky */}
              <div className="sticky z-30 grid grid-cols-[minmax(280px,1.3fr)_repeat(4,minmax(180px,1fr))] items-end border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl px-8 py-6 rounded-t-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="text-lg font-extrabold tracking-tight text-neutral-900">
                  Features Overview
                </div>
                {activePlans.map((plan) => (
                  <div key={plan.key} className="pr-6">
                    <h4 className="text-base font-bold text-neutral-900">
                      {plan.name}
                    </h4>
                    <p className="text-sm font-semibold text-indigo-600 mt-1">
                      {formatPlanPrice(plan, billingCycle).value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Table Body */}
              <div className="rounded-b-3xl overflow-hidden">
                {pricingPageContent.groups.map((group) => (
                  <div key={group.title} className="group/section">
                    <div className="border-b border-neutral-200/60 bg-neutral-50/80 px-8 py-4 text-xs font-black tracking-widest text-neutral-500 uppercase flex items-center gap-2">
                      {group.title}
                    </div>

                    {group.rows.map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-[minmax(280px,1.3fr)_repeat(4,minmax(180px,1fr))] items-center border-b border-neutral-100 px-8 py-5 transition-colors hover:bg-neutral-50/50 last:border-b-0"
                      >
                        <div className="pr-6 flex items-center gap-2 text-sm font-semibold text-neutral-800">
                          {row.label}
                          <HelpCircle className="w-3.5 h-3.5 text-neutral-300 cursor-help" />
                        </div>

                        {activePlans.map((plan) => {
                          const rowKey = plan.key as keyof typeof row.values;
                          return (
                            <div key={plan.key} className="pr-6">
                              <CellContent cell={row.values[rowKey]} />
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}