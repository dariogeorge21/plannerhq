import { SubscriptionRecord, PaymentRecord, DbPlanRecord, UsageRecord } from "@/types/billing";
import { PlanKey, BillingCycle } from "@/types/types";

export interface BillingOverviewResponse {
  currentPlan: DbPlanRecord;
  subscription: SubscriptionRecord | null;
  availablePlans: DbPlanRecord[];
  paymentHistory: PaymentRecord[];
  usage: UsageRecord | null;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
  billingCycle: BillingCycle | null;
  nextBillingDate: string | null;
  renewalDate: string | null;
  status: string;
}

export interface CreateCheckoutResponse {
  success: boolean;
  subscriptionId?: string;
  shortUrl?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  details?: Record<string, any>;
}

export enum BillingErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  SUBSCRIPTION_NOT_FOUND = "SUBSCRIPTION_NOT_FOUND",
  PLAN_NOT_FOUND = "PLAN_NOT_FOUND",
  RAZORPAY_ERROR = "RAZORPAY_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  ALREADY_SUBSCRIBED = "ALREADY_SUBSCRIBED",
  CANNOT_DOWNGRADE = "CANNOT_DOWNGRADE",
  CANNOT_UPGRADE = "CANNOT_UPGRADE",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export interface BillingError {
  code: BillingErrorCode;
  message: string;
  details?: Record<string, any>;
}

export interface CreateCheckoutOptions {
  userId: string;
  planKey: PlanKey;
  billingCycle: BillingCycle;
}

export interface CancelSubscriptionOptions {
  userId: string;
  cancelAtPeriodEnd?: boolean;
}

export interface ChangePlanOptions {
  userId: string;
  newPlanKey: PlanKey;
  newBillingCycle?: BillingCycle;
}
