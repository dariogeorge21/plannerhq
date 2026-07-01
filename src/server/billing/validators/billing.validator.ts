import { z } from "zod";
import { BillingCycle, PlanKey } from "@/types/types";

export const BillingCycleSchema = z.enum(["monthly", "yearly"]) as z.ZodType<BillingCycle>;

export const PlanKeySchema = z.enum(["free", "pro", "ultra", "enterprise"]) as z.ZodType<PlanKey>;

export const CreateCheckoutSchema = z.object({
  planKey: PlanKeySchema.refine(
    (key) => key !== "free" && key !== "enterprise",
    "Cannot checkout for free or enterprise plan"
  ),
  billingCycle: BillingCycleSchema,
});

export const CancelSubscriptionSchema = z.object({
  cancelAtPeriodEnd: z.boolean().optional().default(true),
});

export const ChangePlanSchema = z.object({
  newPlanKey: PlanKeySchema,
  newBillingCycle: BillingCycleSchema.optional(),
});

export const VerifyPaymentSchema = z.object({
  razorpayPaymentId: z.string(),
  razorpayOrderId: z.string(),
  razorpaySignature: z.string(),
});

export type CreateCheckoutInput = z.infer<typeof CreateCheckoutSchema>;
export type CancelSubscriptionInput = z.infer<typeof CancelSubscriptionSchema>;
export type ChangePlanInput = z.infer<typeof ChangePlanSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
