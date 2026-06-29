"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, AlertTriangle, RefreshCw, Zap, Sparkles, Shield,
  Calendar, Clock, CreditCard, TrendingUp, BarChart3, ChevronRight,
  Check, Receipt, ArrowRight, CheckCircle2, XCircle, Info,
  Building2, Users, HardDrive, Bot, CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { BILLING_PLANS } from "@/data/data";
import { SubscriptionRecord, UsageRecord, PaymentRecord, BillingPlan, DbPlanRecord } from "@/types/billing";

// ─── Types ──────────────────────────────────────────────────────────────────

type BillingData = {
  subscription: SubscriptionRecord | null;
  plan: BillingPlan | null;
  usage: UsageRecord | null;
  dbPlan: DbPlanRecord | null;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function paise(amount: number): string {
  return `₹${(amount / 100).toLocaleString("en-IN")}`;
}

function usagePct(used: number, limit: number): number {
  if (!limit || limit > 999_999_999) return 0;
  return Math.min(100, (used / limit) * 100);
}

function usageBarColor(pct: number) {
  if (pct >= 90) return "dark:bg-red-950";
  if (pct >= 70) return "dark:bg-amber-950";
  return "bg-indigo-500";
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function UsageMeter({
  label, icon, used, limit, formatFn,
}: {
  label: string;
  icon: React.ReactNode;
  used: number;
  limit: number;
  formatFn: (n: number) => string;
}) {
  const isUnlimited = limit > 999_999_998;
  const pct = usagePct(used, limit);
  const barColor = usageBarColor(pct);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          {isUnlimited ? `${formatFn(used)} used` : `${formatFn(used)} / ${formatFn(limit)}`}
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isUnlimited ? "4%" : `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
      {!isUnlimited && pct >= 80 && (
        <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {pct >= 90 ? "Almost at limit — upgrade to continue" : "Approaching your limit"}
        </p>
      )}
    </div>
  );
}

function CancelDialog({
  open, onClose, onConfirm, loading,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void; loading: boolean;
}) {
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
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-card rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center"
        >
          <div className="w-14 h-14 rounded-full dark:bg-red-950 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Cancel subscription?</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Your plan will remain active until the end of the current billing period. After that, you'll be moved to Free.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
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

function LoadingSkeleton() {
  return (
    <div className="grid gap-5 animate-pulse">
      <div className="h-44 rounded-2xl bg-muted/60" />
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="h-52 rounded-2xl bg-muted/60" />
        <div className="h-52 rounded-2xl bg-muted/60" />
      </div>
      <div className="h-40 rounded-2xl bg-muted/60" />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function BillingClient() {
  const router = useRouter();
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly"); // for plan cards

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [subRes, payRes] = await Promise.all([
        fetch("/api/billing/subscription", { cache: "no-store" }),
        fetch("/api/billing/payments", { cache: "no-store" }),
      ]);
      if (!subRes.ok) throw new Error(`Server error ${subRes.status}`);
      const subJson = await subRes.json();
      if (!subJson.success) throw new Error("Failed to load billing details.");
      setData(subJson.data);

      if (payRes.ok) {
        const payJson = await payRes.json();
        if (payJson.success) setPayments(payJson.data ?? []);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load billing details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

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

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border bg-card p-16 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full dark:bg-red-950 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <div>
          <p className="font-bold text-foreground">Failed to load billing data</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
        <button
          onClick={() => { setLoading(true); loadData(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { subscription, plan, usage, dbPlan, lastPaymentDate, lastPaymentAmount } = data;
  const isPaid = dbPlan && (dbPlan.key as string) !== "free";
  const isCancelling = subscription?.cancel_at_period_end;
  const endDate = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const planKey = (dbPlan?.key as string) || "free";

  // Determine upgrade path
  const availablePlans = BILLING_PLANS.filter(p => p.key !== planKey && p.key !== "free" && p.key !== "enterprise");
  const canUpgrade = availablePlans.length > 0;

  return (
    <>
      <CancelDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        loading={cancelLoading}
      />

      <div className="grid gap-5">
        {/* ── Current Plan Hero ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className={`h-1 w-full ${isPaid
            ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600"
            : "bg-border"}`}
          />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isPaid ? "dark:bg-indigo-950" : "bg-muted"
                  }`}>
                  {isPaid
                    ? <Zap className="w-6 h-6 dark:text-indigo-300" />
                    : <Sparkles className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Current Plan</p>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-2xl font-extrabold text-foreground">{dbPlan?.name as string || "Free Starter"}</h2>
                    {isPaid && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isCancelling
                        ? "dark:bg-amber-950 dark:text-amber-300"
                        : "dark:bg-emerald-950 dark:text-emerald-300"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCancelling ? "dark:bg-amber-950" : "bg-emerald-500"}`} />
                        {isCancelling ? "Cancels at period end" : "Active"}
                      </span>
                    )}
                    {!isPaid && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                        Free
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {canUpgrade && (
                  <button
                    onClick={() => router.push(`/billing/checkout?plan=${availablePlans[0].key}&cycle=${cycle}`)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${!isPaid
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25"
                      : "border border-border text-foreground hover:bg-muted"
                      }`}
                  >
                    {!isPaid
                      ? <><Zap className="w-4 h-4" /> Upgrade to Pro</>
                      : <><ArrowRight className="w-4 h-4" /> Change plan</>}
                  </button>
                )}
                {isPaid && !isCancelling && (
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:dark:bg-red-950 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {isPaid && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  {
                    label: "Billing cycle",
                    value: <span className="capitalize">{subscription?.billing_cycle || "Monthly"}</span>,
                    icon: <Calendar className="w-3.5 h-3.5" />,
                    accent: false,
                  },
                  {
                    label: isCancelling ? "Ends on" : "Renews on",
                    value: endDate ? format(endDate, "MMM d, yyyy") : "—",
                    icon: <Clock className="w-3.5 h-3.5" />,
                    accent: !!isCancelling,
                  },
                  {
                    label: "Last payment",
                    value: lastPaymentDate ? format(new Date(lastPaymentDate), "MMM d, yyyy") : "—",
                    icon: <CreditCard className="w-3.5 h-3.5" />,
                    accent: false,
                  },
                  {
                    label: "Last amount",
                    value: lastPaymentAmount ? paise(lastPaymentAmount) : "—",
                    icon: <Receipt className="w-3.5 h-3.5" />,
                    accent: false,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl p-4 border ${item.accent
                      ? "dark:bg-amber-950 border-amber-100"
                      : "bg-muted border-border"
                      }`}
                  >
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider mb-1.5 ${item.accent ? "text-amber-500" : "text-muted-foreground"
                      }`}>
                      {item.icon}
                      {item.label}
                    </div>
                    <p className={`text-sm font-bold ${item.accent ? "dark:text-amber-300" : "text-foreground"}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {isCancelling && endDate && (
              <div className="mt-4 flex items-start gap-2.5 p-4 dark:bg-amber-950 border border-amber-200 rounded-xl text-sm dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p>
                  Your subscription cancels on <strong>{format(endDate, "MMMM d, yyyy")}</strong>.
                  After that, you'll be on the Free plan. You won't be charged again.
                </p>
              </div>
            )}

            {!isPaid && (
              <div className="mt-6 rounded-xl border border-muted bg-muted p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">Unlock the full PlannerHQ experience</p>
                  <p className="text-xs dark:text-indigo-300/80">
                    Pro from <strong>₹299/mo</strong> billed yearly — 10 workspaces, 2 GB storage, 500K AI tokens/day
                  </p>
                </div>
                <button
                  onClick={() => router.push("/billing/checkout?plan=pro&cycle=yearly")}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/25 transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4" /> View plans
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Plans & Pricing Section ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.07 }}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Plans & Pricing</h2>
              <p className="text-sm text-muted-foreground">Choose the plan that fits your needs</p>
            </div>
            <div className="flex bg-muted rounded-xl p-1">
              {(["monthly", "yearly"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${cycle === c
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                  {c === "yearly" && <span className="ml-1 text-[10px] text-emerald-600 font-black">(Save 25%)</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {BILLING_PLANS.filter(p => p.key !== "free" && p.key !== "enterprise").map((plan) => {
              const isCurrent = plan.key === planKey;
              const isUpgrade = !isCurrent && canUpgrade;
              const priceDisplay = cycle === "monthly" ? plan.monthlyDisplay : plan.yearlyDisplay;
              const totalDisplay = cycle === "monthly" ? plan.monthlyTotal : plan.yearlyTotal;
              const saving = cycle === "yearly" ? plan.savingLabel : null;

              return (
                <div
                  key={plan.key}
                  className={`relative rounded-2xl border p-6 transition-all ${isCurrent
                    ? "border-indigo-300 bg-indigo-50/50 ring-2 ring-indigo-400"
                    : "border-border hover:border-indigo-200 hover:shadow-md"
                    }`}
                >
                  {plan.ribbon && !isCurrent && (
                    <span className="absolute -top-2 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-black uppercase tracking-widest shadow">
                      {plan.ribbon}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="absolute -top-2 right-4 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow">
                      Current
                    </span>
                  )}

                  <h3 className="text-xl font-extrabold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground">{priceDisplay}</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  {cycle === "yearly" && (
                    <p className="text-xs text-emerald-600 font-bold mt-1">
                      Billed {totalDisplay} yearly · {saving}
                    </p>
                  )}

                  <ul className="mt-5 space-y-2.5 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-muted-foreground">
                        <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-bold cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1.5" /> Active
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push(`/billing/checkout?plan=${plan.key}&cycle=${cycle}`)}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/25 transition-all active:scale-95"
                      >
                        {isUpgrade ? "Upgrade" : "Switch to"} {plan.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Usage Overview ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <BarChart3 className="w-4.5 h-4.5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Usage overview</h2>
                <p className="text-xs text-muted-foreground">Based on your {dbPlan?.name as string || "Free"} plan limits</p>
              </div>
            </div>
            {!isPaid && (
              <button
                onClick={() => router.push("/billing/checkout?plan=pro&cycle=yearly")}
                className="flex items-center gap-1.5 text-xs font-bold dark:text-indigo-300 hover:text-indigo-700 transition-colors"
              >
                Upgrade <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            <UsageMeter
              label="Workspaces"
              icon={<Building2 className="w-3.5 h-3.5" />}
              used={usage?.workspaces_count ?? 0}
              limit={(plan?.maxWorkspaces as number) ?? 3}
              formatFn={String}
            />
            <UsageMeter
              label="Collaborators"
              icon={<Users className="w-3.5 h-3.5" />}
              used={usage?.collaborators_count ?? 0}
              limit={(plan?.maxCollaborators as number) ?? 2}
              formatFn={String}
            />
            <UsageMeter
              label="Storage"
              icon={<HardDrive className="w-3.5 h-3.5" />}
              used={usage?.storage_used_bytes ?? 0}
              limit={(plan?.maxStorageBytes as number) ?? 104857600}
              formatFn={formatBytes}
            />
            <UsageMeter
              label="AI tokens used"
              icon={<Bot className="w-3.5 h-3.5" />}
              used={usage?.ai_tokens_used ?? 0}
              limit={(plan?.maxAiTokens as number) ?? 200000}
              formatFn={formatTokens}
            />
          </div>
        </motion.div>

        {/* ── Payment History ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.21 }}
          className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="px-6 sm:px-8 py-5 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Receipt className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Payment history</h2>
              <p className="text-xs text-muted-foreground">Your recent transactions</p>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="p-12 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">No payment history yet</p>
              <p className="text-xs text-muted-foreground">Your transactions will appear here after your first payment.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <div className="hidden sm:grid grid-cols-4 gap-4 px-6 sm:px-8 py-3 bg-muted/60">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment ID</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Amount</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</span>
              </div>
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="grid sm:grid-cols-4 gap-2 sm:gap-4 px-6 sm:px-8 py-4 hover:bg-muted/60 transition-colors"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:hidden mb-0.5">Date</p>
                    <p className="text-sm font-semibold text-foreground">
                      {format(new Date(p.created_at), "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(p.created_at), "h:mm a")}
                    </p>
                  </div>
                  <div className="sm:flex sm:items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:hidden mb-0.5">Payment ID</p>
                    <p className="text-xs font-mono text-muted-foreground truncate max-w-[160px]">
                      {p.razorpay_payment_id}
                    </p>
                  </div>
                  <div className="sm:flex sm:items-center sm:justify-end">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:hidden mb-0.5">Amount</p>
                    <p className="text-sm font-extrabold text-foreground">{paise(p.amount_paise)}</p>
                  </div>
                  <div className="sm:flex sm:items-center sm:justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${p.status === "captured"
                      ? "dark:bg-emerald-950 dark:text-emerald-300"
                      : p.status === "failed"
                        ? "dark:bg-red-950 dark:text-red-300"
                        : "bg-muted text-muted-foreground"
                      }`}>
                      {p.status === "captured"
                        ? <CheckCircle2 className="w-3 h-3" />
                        : p.status === "failed"
                          ? <XCircle className="w-3 h-3" />
                          : <Clock className="w-3 h-3" />}
                      <span className="capitalize">{p.status === "captured" ? "Paid" : p.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Security / Trust Note ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
          className="flex items-start gap-3 p-5 bg-muted border border-border rounded-xl"
        >
          <Shield className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p className="font-semibold text-foreground">Secure payments by Razorpay</p>
            <p>
              All transactions are processed by <strong className="text-foreground">Razorpay</strong>, a PCI-DSS Level 1 certified payment
              gateway. PlannerHQ never stores your card details. Subscriptions renew automatically until cancelled.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}