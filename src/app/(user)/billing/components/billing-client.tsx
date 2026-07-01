"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BillingOverview } from "./BillingOverview";
import { PlansSection } from "./PlansSection";
import { PaymentHistory } from "./PaymentHistory";
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog";
import { UpgradeDialog } from "./UpgradeDialog";
import { BillingLoadingSkeleton, ErrorState } from "./LoadingSkeleton";
import { DbPlanRecord, PaymentRecord, SubscriptionRecord } from "@/types/billing";
import { BillingOverviewResponse, ApiResponse } from "@/server/billing/types";
import { BillingCycle, PlanKey } from "@/types/types";
import { toast } from "sonner";
import { Zap, ArrowRight, XCircle } from "lucide-react";

interface BillingData {
  subscription: SubscriptionRecord | null;
  allPlans: DbPlanRecord[];
  payments: PaymentRecord[];
  currentPlan: DbPlanRecord | null;
}

export function BillingClient() {
  const router = useRouter();
  const [data, setData] = useState<BillingOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    plan: DbPlanRecord;
    cycle: BillingCycle;
  } | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const [overviewRes, paymentsRes] = await Promise.all([
        fetch("/api/billing/overview", { cache: "no-store" }),
        fetch("/api/billing/payments", { cache: "no-store" }),
      ]);

      if (!overviewRes.ok) {
        throw new Error(`Failed to load billing data (${overviewRes.status})`);
      }

      const overview: ApiResponse<BillingOverviewResponse> = await overviewRes.json();
      let payments: PaymentRecord[] = [];

      if (paymentsRes.ok) {
        const paymentData: ApiResponse<PaymentRecord[]> = await paymentsRes.json();
        if (paymentData.success && paymentData.data) {
          payments = paymentData.data;
        }
      }

      if (overview.success && overview.data) {
        setData({
          ...overview.data,
          paymentHistory: payments,
        });
      } else {
        throw new Error(overview.message || "Failed to load billing data");
      }
    } catch (err) {
      console.error("[Billing] Failed to load data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load billing details"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCancelSubscription = async () => {
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    await loadData();
  };

  const handleSelectPlan = async (plan: DbPlanRecord, cycle: BillingCycle) => {
    if (!data) return;

    if (plan.key === data.currentPlan.key) {
      return;
    }

    if (plan.key === "free") {
      setShowCancelDialog(true);
    } else {
      setSelectedPlan({ plan, cycle });
      setShowUpgradeDialog(true);
    }
  };

  const handleUpgradeConfirm = async () => {
    if (!selectedPlan) return;

    router.push(
      `/billing/checkout?plan=${selectedPlan.plan.key}&cycle=${selectedPlan.cycle}`
    );
  };

  if (loading) {
    return <BillingLoadingSkeleton />;
  }

  if (error || !data) {
    return <ErrorState error={error || "Failed to load billing"} onRetry={loadData} />;
  }

  const isPaid = data.currentPlan.key !== "free";
  const isCancelling = data.subscription?.cancel_at_period_end;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription, view invoices, and update payment details
        </p>
      </div>

      <BillingOverview data={data} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3 space-y-6">
          <PlansSection
            plans={data.availablePlans.filter((p) => p.key !== "enterprise")}
            currentPlanKey={data.currentPlan.key}
            onSelectPlan={handleSelectPlan}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {isPaid && !isCancelling && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              )}
              {isCancelling && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => toast.info("Resume not implemented yet")}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Resume Subscription
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <PaymentHistory payments={data.paymentHistory} />

      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        data={data}
        onCancel={handleCancelSubscription}
      />

      {selectedPlan && (
        <UpgradeDialog
          open={showUpgradeDialog}
          onOpenChange={setShowUpgradeDialog}
          currentPlan={data.currentPlan}
          newPlan={selectedPlan.plan}
          billingCycle={selectedPlan.cycle}
          onConfirm={handleUpgradeConfirm}
        />
      )}
    </div>
  );
}
