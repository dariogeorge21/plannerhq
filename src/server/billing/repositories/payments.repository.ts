import { createClient } from "@/lib/supabase/server";
import { PaymentRecord } from "@/types/billing";

export class PaymentsRepository {
  private static instance: PaymentsRepository;

  private constructor() {}

  public static getInstance(): PaymentsRepository {
    if (!PaymentsRepository.instance) {
      PaymentsRepository.instance = new PaymentsRepository();
    }
    return PaymentsRepository.instance;
  }

  public async getByUserId(
    userId: string,
    limit: number = 50
  ): Promise<PaymentRecord[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[BILLING ERROR] PaymentsRepository.getByUserId failed:", { userId, error });
      throw new Error("Failed to fetch payment history");
    }

    return (data || []) as PaymentRecord[];
  }

  public async getLatestByUserId(userId: string): Promise<PaymentRecord | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "captured")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[BILLING ERROR] PaymentsRepository.getLatestByUserId failed:", { userId, error });
      throw new Error("Failed to fetch latest payment");
    }

    return data as PaymentRecord | null;
  }

  public async create(data: {
    userId: string;
    subscriptionId?: string | null;
    razorpayPaymentId: string;
    razorpayOrderId?: string | null;
    razorpaySubscriptionId?: string | null;
    amountPaise: number;
    currency: string;
    status: string;
    invoiceReference?: string | null;
    invoiceUrl?: string | null;
    receiptNumber?: string | null;
    paymentMethod?: string | null;
    taxPaise?: number | null;
    feePaise?: number | null;
    discountPaise?: number | null;
    totalAmountPaise?: number | null;
    billingInterval?: string | null;
    failureReason?: string | null;
    paidAt?: string | null;
  }): Promise<PaymentRecord> {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from("payments")
      .insert({
        user_id: data.userId,
        subscription_id: data.subscriptionId,
        razorpay_payment_id: data.razorpayPaymentId,
        razorpay_order_id: data.razorpayOrderId,
        razorpay_subscription_id: data.razorpaySubscriptionId,
        amount_paise: data.amountPaise,
        currency: data.currency,
        status: data.status,
        invoice_reference: data.invoiceReference,
        invoice_url: data.invoiceUrl,
        receipt_number: data.receiptNumber,
        payment_method: data.paymentMethod,
        tax_paise: data.taxPaise,
        fee_paise: data.feePaise,
        discount_paise: data.discountPaise,
        total_amount_paise: data.totalAmountPaise,
        billing_interval: data.billingInterval,
        failure_reason: data.failureReason,
        paid_at: data.paidAt,
      })
      .select()
      .single();

    if (error || !inserted) {
      console.error("[BILLING ERROR] PaymentsRepository.create failed:", { data, error });
      throw new Error("Failed to create payment record");
    }

    console.log("[BILLING] Created payment record:", {
      userId: data.userId,
      paymentId: inserted.id,
      razorpayPaymentId: data.razorpayPaymentId,
    });

    return inserted as PaymentRecord;
  }

  public async update(
    id: string,
    updates: Partial<{
      status: string;
      invoiceReference: string | null;
      invoiceUrl: string | null;
      paymentMethod: string | null;
      taxPaise: number | null;
      feePaise: number | null;
      discountPaise: number | null;
      totalAmountPaise: number | null;
      failureReason: string | null;
      paidAt: string | null;
    }>
  ): Promise<PaymentRecord> {
    const supabase = await createClient();

    const updatePayload: Record<string, any> = {};
    if (updates.status !== undefined) updatePayload.status = updates.status;
    if (updates.invoiceReference !== undefined) updatePayload.invoice_reference = updates.invoiceReference;
    if (updates.invoiceUrl !== undefined) updatePayload.invoice_url = updates.invoiceUrl;
    if (updates.paymentMethod !== undefined) updatePayload.payment_method = updates.paymentMethod;
    if (updates.taxPaise !== undefined) updatePayload.tax_paise = updates.taxPaise;
    if (updates.feePaise !== undefined) updatePayload.fee_paise = updates.feePaise;
    if (updates.discountPaise !== undefined) updatePayload.discount_paise = updates.discountPaise;
    if (updates.totalAmountPaise !== undefined) updatePayload.total_amount_paise = updates.totalAmountPaise;
    if (updates.failureReason !== undefined) updatePayload.failure_reason = updates.failureReason;
    if (updates.paidAt !== undefined) updatePayload.paid_at = updates.paidAt;

    const { data, error } = await supabase
      .from("payments")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("[BILLING ERROR] PaymentsRepository.update failed:", { id, updates, error });
      throw new Error("Failed to update payment record");
    }

    console.log("[BILLING] Updated payment record:", {
      paymentId: id,
      updates: Object.keys(updates),
    });

    return data as PaymentRecord;
  }

  public async getByRazorpayPaymentId(razorpayPaymentId: string): Promise<PaymentRecord | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("razorpay_payment_id", razorpayPaymentId)
      .maybeSingle();

    if (error) {
      console.error("[BILLING ERROR] PaymentsRepository.getByRazorpayPaymentId failed:", { razorpayPaymentId, error });
      throw new Error("Failed to fetch payment");
    }

    return data as PaymentRecord | null;
  }
}
