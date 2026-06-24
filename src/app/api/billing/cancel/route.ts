import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cancelSubscription } from "@/features/billing/service";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await cancelSubscription(user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cancel error:", error);
    return NextResponse.json({ success: false, message: error.message || "Cancellation failed" }, { status: 500 });
  }
}