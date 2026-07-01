import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cancelSubscription } from "@/features/billing/service";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await cancelSubscription(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BILLING ERROR] Cancel API error:", error);

    const message = error instanceof Error ? error.message : "Cancellation failed";
    return NextResponse.json(
      { success: false, message, code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
