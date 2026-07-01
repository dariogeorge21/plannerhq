import { PlanKey, BillingCycle as TCycle } from "./types";

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "cancelled" | "expired";
export type BillingCycle = TCycle;

// =====================
// DATABASE SCHEMA TYPES
// =====================

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;
  razorpay_subscription_id?: string | null;
  razorpay_customer_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end: boolean;
  trial_end?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  subscription_id?: string | null;
  razorpay_payment_id: string;
  razorpay_order_id?: string | null;
  razorpay_subscription_id?: string | null;
  amount_paise: number;
  currency: string;
  status: string;
  invoice_reference?: string | null;
  invoice_url?: string | null;
  receipt_number?: string | null;
  payment_method?: string | null;
  tax_paise?: number | null;
  fee_paise?: number | null;
  discount_paise?: number | null;
  total_amount_paise?: number | null;
  billing_interval?: string | null;
  failure_reason?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageRecord {
  id: string;
  subscription_id: string;
  user_id: string;
  workspaces_count: number;
  collaborators_count: number;
  sections_count: number;
  storage_used_bytes: number;
  ai_tokens_used: number;
  events_current_month: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookEventRecord {
  id: string;
  razorpay_event_id?: string | null;
  event_type: string;
  payload: any;
  processed: boolean;
  processed_at?: string | null;
  error_message?: string | null;
  created_at: string;
}

export interface DbPlanRecord {
  id: string;
  key: PlanKey;
  name: string;
  description?: string | null;
  monthly_price_paise: number;
  yearly_price_paise: number;
  currency: string;
  max_workspaces: number;
  max_sections: number;
  max_storage_bytes: number;
  max_ai_tokens: number;
  ai_token_period: "total" | "daily";
  max_collaborators: number;
  version_history_days: number;
  max_file_upload_bytes: number;
  max_workspace_admins: number;
  max_tasks_per_ws?: number | null;
  max_events_per_month?: number | null;
  audit_log_days: number;
  has_custom_roles: boolean;
  has_google_sync: boolean;
  has_google_meet: boolean;
  has_sla: boolean;
  razorpay_plan_id_monthly?: string | null;
  razorpay_plan_id_yearly?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================
// CLIENT-SIDE HELPERS
// =====================

export interface BillingPlan {
  id: string;
  maxWorkspaces: number;
  maxSections: number;
  maxStorageBytes: number;
  maxAiTokens: number;
  maxCollaborators: number;
  razorpayPlanIdMonthly: string | null;
  razorpayPlanIdYearly: string | null;
}
