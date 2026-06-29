import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { RAZORPAY_KEY_SECRET } from "@/features/billing/config";

const VerifySchema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_subscription_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = parsed.data;

    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    const secret = RAZORPAY_KEY_SECRET;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_payment_id + "|" + razorpay_subscription_id)
      .digest("hex");

    const a = Buffer.from(generatedSignature);
    const b = Buffer.from(razorpay_signature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }

    // Optimistic activation — webhook will confirm later
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const supabaseAdmin = require("@supabase/supabase-js").createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("id, plan_id, plans(key)")
        .eq("razorpay_subscription_id", razorpay_subscription_id)
        .single();

      if (sub) {
        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "active" })
          .eq("id", sub.id);

        const planKey = (sub.plans as any)?.key;
        if (planKey) {
          await supabaseAdmin
            .from("profiles")
            .update({ current_plan: planKey })
            .eq("id", user.id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    console.error("Verification error:", message);
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}