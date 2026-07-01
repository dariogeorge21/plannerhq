"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillingOverviewResponse } from "@/server/billing/types";
import { formatDate, formatPaiseToRupees } from "./utils";
import {
  Zap,
  Clock,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";
import { motion } from "framer-motion";

interface BillingOverviewProps {
  data: BillingOverviewResponse;
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
    case "trialing":
      return "default";
    case "past_due":
      return "secondary";
    case "cancelled":
    case "expired":
      return "destructive";
    default:
      return "default";
  }
}

function StatusBadge({ status, isCancelling }: { status: string; isCancelling?: boolean }) {
  const variant = isCancelling ? "secondary" : getStatusColor(status);
  
  const labels: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    past_due: "Past Due",
    cancelled: "Cancelled",
    expired: "Expired",
  };

  const icons: Record<string, React.ReactNode> = {
    active: <CheckCircle className="w-3 h-3" />,
    trialing: <Zap className="w-3 h-3" />,
    past_due: <AlertTriangle className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
    expired: <Clock3 className="w-3 h-3" />,
  };

  return (
    <Badge variant={variant} className="gap-1.5 px-2.5 py-1">
      {icons[status] || <Clock3 className="w-3 h-3" />}
      {isCancelling ? "Cancelling" : labels[status]}
    </Badge>
  );
}

export function BillingOverview({ data }: BillingOverviewProps) {
  const { currentPlan, subscription, lastPaymentDate, lastPaymentAmount, status } = data;
  const isCancelling = subscription?.cancel_at_period_end;
  const isPaid = currentPlan.key !== "free";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden border bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5">
        <div className="absolute inset-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />
        
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
                  {isPaid ? (
                    <Zap className="h-6 w-6 text-white" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Current Plan
                    </p>
                    <StatusBadge status={status} isCancelling={isCancelling} />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {currentPlan.name}
                  </h2>
                </div>
              </div>
              {currentPlan.description && (
                <p className="text-muted-foreground max-w-2xl">
                  {currentPlan.description}
                </p>
              )}
            </div>
          </div>

          {isPaid && subscription && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatItem
                icon={<Calendar className="h-4 w-4" />}
                label="Billing Cycle"
                value={
                  <span className="capitalize">
                    {subscription.billing_cycle}
                  </span>
                }
              />
              <StatItem
                icon={<Clock className="h-4 w-4" />}
                label={isCancelling ? "Expires" : "Renews"}
                value={data.nextBillingDate ? formatDate(data.nextBillingDate) : "—"}
                accent={isCancelling}
              />
              <StatItem
                icon={<CreditCard className="h-4 w-4" />}
                label="Last Payment"
                value={lastPaymentDate ? formatDate(lastPaymentDate) : "—"}
              />
              <StatItem
                icon={<Zap className="h-4 w-4" />}
                label="Current Price"
                value={lastPaymentAmount ? formatPaiseToRupees(lastPaymentAmount) : "—"}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {isCancelling && data.nextBillingDate && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
              Your subscription will be cancelled on{" "}
              <strong>{formatDate(data.nextBillingDate)}</strong>
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              You&apos;ll continue to have access to your plan features until then.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StatItem({
  icon, label, value, accent = false }: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        accent
          ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
          : "bg-muted/50"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1.5",
          accent ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
        )}
      >
        {icon}
        {label}
      </div>
      <p
        className={cn(
          "text-sm font-semibold",
          accent ? "text-amber-800 dark:text-amber-200" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}
