"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Check,
  X,
  Loader2,
  ArrowLeftRight,
  Zap,
} from "lucide-react";
import { DbPlanRecord } from "@/types/billing";
import { BillingCycle, PlanKey } from "@/types/types";
import { formatPaiseToRupees, formatBytes, formatTokens } from "./utils";
import { toast } from "sonner";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: DbPlanRecord | null;
  newPlan: DbPlanRecord;
  billingCycle: BillingCycle;
  onConfirm: () => Promise<void>;
}

export function UpgradeDialog({
  open,
  onOpenChange,
  currentPlan,
  newPlan,
  billingCycle,
  onConfirm,
}: UpgradeDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      await onConfirm();
      toast.success("Redirecting to checkout...");
    } catch (error) {
      toast.error("Failed to process upgrade");
      setIsProcessing(false);
    }
  };

  const isUpgrade =
    !currentPlan ||
    (currentPlan.key === "free" && newPlan.key !== "free") ||
    (currentPlan.key === "pro" && newPlan.key === "ultra");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            {isUpgrade ? (
              <Zap className="h-7 w-7 text-white" />
            ) : (
              <ArrowLeftRight className="h-7 w-7 text-white" />
            )}
          </div>
          <DialogTitle className="text-center">
            {isUpgrade ? "Upgrade your plan" : "Change your plan"}
          </DialogTitle>
          <DialogDescription className="text-center">
            Review the changes before continuing
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="rounded-xl border bg-muted/50 p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
              Current
            </p>
            <p className="text-lg font-semibold text-foreground">
              {currentPlan?.name || "Free"}
            </p>
            {currentPlan && (
              <p className="text-sm text-muted-foreground mt-1">
                {formatPaiseToRupees(
                  billingCycle === "monthly"
                    ? currentPlan.monthly_price_paise
                    : currentPlan.yearly_price_paise
                )}
                /{billingCycle}
              </p>
            )}
          </div>

          <div className="relative rounded-xl border-2 border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-4">
            <Badge className="absolute -top-2 -right-2 bg-indigo-500">
              {isUpgrade ? "New" : "Switch"}
            </Badge>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">
              New
            </p>
            <p className="text-lg font-semibold text-foreground">
              {newPlan.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatPaiseToRupees(
                billingCycle === "monthly"
                  ? newPlan.monthly_price_paise
                  : newPlan.yearly_price_paise
              )}
              /{billingCycle}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-muted/30 divide-y">
          <div className="p-4">
            <h4 className="font-semibold text-foreground mb-3">
              What&apos;s changing
            </h4>
            <ul className="space-y-2">
              <FeatureComparison
                label="Workspaces"
                current={
                  currentPlan
                    ? currentPlan.max_workspaces === 999999
                      ? "Unlimited"
                      : currentPlan.max_workspaces
                    : "3"
                }
                new={
                  newPlan.max_workspaces === 999999
                    ? "Unlimited"
                    : newPlan.max_workspaces
                }
                isUpgrade={isUpgrade}
              />
              <FeatureComparison
                label="Storage"
                current={
                  currentPlan
                    ? formatBytes(currentPlan.max_storage_bytes)
                    : formatBytes(100 * 1024 * 1024)
                }
                new={formatBytes(newPlan.max_storage_bytes)}
                isUpgrade={isUpgrade}
              />
              <FeatureComparison
                label="AI Tokens"
                current={
                  currentPlan
                    ? formatTokens(currentPlan.max_ai_tokens)
                    : formatTokens(200000)
                }
                new={formatTokens(newPlan.max_ai_tokens)}
                isUpgrade={isUpgrade}
              />
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Keep Current Plan
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue to Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FeatureComparisonProps {
  label: string;
  current: string | number;
  new: string | number;
  isUpgrade: boolean;
}

function FeatureComparison({
  label,
  current,
  new: newVal,
  isUpgrade,
}: FeatureComparisonProps) {
  const isBetter = newVal !== current;

  return (
    <li className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm">{current}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span
          className={cn(
            "text-sm font-semibold",
            isBetter
              ? isUpgrade
                ? "text-emerald-600"
                : "text-amber-600"
              : "text-muted-foreground"
          )}
        >
          {newVal}
        </span>
        {isBetter &&
          (isUpgrade ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <X className="h-4 w-4 text-amber-500" />
          ))}
      </div>
    </li>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
