"use client";

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Check, ArrowLeft, ArrowRight, Shield, Zap, Info,
  CheckCircle2, XCircle, RefreshCw, CreditCard, TrendingUp,
  Lock, AlertTriangle,
} from "lucide-react";
import { BILLING_PLANS } from "@/data/data";

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

// ─── Helpers ────────────────────────────────────────────────────────────────

function planPrice(planKey: PlanKey, cycle: BillingCycle): string {
  const plan = BILLING_PLANS.find((p) => p.key === planKey);
  if (!plan) return "";
  return cycle === "monthly" ? plan.monthlyDisplay : plan.yearlyDisplay;
}

function planTotal(planKey: PlanKey, cycle: BillingCycle): string {
  const plan = BILLING_PLANS.find((p) => p.key === planKey);
  if (!plan) return "";
  return cycle === "monthly" ? plan.monthlyTotal : plan.yearlyTotal;
}

function planSaving(planKey: PlanKey): string | null {
  const plan = BILLING_PLANS.find((p) => p.key === planKey);
  return plan?.savingLabel ?? null;
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
      className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="text-center max-w-xs px-6">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h3 className="text-xl font-extrabold text-neutral-900 mb-2">Activating your subscription…</h3>
        <p className="text-sm text-neutral-500">
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
      className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">You're all set! 🎉</h2>
          <p className="text-neutral-500 mb-8 text-base">
            Your <strong className="text-neutral-800">{data.planName}</strong> subscription is now active.
          </p>

          {/* Summary card */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-left mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Plan</span>
              <span className="font-bold text-neutral-900">{data.planName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Billing</span>
              <span className="font-bold text-neutral-900 capitalize">{data.cycle}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-neutral-200 pt-3">
              <span className="font-semibold text-neutral-700">Total paid</span>
              <span className="font-extrabold text-neutral-900">{data.amountDisplay}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Payment ID</span>
              <span className="font-mono text-neutral-500 text-[11px]">{data.paymentId}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onViewReceipt}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
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
      className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="max-w-sm w-full text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5"
        >
          <XCircle className="w-10 h-10 text-red-500" />
        </motion.div>
        <h3 className="text-xl font-extrabold text-neutral-900 mb-2">Payment failed</h3>
        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <button
            onClick={onBack}
            className="py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Back to billing
          </button>
          <a
            href="mailto:support@plannerhq.com"
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
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
  defaultCycle,
  razorpayKeyId,
}: {
  planKey: PlanKey;
  defaultCycle: BillingCycle;
  razorpayKeyId?: string;
}) {
  const router = useRouter();
  const [cycle, setCycle] = useState<BillingCycle>(defaultCycle);
  const [step, setStep] = useState<PaymentStep>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stub Razorpay lumberjack telemetry requests to prevent CORS errors in browser console
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    type OpenSignature = (
      this: XMLHttpRequest,
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) => void;

    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest & { isLumberjack?: boolean },
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      if (typeof url === "string" && url.includes("lumberjack.razorpay.com")) {
        this.isLumberjack = true;
      }
      return (originalOpen as OpenSignature).call(this, method, url, async, username, password);
    } as typeof originalOpen;

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (
      this: XMLHttpRequest & { isLumberjack?: boolean },
      body?: Document | XMLHttpRequestBodyInit | null
    ) {
      if (this.isLumberjack) {
        Object.defineProperty(this, "readyState", { writable: true, value: 4 });
        Object.defineProperty(this, "status", { writable: true, value: 200 });
        Object.defineProperty(this, "responseText", { writable: true, value: '{"success":true}' });
        if (this.onreadystatechange) {
          this.onreadystatechange(new Event("readystatechange"));
        }
        if (this.onload) {
          this.onload(new ProgressEvent("load"));
        }
        return;
      }
      return originalSend.call(this, body);
    } as typeof originalSend;

    // 2. Intercept window.fetch
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input?.url;
      if (url && url.includes("lumberjack.razorpay.com")) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return originalFetch.call(this, input, init);
    };

    // 3. Intercept navigator.sendBeacon
    if (navigator && navigator.sendBeacon) {
      const originalSendBeacon = navigator.sendBeacon;
      navigator.sendBeacon = function (url, data) {
        if (typeof url === "string" && url.includes("lumberjack.razorpay.com")) {
          return true;
        }
        return originalSendBeacon.call(this, url, data);
      };
    }
  }, []);

  const plan = BILLING_PLANS.find((p) => p.key === planKey)!;
  const monthlyRate = cycle === "monthly" ? plan.monthlyDisplay : plan.yearlyDisplay;
  const billedAs = cycle === "monthly" ? plan.monthlyTotal : plan.yearlyTotal;
  const saving = cycle === "yearly" ? planSaving(planKey) : null;

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
      // 1. Create Razorpay subscription on the server
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey, billingCycle: cycle }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to initiate checkout.");

      const { subscriptionId } = json.data;
      setStep("gateway_open");

      // 2. Open Razorpay gateway
      const rzpOptions = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        name: "PlannerHQ",
        description: `${plan.name} — ${cycle}`,
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
              throw new Error("Signature verification failed.");
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Verification failed";
            setErrorMessage(message);
            setStep("error");
            return;
          }

          // 4. Poll for webhook-confirmed activation
          const activated = await pollForActivation(planKey);

          if (activated) {
            setSuccessData({
              paymentId: response.razorpay_payment_id,
              subscriptionId: response.razorpay_subscription_id,
              planName: plan.name,
              cycle,
              amountDisplay: billedAs,
            });
            setStep("success");
          } else {
            // Webhook may be delayed — still show success as payment was verified
            setSuccessData({
              paymentId: response.razorpay_payment_id,
              subscriptionId: response.razorpay_subscription_id,
              planName: plan.name,
              cycle,
              amountDisplay: billedAs,
            });
            setStep("success");
          }
        },

        modal: {
          ondismiss: () => {
            if (step === "gateway_open") {
              setStep("idle");
            }
          },
        },
      };

      const rzp = new (window as unknown as {
        Razorpay: new (opts: unknown) => {
          open: () => void;
          on: (event: string, cb: (r: RazorpayErrorResponse) => void) => void;
        };
      }).Razorpay(rzpOptions);

      rzp.on("payment.failed", (response: RazorpayErrorResponse) => {
        setErrorMessage(
          response?.error?.description || "Payment failed. Please try again or use a different payment method."
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

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
          className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />
          <div className="px-7 py-6 border-b border-neutral-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">You're upgrading to</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-900">{plan.name}</h2>
              {plan.ribbon && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow">
                  {plan.ribbon}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mt-2">{plan.description}</p>
          </div>

          {/* Billing cycle toggle */}
          <div className="px-7 py-5 border-b border-neutral-100">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-3">Billing cycle</p>
            <div className="flex gap-3">
              {(["monthly", "yearly"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold capitalize transition-all ${cycle === c
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                >
                  {c}
                  {c === "yearly" && plan.savingLabel && (
                    <span className="ml-1.5 text-[10px] font-black text-emerald-600">
                      ({plan.savingLabel})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="px-7 py-5 border-b border-neutral-100">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-4">Pricing breakdown</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">{plan.name} plan</span>
                <div className="text-right">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${planKey}-${cycle}-price`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="text-lg font-extrabold text-neutral-900"
                    >
                      {monthlyRate}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs text-neutral-400 ml-1">/ mo</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">Billed {cycle}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${planKey}-${cycle}-total`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-bold text-neutral-700"
                  >
                    {billedAs}
                  </motion.span>
                </AnimatePresence>
              </div>
              {saving && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-emerald-700">{saving} vs monthly billing</span>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="px-7 py-5">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-4">What's included</p>
            <ul className="space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-600">
                  <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
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
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-extrabold text-neutral-900 mb-5">Order summary</h3>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">{plan.name} — {cycle}</span>
                <span className="font-bold text-neutral-800">{monthlyRate}/mo</span>
              </div>
              {cycle === "yearly" && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Billed now (yearly)</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={cycle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-bold text-neutral-800"
                    >
                      {billedAs}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
              <div className="border-t border-neutral-100 pt-3 flex justify-between">
                <span className="font-semibold text-neutral-700 text-sm">Total today</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`total-${cycle}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="font-extrabold text-neutral-900 text-lg"
                  >
                    {billedAs}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Legal note */}
            <p className="text-[11px] text-neutral-400 leading-relaxed mb-5 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              By clicking "Pay now" you agree to our Terms. Your subscription auto-renews until cancelled.
              You'll be redirected to Razorpay's secure payment page.
            </p>

            {/* Pay button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
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
              className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to billing
            </button>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2.5 p-4 bg-white border border-neutral-200 rounded-2xl">
            <Shield className="w-5 h-5 text-neutral-400 shrink-0" />
            <div className="text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700">Secured by Razorpay</span>
              <br />
              PCI-DSS certified. We never store your card details.
            </div>
          </div>

          {/* Refund note */}
          <div className="flex items-start gap-2.5 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <AlertTriangle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700">
              <span className="font-bold">Cancel anytime.</span> You won't be charged again after cancellation,
              and access continues until the end of your billing period.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
