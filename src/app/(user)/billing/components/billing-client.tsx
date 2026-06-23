"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { Loader2, CreditCard, Sparkles, AlertCircle, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pricingPageContent } from "@/data/data";

export function BillingClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch("/api/billing/subscription");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e) {
      toast.error("Failed to load billing details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpgrade = async (planKey: string) => {
    setProcessingPlan(planKey);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey, billingCycle: "yearly" }),
      });
      const json = await res.json();
      
      if (!json.success) {
        throw new Error(json.message || "Checkout failed");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: json.data.subscriptionId,
        name: "PlannerHQ",
        description: `Upgrade to ${planKey} plan`,
        image: "/logo.png",
        handler: async function (response: any) {
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
            toast.success("Subscription upgraded successfully!");
            loadData();
          } else {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast.error(response.error.description);
      });
      rzp.open();

    } catch (e: any) {
      toast.error(e.message || "Failed to start checkout");
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will have access until the end of your billing period.")) return;
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        toast.success("Subscription cancelled successfully");
        loadData();
      } else {
        toast.error(json.message || "Failed to cancel");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="h-[400px] border border-neutral-200 bg-white rounded-2xl flex items-center justify-center shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
      </div>
    );
  }

  if (!data) return <div>Failed to load data</div>;

  const { subscription, plan, usage, dbPlan } = data;
  const isPaid = dbPlan && dbPlan.key !== "free";
  const endDate = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="grid gap-8">
        {/* Current Plan Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <CreditCard className="w-32 h-32 text-indigo-600" />
          </div>
          <h2 className="text-sm font-bold tracking-widest text-neutral-400 uppercase mb-2">Current Plan</h2>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-extrabold tracking-tight text-neutral-900">{dbPlan?.name || "Free Starter"}</span>
            {isPaid && (
              <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${subscription.cancel_at_period_end ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {subscription.cancel_at_period_end ? 'Cancels at Period End' : 'Active'}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex-1">
              <div className="text-xs text-neutral-500 mb-1 font-semibold uppercase">Billing Cycle</div>
              <div className="text-sm font-medium text-neutral-900 capitalize">{subscription?.billing_cycle || "Monthly"}</div>
            </div>
            {isPaid && endDate && (
              <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex-1">
                <div className="text-xs text-neutral-500 mb-1 font-semibold uppercase">
                  {subscription.cancel_at_period_end ? "Ends On" : "Renews On"}
                </div>
                <div className="text-sm font-medium text-neutral-900">{format(endDate, "MMM dd, yyyy")}</div>
              </div>
            )}
          </div>

          {isPaid && !subscription.cancel_at_period_end && (
            <button onClick={handleCancel} className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
              Cancel Subscription
            </button>
          )}
        </div>

        {/* Usage section */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 mb-6">Usage Overview</h2>
          <div className="grid gap-6 md:grid-cols-2">
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-neutral-700">Workspaces</span>
                <span className="text-neutral-900">{usage?.workspaces_count || 0} / {plan.maxWorkspaces}</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, ((usage?.workspaces_count || 0) / plan.maxWorkspaces) * 100)}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-neutral-700">Storage</span>
                <span className="text-neutral-900">{(usage?.storage_used_bytes || 0) / 1024 / 1024} MB / {plan.maxStorageBytes / 1024 / 1024} MB</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, ((usage?.storage_used_bytes || 0) / plan.maxStorageBytes) * 100)}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-neutral-700">AI Tokens</span>
                <span className="text-neutral-900">{usage?.ai_tokens_used || 0} / {plan.maxAiTokens}</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, ((usage?.ai_tokens_used || 0) / plan.maxAiTokens) * 100)}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-neutral-700">Collaborators</span>
                <span className="text-neutral-900">{usage?.collaborators_count || 0} / {plan.maxCollaborators}</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, ((usage?.collaborators_count || 0) / plan.maxCollaborators) * 100)}%` }} />
              </div>
            </div>

          </div>
        </div>

        {/* Upgrade Plans */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPageContent.plans.filter(p => p.key !== "free" && p.key !== "enterprise").map(p => {
              const isActive = dbPlan?.key === p.key;
              return (
                <div key={p.key} className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col ${isActive ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-neutral-200'}`}>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-neutral-900">{p.name}</h3>
                    <div className="text-2xl font-extrabold text-neutral-900 mt-2">{p.yearlyPrice} <span className="text-sm text-neutral-500 font-medium">/mo billed yearly</span></div>
                  </div>
                  <p className="text-sm text-neutral-500 mb-6 flex-1">{p.description}</p>
                  
                  {isActive ? (
                    <div className="w-full py-2.5 text-center bg-indigo-50 text-indigo-700 font-bold rounded-xl text-sm flex justify-center items-center gap-2">
                      <Check className="w-4 h-4" /> Current Plan
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleUpgrade(p.key)}
                      disabled={!!processingPlan}
                      className="w-full py-2.5 text-center bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                      {processingPlan === p.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Upgrade <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}
