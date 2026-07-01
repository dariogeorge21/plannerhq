"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DbPlanRecord } from "@/types/billing";
import { BillingCycle, PlanKey } from "@/types/types";
import { formatPaiseToRupees, formatBytes, formatTokens, getPlanPrice, getSavingsPercentage } from "./utils";
import { Check, Zap, Sparkles, Shield, Users, Building, HardDrive, Bot } from "lucide-react";
import { motion } from "framer-motion";

interface PlansSectionProps {
  plans: DbPlanRecord[];
  currentPlanKey: PlanKey;
  onSelectPlan: (plan: DbPlanRecord, cycle: BillingCycle) => void;
}

export function PlansSection({ plans, currentPlanKey, onSelectPlan }: PlansSectionProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const activePlans = plans.filter((p) => p.is_active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                <Zap className="h-4.5 w-4.5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>Change Your Plan</CardTitle>
                <CardDescription>
                  Select a plan that fits your needs
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center bg-muted rounded-xl p-1 w-full sm:w-auto mt-4 sm:mt-0">
              {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                    billingCycle === cycle
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                  {cycle === "yearly" && (
                    <span className="ml-1.5 text-xs text-emerald-600 font-bold hidden xs:inline-block sm:inline-block">
                      Save 25%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-4 md:gap-4 lg:gap-6 grid-cols-1 md:grid-cols-3">
            {activePlans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                isCurrent={plan.key === currentPlanKey}
                isPopular={plan.key === "pro"}
                index={index}
                onSelect={() => onSelectPlan(plan, billingCycle)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface PlanCardProps {
  plan: DbPlanRecord;
  billingCycle: BillingCycle;
  isCurrent: boolean;
  isPopular: boolean;
  index: number;
  onSelect: () => void;
}

function PlanCard({ plan, billingCycle, isCurrent, isPopular, index, onSelect }: PlanCardProps) {
  const priceInfo = getPlanPrice(plan, billingCycle, true);
  const savings = billingCycle === "yearly" ? getSavingsPercentage(plan) : 0;

  const features = [
    { label: "Workspaces", value: plan.max_workspaces === 999999 ? "Unlimited" : plan.max_workspaces, icon: <Building /> },
    { label: "Storage", value: formatBytes(plan.max_storage_bytes), icon: <HardDrive /> },
    { label: "AI Tokens", value: formatTokens(plan.max_ai_tokens), icon: <Bot /> },
    { label: "Collaborators", value: plan.max_collaborators === 999999 ? "Unlimited" : plan.max_collaborators, icon: <Users /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 + index * 0.1 }}
    >
      <Card
        className={cn(
          "relative flex flex-col h-full w-full transition-all hover:shadow-lg",
          isPopular && !isCurrent ? "ring-2 ring-indigo-500/50" : "",
          isCurrent ? "border-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/20" : ""
        )}
      >
        {isPopular && !isCurrent && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="default" className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600">
              Most Popular
            </Badge>
          </div>
        )}
        {isCurrent && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="secondary" className="px-3 py-1">
              Current Plan
            </Badge>
          </div>
        )}

        <CardHeader className="p-5 md:p-4 lg:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            {plan.key === "free" ? (
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            ) : plan.key === "pro" ? (
              <Zap className="h-5 w-5 text-indigo-500" />
            ) : (
              <Shield className="h-5 w-5 text-purple-500" />
            )}
            {plan.name}
          </CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              {priceInfo.price}
            </span>
            <span className="text-muted-foreground">{priceInfo.suffix}</span>
          </div>
          {billingCycle === "yearly" && priceInfo.total && (
            <p className="text-sm text-emerald-600 font-semibold mt-1">
              Billed {priceInfo.total} yearly · Save {savings}%
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-5 pt-0 md:p-4 md:pt-0 lg:p-6 lg:pt-0">
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.label} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{feature.value}</span>{" "}
                  {feature.label}
                </div>
              </li>
            ))}
            {plan.has_custom_roles && (
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Custom Roles
                </span>
              </li>
            )}
            {plan.has_google_sync && (
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Google Sync
                </span>
              </li>
            )}
            {plan.has_sla && (
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Priority Support
                </span>
              </li>
            )}
          </ul>
        </CardContent>

        <CardFooter className="pt-0 p-5 md:p-4 md:pt-0 lg:p-6 lg:pt-0">
          <Button
            className="w-full"
            variant={isCurrent ? "outline" : "default"}
            disabled={isCurrent}
            onClick={onSelect}
          >
            {isCurrent ? "Current Plan" : plan.key === "free" ? "Downgrade" : "Upgrade"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
