import { NextResponse } from "next/server";
import crypto from "crypto";
import { RAZORPAY_KEY_SECRET } from "@/features/billing/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: user } = await supabase.auth.getUser();

        if (!user?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = body;

        if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
            return NextResponse.json({ error: "Missing razorpay parameters" }, { status: 400 });
        }

        if (!RAZORPAY_KEY_SECRET) {
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        // Verify Signature
        const text = `${razorpay_payment_id}|${razorpay_subscription_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(text)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        // Payment verified, but webhook handles actual db updates for security.
        // We can just return success here to UI. The webhook will update the subscription status.
        return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
