"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Printer, Home } from "lucide-react";
import { format } from "date-fns";

const AUTO_REDIRECT_SECONDS = 12;

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = searchParams.get("plan") ?? "Plan";
  const cycle = searchParams.get("cycle") ?? "yearly";
  const paymentId = searchParams.get("paymentId") ?? "—";
  const amount = searchParams.get("amount") ?? "—";

  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/billing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const pct = ((AUTO_REDIRECT_SECONDS - countdown) / AUTO_REDIRECT_SECONDS) * 100;

  return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center px-5 py-12">
      <div className="max-w-lg w-full">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
          className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-foreground mb-2">
              Subscription Activated!
            </h1>
            <p className="text-muted-foreground text-base">
              Welcome to <strong className="text-foreground">{plan}</strong>. Your account has been upgraded.
            </p>
          </div>

          {/* Receipt card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-6">
            {/* Green top stripe */}
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />

            <div className="p-6 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Receipt</p>

              <div className="space-y-3">
                {[
                  { label: "Plan", value: plan },
                  { label: "Billing cycle", value: <span className="capitalize">{cycle}</span> },
                  { label: "Amount paid", value: <span className="text-foreground font-extrabold">{amount}</span> },
                  { label: "Date", value: format(new Date(), "MMMM d, yyyy") },
                  {
                    label: "Payment ID",
                    value: <span className="font-mono text-[11px] text-muted-foreground">{paymentId}</span>,
                  },
                  { label: "Status", value: <span className="text-emerald-600 font-bold">Paid ✓</span> },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-muted transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button
              onClick={() => router.push("/billing")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card text-sm font-bold text-foreground hover:bg-muted transition-colors"
            >
              <Home className="w-4 h-4" /> View Billing
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/25 transition-all active:scale-95"
            >
              Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Auto-redirect countdown */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Redirecting to billing in <strong className="text-muted-foreground">{countdown}s</strong>
            </p>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "linear" }}
                className="h-full bg-indigo-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm">Loading receipt details...</p>
          </div>
        </div>
      }
    >
      <BillingSuccessContent />
    </Suspense>
  );
}
