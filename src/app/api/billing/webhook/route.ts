import { NextResponse } from "next/server";
import { SubscriptionService } from "@/server/billing/services/subscription.service";
import { BillingServiceError } from "@/server/billing/utils";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature") || "";

        const subscriptionService = SubscriptionService.getInstance();
        await subscriptionService.processWebhook(body, signature);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[BILLING ERROR] Webhook error:", error);

        if (error instanceof BillingServiceError) {
            return NextResponse.json(
                { success: false, message: error.message, code: error.code },
                { status: error.code === "UNAUTHORIZED" ? 401 : 400 }
            );
        }

        const message = error instanceof Error ? error.message : "Webhook processing failed";
        return NextResponse.json(
            { success: false, message, code: "INTERNAL_ERROR" },
            { status: 500 }
        );
    }
}
