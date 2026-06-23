export type SubscriptionStatus = "active" | "trialing" | "past_due" | "cancelled" | "expired";
export type BillingCycle = "monthly" | "yearly";

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
    amount_paise: number;
    currency: string;
    status: string;
    invoice_reference?: string | null;
    created_at: string;
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
