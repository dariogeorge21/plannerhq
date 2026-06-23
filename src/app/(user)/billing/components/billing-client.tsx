"use client";

import React, { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import {
  Loader2, CreditCard, CheckCircle2, ArrowRight, Check, X,
  Zap, Building2, Shield, ChevronRight, AlertTriangle, TrendingUp,
  Calendar, RefreshCw, Clock, Info, Sparkles, BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { BILLING_PLANS } from "@/data/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type BillingData = {
  subscription: any;
  plan: any;
  usage: any;
  dbPlan: any;
};

type PaidBillingPlan = {
  key: "pro" | "ultra";
  name: string;
  monthlyDisplay: string;
  yearlyDisplay: string;
  monthlyTotal: string;
  yearlyTotal: string;
  annualSaving: number;
  savingLabel: string;
  description: string;
  features: readonly string[];
  highlighted: boolean;
  ribbon: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 MB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

function usagePct(used: number, limit: number): number {
  if (!limit || limit > 999_999_999) return 0;
  return Math.min(100, (used / limit) * 100);
}

function usageColor(pct: number): string {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-indigo-500";
}

const PAID_PLANS = BILLING_PLANS.filter(
  (p): p is PaidBillingPlan & typeof p => p.key === "pro" || p.key === "ultra"
) as unknown as PaidBillingPlan[];

// ─── Sub-components ───────────────────────────────────────────────────────────

function UsageMeter({
  label, used, limit, formatFn,
}: { label: string; used: number; limit: number; formatFn: (n: number) => string }) {
  const pct = usagePct(used, limit);
  const color = usageColor(pct);
  const isUnlimited = limit > 999_999_998;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-neutral-700">{label}</span>
        <span className="text-neutral-500 font-medium text-xs">
          {isUnlimited ? `${formatFn(used)} used` : `${formatFn(used)} / ${formatFn(limit)}`}
        </span>
      </div>
      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isUnlimited ? "4%" : `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      {!isUnlimited && pct >= 80 && (
        <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {pct >= 90 ? "Almost at limit — consider upgrading" : "Getting close to limit"}
        </p>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 animate-pulse">
      <div className="h-52 rounded-3xl bg-neutral-100" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-40 rounded-3xl bg-neutral-100" />
        <div className="h-40 rounded-3xl bg-neutral-100" />
      </div>
      <div className="h-80 rounded-3xl bg-neutral-100" />
    </div>
  );
}

// ─── Plan Selector Modal ──────────────────────────────────────────────────────

function PlanSelectorModal({
  open,
  onClose,
  onSelect,
  currentPlanKey,
  processingKey,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (planKey: string, cycle: "monthly" | "yearly") => void;
  currentPlanKey: string | null;
  processingKey: string | null;
}) {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  const [confirming, setConfirming] = useState<PaidBillingPlan | null>(null);

  const handleSelect = (plan: PaidBillingPlan) => {
    setConfirming(plan);
  };

  const handleConfirm = () => {
    if (!confirming) return;
    onSelect(confirming.key, cycle);
    setConfirming(null);
  };

  useEffect(() => {
    if (!open) { setConfirming(null); setCycle("yearly"); }
  }, [open]);

  if (!open) return null;

  const price = (plan: PaidBillingPlan) =>
    cycle === "monthly" ? plan.monthlyDisplay : plan.yearlyDisplay;
  const total = (plan: PaidBillingPlan) =>
    cycle === "monthly" ? plan.monthlyTotal : plan.yearlyTotal;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Choose a plan</h2>
              <p className="text-sm text-neutral-500 mt-0.5">Select a billing cycle, then pick your plan.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Billing toggle */}
          <div className="px-8 pt-6 pb-2 flex items-center gap-4">
            <div className="relative flex items-center p-1 bg-neutral-100 rounded-full text-sm font-bold gap-1">
              {(["monthly", "yearly"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  className={`relative px-5 py-2 rounded-full capitalize transition-all duration-200 ${
                    cycle === c ? "bg-white shadow text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {cycle === "yearly" && (
                <motion.span
                  key="badge"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="text-xs font-black bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider"
                >
                  Save ₹1,200/yr
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Plan cards */}
          <div className="px-8 pb-8 pt-4 grid md:grid-cols-2 gap-4">
            {PAID_PLANS.map((plan) => {
              const isActive = currentPlanKey === plan.key;
              const isProcessing = processingKey === `${plan.key}-${cycle}`;

              return (
                <div
                  key={plan.key}
                  className={`relative rounded-2xl border-2 p-6 flex flex-col transition-all duration-200 ${
                    plan.highlighted
                      ? "border-indigo-500 bg-indigo-50/40"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  {plan.ribbon && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow">
                      {plan.ribbon}
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-neutral-900">{plan.name}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{plan.description}</p>
                  </div>

                  {/* Pricing breakdown */}
                  <div className="bg-white rounded-xl p-4 border border-neutral-100 mb-5 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${plan.key}-price-${cycle}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="text-3xl font-extrabold text-neutral-900"
                        >
                          {price(plan)}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-sm text-neutral-400 font-medium">/ month</span>
                    </div>
                    <div className="text-xs text-neutral-500 font-medium">
                      Billed as{" "}
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${plan.key}-total-${cycle}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="font-bold text-neutral-700"
                        >
                          {total(plan)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    {cycle === "yearly" && plan.savingLabel && (
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {plan.savingLabel} vs monthly
                      </p>
                    )}
                    {cycle === "monthly" && (
                      <p className="text-xs text-neutral-400 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Switch to yearly to save {plan.savingLabel}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-neutral-600">
                        <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isActive ? (
                    <div className="w-full py-2.5 text-center bg-neutral-100 text-neutral-500 font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Current plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelect(plan)}
                      disabled={!!processingKey}
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        plan.highlighted
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/30"
                          : "bg-neutral-900 hover:bg-neutral-800 text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>Select {plan.name} <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Security note */}
          <div className="px-8 pb-6 flex items-center gap-2 text-xs text-neutral-400">
            <Shield className="w-3.5 h-3.5" />
            Payments are processed securely via Razorpay. Your card details are never stored on our servers.
          </div>
        </motion.div>
      </motion.div>

      {/* Confirmation modal */}
      {confirming && (
        <motion.div
          key="confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Confirm subscription</h3>
                <p className="text-sm text-neutral-500">{confirming.name} — {cycle}</p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 mb-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Plan</span>
                <span className="font-bold text-neutral-900">{confirming.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Billing cycle</span>
                <span className="font-bold text-neutral-900 capitalize">{cycle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Monthly rate</span>
                <span className="font-bold text-neutral-900">
                  {cycle === "monthly" ? confirming.monthlyDisplay : confirming.yearlyDisplay} / month
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between">
                <span className="text-sm font-semibold text-neutral-700">
                  {cycle === "yearly" ? "Billed yearly" : "Billed monthly"}
                </span>
                <span className="font-extrabold text-neutral-900">
                  {cycle === "monthly" ? confirming.monthlyTotal : confirming.yearlyTotal}
                </span>
              </div>
              {cycle === "yearly" && confirming.savingLabel && (
                <p className="text-xs text-emerald-600 font-bold text-right">{confirming.savingLabel}</p>
              )}
            </div>

            <p className="text-xs text-neutral-400 mb-5 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              You will be redirected to Razorpay's secure checkout. Your subscription will activate immediately after successful payment.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25"
              >
                Proceed to payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Cancel Confirmation Dialog ───────────────────────────────────────────────

function CancelDialog({
  open, onClose, onConfirm, loading,
}: { open: boolean; onClose: () => void; onConfirm: () => void; loading: boolean }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">Cancel subscription?</h3>
          <p className="text-sm text-neutral-500 mb-6">
            Your plan will remain active until the end of the current billing period. After that, you'll be downgraded to the Free plan.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Keep plan
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel anyway"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main BillingClient ───────────────────────────────────────────────────────

export function BillingClient() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [processingKey, setProcessingKey] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/billing/subscription");
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError("Failed to load billing details. Please try again.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to load billing details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleUpgrade = async (planKey: string, billingCycle: "monthly" | "yearly") => {
    const key = `${planKey}-${billingCycle}`;
    setProcessingKey(key);
    setShowPlanSelector(false);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey, billingCycle }),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.message || "Checkout failed");

      const plan = BILLING_PLANS.find(p => p.key === planKey);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: json.data.subscriptionId,
        name: "PlannerHQ",
        description: `${plan?.name} plan — ${billingCycle}`,
        image: "/logo.png",
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/billing/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyJson = await verifyRes.json();
          if (verifyJson.success) {
            toast.success("🎉 Subscription activated! Your plan will update shortly.");
            loadData();
          } else {
            toast.error("Payment verification failed. Contact support if your payment was deducted.");
          }
          setProcessingKey(null);
        },
        modal: {
          ondismiss: () => setProcessingKey(null),
        },
        theme: { color: "#4f46e5" },
        prefill: {},
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        toast.error(response?.error?.description || "Payment failed. Please try again.");
        setProcessingKey(null);
      });
      rzp.open();
    } catch (e: any) {
      toast.error(e.message || "Failed to start checkout. Please try again.");
      setProcessingKey(null);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        toast.success("Subscription cancelled. Access continues until period end.");
        setShowCancelDialog(false);
        loadData();
      } else {
        toast.error(json.message || "Failed to cancel subscription.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-neutral-200 bg-white p-16 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <div>
          <p className="font-bold text-neutral-900">Failed to load billing data</p>
          <p className="text-sm text-neutral-500 mt-1">{error}</p>
        </div>
        <button
          onClick={() => { setLoading(true); loadData(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { subscription, plan, usage, dbPlan } = data;
  const isPaid = dbPlan && dbPlan.key !== "free";
  const endDate = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const isCancelling = subscription?.cancel_at_period_end;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <PlanSelectorModal
        open={showPlanSelector}
        onClose={() => setShowPlanSelector(false)}
        onSelect={handleUpgrade}
        currentPlanKey={dbPlan?.key ?? null}
        processingKey={processingKey}
      />

      <CancelDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        loading={cancelLoading}
      />

      <div className="grid gap-6">
        {/* ── Current Plan Card ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm"
        >
          {/* Decorative top stripe */}
          <div className={`h-1 w-full ${isPaid ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" : "bg-neutral-200"}`} />

          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPaid ? "bg-indigo-100" : "bg-neutral-100"}`}>
                  {isPaid ? <Zap className="w-6 h-6 text-indigo-600" /> : <Sparkles className="w-6 h-6 text-neutral-500" />}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">Current Plan</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-extrabold text-neutral-900">{dbPlan?.name || "Free Starter"}</h2>
                    {isPaid && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isCancelling
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCancelling ? "bg-amber-500" : "bg-emerald-500"}`} />
                        {isCancelling ? "Cancels at period end" : "Active"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!isPaid ? (
                <button
                  onClick={() => setShowPlanSelector(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/30 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" /> Upgrade plan
                </button>
              ) : !isCancelling ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPlanSelector(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Change plan
                  </button>
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>

            {isPaid && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    <Calendar className="w-3 h-3" />
                    Billing cycle
                  </div>
                  <p className="text-sm font-bold text-neutral-900 capitalize">{subscription?.billing_cycle || "Monthly"}</p>
                </div>
                {endDate && (
                  <div className={`border rounded-2xl p-4 ${isCancelling ? "bg-amber-50 border-amber-100" : "bg-neutral-50 border-neutral-100"}`}>
                    <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1 ${isCancelling ? "text-amber-500" : "text-neutral-400"}`}>
                      <Clock className="w-3 h-3" />
                      {isCancelling ? "Ends on" : "Renews on"}
                    </div>
                    <p className={`text-sm font-bold ${isCancelling ? "text-amber-800" : "text-neutral-900"}`}>
                      {format(endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                )}
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    <Shield className="w-3 h-3" />
                    Status
                  </div>
                  <p className="text-sm font-bold text-neutral-900 capitalize">{subscription?.status || "Active"}</p>
                </div>
              </div>
            )}

            {isCancelling && endDate && (
              <div className="mt-4 flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p>
                  Your subscription is scheduled to cancel on <strong>{format(endDate, "MMMM d, yyyy")}</strong>.
                  After that, you'll be moved to the Free plan. You won't be charged again.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Usage Overview ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5 text-neutral-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Usage overview</h2>
              <p className="text-xs text-neutral-400">Based on your current {dbPlan?.name || "Free"} plan limits</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            <UsageMeter
              label="Workspaces"
              used={usage?.workspaces_count ?? 0}
              limit={plan?.maxWorkspaces ?? 3}
              formatFn={String}
            />
            <UsageMeter
              label="Collaborators"
              used={usage?.collaborators_count ?? 0}
              limit={plan?.maxCollaborators ?? 2}
              formatFn={String}
            />
            <UsageMeter
              label="Storage"
              used={usage?.storage_used_bytes ?? 0}
              limit={plan?.maxStorageBytes ?? 104857600}
              formatFn={formatBytes}
            />
            <UsageMeter
              label="AI tokens used"
              used={usage?.ai_tokens_used ?? 0}
              limit={plan?.maxAiTokens ?? 200000}
              formatFn={formatTokens}
            />
          </div>

          {!isPaid && (
            <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-neutral-600 font-medium">
                Need more? Upgrade to unlock higher limits.
              </p>
              <button
                onClick={() => setShowPlanSelector(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold transition-colors"
              >
                See plans <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Payment Security Note ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-start gap-3 p-5 bg-neutral-50 border border-neutral-200 rounded-2xl"
        >
          <Shield className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
          <div className="text-sm text-neutral-500 space-y-0.5">
            <p className="font-semibold text-neutral-700">How your payment works</p>
            <p>All transactions are processed by <strong className="text-neutral-800">Razorpay</strong>, a PCI-DSS Level 1 certified payment gateway. PlannerHQ never stores your card details. Your subscription renews automatically until cancelled.</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
