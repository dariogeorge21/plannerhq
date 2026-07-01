"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Check, ArrowLeft, ArrowRight, Shield, Zap, Info,
  CheckCircle2, XCircle, RefreshCw, CreditCard, TrendingUp,
  Lock, AlertTriangle,
} from "lucide-react";
import { DbPlanRecord } from "@/types/billing";

// ─── Types ──────────────────────────────────────────────────────────────────

type PlanKey = "pro" | "ultra";
type BillingCycle = "monthly" | "yearly";

type PaymentStep =
  | "idle"
  | "creating"
  | "gateway_open"
  | "confirming"
  | "success"
  | "error";

interface SuccessData {
  paymentId: string;
  subscriptionId: string;
  planName: string;
  cycle: BillingCycle;
  amountDisplay: string;
}

interface RazorpayErrorResponse {
  error?: {
    description?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (r: RazorpayErrorResponse) => void) => void;
  close?: () => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function paise(amount: number): string {
  return `₹${(amount / 100).toLocaleString("en-IN")}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Overlay components ─────────────────────────────────────────────────────

function ConfirmingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-card/90 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="text-center max-w-xs px-6">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 dark:text-indigo-300" />
          </div>
        </div>
        <h3 className="text-xl font-extrabold text-foreground mb-2">Activating your subscription…</h3>
        <p className="text-sm text-muted-foreground">
          Payment received. We're confirming with our servers. This takes a moment.
        </p>
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-indigo-500"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SuccessOverlay({
  data,
  onViewReceipt,
  onDashboard,
}: {
  data: SuccessData;
  onViewReceipt: () => void;
  onDashboard: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-card flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="w-24 h-24 rounded-full dark:bg-emerald-950 flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CheckCircle2 className="w-12 h-12 dark:text-emerald-400" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-extrabold text-foreground mb-2">You're all set! </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Your <strong className="text-foreground">{data.planName}</strong> subscription is now active.
          </p>

          {/* Summary card */}
          <div className="bg-muted border border-border rounded-2xl p-6 text-left mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-bold text-foreground">{data.planName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Billing</span>
              <span className="font-bold text-foreground capitalize">{data.cycle}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-3">
              <span className="font-semibold text-foreground">Total paid</span>
              <span className="font-extrabold text-foreground">{data.amountDisplay}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Payment ID</span>
              <span className="font-mono text-muted-foreground text-[11px]">{data.paymentId}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onViewReceipt}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors"
            >
              View Receipt
            </button>
            <button
              onClick={onDashboard}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/25 transition-all active:scale-95"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ErrorOverlay({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-card/90 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="max-w-sm w-full text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 rounded-full dark:bg-red-950 flex items-center justify-center mx-auto mb-5"
        >
          <XCircle className="w-10 h-10 dark:text-red-400" />
        </motion.div>
        <h3 className="text-xl font-extrabold text-foreground mb-2">Payment failed</h3>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground hover:bg-foreground/90 text-background text-sm font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <button
            onClick={onBack}
            className="py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Back to billing
          </button>
          <a
            href="mailto:support@plannerhq.com"
            className="text-xs text-muted-foreground hover:text-muted-foreground transition-colors"
          >
            Contact support if payment was deducted
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main CheckoutClient ─────────────────────────────────────────────────────

export function CheckoutClient({
  planKey,
  dbPlan,
  defaultCycle,
  razorpayKeyId,
}: {
  planKey: PlanKey;
  dbPlan: DbPlanRecord;
  defaultCycle: BillingCycle;
  razorpayKeyId?: string;
}) {
  const router = useRouter();
  const [cycle, setCycle] = useState<BillingCycle>(defaultCycle);
  const [step, setStep] = useState<PaymentStep>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rzpRef = useRef<RazorpayInstance | null>(null);
  // stepRef tracks the latest step value so stale closures (e.g. ondismiss) can read it.
  const stepRef = useRef<PaymentStep>("idle");

  // Keep stepRef in sync with step state.
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const monthlyRate = cycle === "monthly" ? paise(dbPlan.monthly_price_paise) : paise(dbPlan.yearly_price_paise / 12);
  const billedAs = cycle === "monthly" ? paise(dbPlan.monthly_price_paise) : paise(dbPlan.yearly_price_paise);
  const saving = cycle === "yearly" ? "Save 25%" : null;

  // Cleanup poll on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  async function pollForActivation(planKey: PlanKey, maxRetries = 12, intervalMs = 2500) {
    for (let i = 0; i < maxRetries; i++) {
      await sleep(intervalMs);
      try {
        const res = await fetch("/api/billing/subscription");
        const json = await res.json();
        if (json.success && json.data?.dbPlan?.key === planKey) {
          return true;
        }
      } catch {
        // Continue polling
      }
    }
    return false;
  }

  async function handlePayNow() {
    setStep("creating");
    setErrorMessage("");

    if (!razorpayKeyId) {
      setErrorMessage("Razorpay configuration is missing. Please contact support.");
      setStep("error");
      return;
    }

    try {
      // Guard: don't open a second Razorpay window if one is already open.
      if (rzpRef.current) {
        rzpRef.current.open();
        setStep("gateway_open");
        return;
      }

      // 1. Create Razorpay subscription on the server
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey, billingCycle: cycle }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        // Surface meaningful error messages to the developer/user.
        if (res.status === 409) {
          // User already has an active subscription.
          setErrorMessage(json.message || "You already have an active subscription.");
        } else if (res.status === 500) {
          setErrorMessage(
            json.message ||
            "A server error occurred while creating your subscription. Please try again or contact support."
          );
        } else {
          setErrorMessage(json.message || "Failed to initiate checkout.");
        }
        setStep("error");
        return;
      }

      const { subscriptionId } = json.data;

      if (!subscriptionId) {
        setErrorMessage("Server returned an invalid subscription ID. Please contact support.");
        setStep("error");
        return;
      }

      setStep("gateway_open");

      // 2. Open Razorpay gateway
      const rzpOptions = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        name: "PlannerHQ",
        description: `${dbPlan.name} — ${cycle}`,
        image: "/logo.png",
        prefill: {},
        theme: { color: "#4f46e5" },

        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          setStep("confirming");

          // 3. Verify signature on server
          try {
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
            if (!verifyJson.success) {
              throw new Error(verifyJson.message || "Signature verification failed.");
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Verification failed";
            setErrorMessage(message);
            setStep("error");
            return;
          }

          rzpRef.current = null;

          // 4. Show success — webhook will confirm final activation
          setSuccessData({
            paymentId: response.razorpay_payment_id,
            subscriptionId: response.razorpay_subscription_id,
            planName: dbPlan.name,
            cycle,
            amountDisplay: billedAs,
          });
          setStep("success");
        },

        modal: {
          ondismiss: () => {
            rzpRef.current = null;
            // Use stepRef (not step) to avoid stale closure — the state value
            // captured at function creation time would always be 'idle'.
            if (stepRef.current === "gateway_open") {
              setStep("idle");
            }
          },
        },
      };

      const rzp = new (window as unknown as {
        Razorpay: new (opts: unknown) => RazorpayInstance;
      }).Razorpay(rzpOptions);

      rzpRef.current = rzp;

      rzp.on("payment.failed", (response: RazorpayErrorResponse) => {
        rzpRef.current = null;
        setErrorMessage(
          response?.error?.description ||
          "Payment failed. Please try again or use a different payment method."
        );
        setStep("error");
      });

      rzp.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to start checkout.";
      setErrorMessage(message);
      setStep("error");
    }
  }

  function handleViewReceipt() {
    if (!successData) return;
    const params = new URLSearchParams({
      plan: successData.planName,
      cycle: successData.cycle,
      paymentId: successData.paymentId,
      amount: successData.amountDisplay,
    });
    router.push(`/billing/success?${params.toString()}`);
  }

  function handleGoToDashboard() {
    router.push("/dashboard");
  }

  const isProcessing = step === "creating" || step === "gateway_open" || step === "confirming";

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />

      {/* Overlays */}
      <AnimatePresence>
        {step === "confirming" && <ConfirmingOverlay key="confirming" />}
        {step === "success" && successData && (
          <SuccessOverlay
            key="success"
            data={successData}
            onViewReceipt={handleViewReceipt}
            onDashboard={handleGoToDashboard}
          />
        )}
        {step === "error" && (
          <ErrorOverlay
            key="error"
            message={errorMessage}
            onRetry={() => setStep("idle")}
            onBack={() => router.push("/billing")}
          />
        )}
      </AnimatePresence>

      {/* Main checkout layout */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ── Left: Order Summary ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />
          <div className="px-7 py-6 border-b border-border">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">You're upgrading to</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl dark:bg-indigo-950 flex items-center justify-center">
                <Zap className="w-5 h-5 dark:text-indigo-300" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">{dbPlan.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{dbPlan.description}</p>
          </div>

          {/* Billing cycle toggle */}
          <div className="px-7 py-5 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Billing cycle</p>
            <div className="flex gap-3">
              {(["monthly", "yearly"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold capitalize transition-all ${cycle === c
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-border text-muted-foreground hover:border-border hover:bg-muted"
                    }`}
                >
                  {c}
                  {c === "yearly" && saving && (
                    <span className="ml-1.5 text-[10px] font-black dark:text-emerald-400">
                      ({saving})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="px-7 py-5 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">Pricing breakdown</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{dbPlan.name} plan</span>
                <div className="text-right">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${planKey}-${cycle}-price`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="text-lg font-extrabold text-foreground"
                    >
                      {monthlyRate}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs text-muted-foreground ml-1">/ mo</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Billed {cycle}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${planKey}-${cycle}-total`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-bold text-foreground"
                  >
                    {billedAs}
                  </motion.span>
                </AnimatePresence>
              </div>
              {saving && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg dark:bg-emerald-950 border border-emerald-100">
                  <TrendingUp className="w-3.5 h-3.5 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold dark:text-emerald-300">{saving} vs monthly billing</span>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="px-7 py-5">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">What's included</p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                {dbPlan.max_workspaces} Workspaces
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                {dbPlan.max_storage_bytes / (1024 * 1024 * 1024)} GB Storage
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                {dbPlan.max_ai_tokens >= 1000000 ? `${dbPlan.max_ai_tokens / 1000000}M` : `${dbPlan.max_ai_tokens / 1000}K`} AI tokens/day
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                {dbPlan.max_collaborators} collaborators per workspace
              </li>
            </ul>
          </div>
        </motion.div>

        {/* ── Right: Payment Panel ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.07 }}
          className="space-y-4"
        >
          {/* Pay card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-extrabold text-foreground mb-5">Order summary</h3>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{dbPlan.name} — {cycle}</span>
                <span className="font-bold text-foreground">{monthlyRate}/mo</span>
              </div>
              {cycle === "yearly" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Billed now (yearly)</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={cycle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-bold text-foreground"
                    >
                      {billedAs}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground text-sm">Total today</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`total-${cycle}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="font-extrabold text-foreground text-lg"
                  >
                    {billedAs}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Legal note */}
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-5 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              By clicking "Pay now" you agree to our Terms. Your subscription auto-renews until cancelled.
              You'll be redirected to Razorpay's secure payment page.
            </p>

            {/* Pay button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing || !sdkReady}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
            >
              {step === "creating" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating subscription…</>
              ) : step === "gateway_open" ? (
                <><CreditCard className="w-4 h-4" /> Complete payment in Razorpay</>
              ) : (
                <><Lock className="w-4 h-4" /> Pay now — {billedAs}</>
              )}
            </button>

            {/* Back link */}
            <button
              onClick={() => router.push("/billing")}
              className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to billing
            </button>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2.5 p-4 bg-card border border-border rounded-2xl">
            <Shield className="w-5 h-5 text-muted-foreground shrink-0" />
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Secured by Razorpay</span>
              <br />
              PCI-DSS certified. We never store your card details.
            </div>
          </div>

          {/* Refund note */}
          <div className="flex items-start gap-2.5 p-4 dark:bg-emerald-950 border border-emerald-100 rounded-2xl">
            <AlertTriangle className="w-4 h-4 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs dark:text-emerald-300">
              <span className="font-bold">Cancel anytime.</span> You won't be charged again after cancellation,
              and access continues until the end of your billing period.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
