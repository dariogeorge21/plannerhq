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
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { BillingOverviewResponse } from "@/server/billing/types";
import { formatDate } from "./utils";
import { toast } from "sonner";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: BillingOverviewResponse;
  onCancel: () => Promise<void>;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  data,
  onCancel,
}: CancelSubscriptionDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [step, setStep] = useState<"confirm" | "processing" | "success">(
    "confirm"
  );

  const handleCancel = async () => {
    try {
      setStep("processing");
      setIsCancelling(true);
      await onCancel();
      setStep("success");
      toast.success("Subscription cancelled successfully");
      setTimeout(() => {
        onOpenChange(false);
        setStep("confirm");
      }, 2000);
    } catch (error) {
      toast.error("Failed to cancel subscription");
      setStep("confirm");
      setIsCancelling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <DialogTitle className="text-center">
                Cancel your subscription?
              </DialogTitle>
              <DialogDescription className="text-center">
                Your plan will remain active until{" "}
                {data.nextBillingDate ? (
                  <span className="font-semibold text-foreground">
                    {formatDate(data.nextBillingDate)}
                  </span>
                ) : (
                  "the end of your billing period"
                )}
                . After that, you&apos;ll be moved to the Free plan.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 rounded-xl bg-muted p-4">
              <h4 className="font-semibold text-foreground mb-2">
                What you&apos;ll lose:
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  Premium features
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  Increased workspace limits
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  Priority support
                </li>
              </ul>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isCancelling}
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                Cancel Anyway
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "processing" && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Cancelling your subscription
              </h3>
              <p className="text-muted-foreground mt-1">
                Just a moment while we process your request...
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Cancelled successfully
              </h3>
              <p className="text-muted-foreground mt-1">
                Your subscription will remain active until{" "}
                {data.nextBillingDate ? (
                  <span className="font-semibold text-foreground">
                    {formatDate(data.nextBillingDate)}
                  </span>
                ) : (
                  "the end of your billing period"
                )}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
