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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cancellation failed";
    console.error("Cancel error:", message);
    
    if (message.includes("already scheduled") || message.includes("No active paid subscription")) {
        return NextResponse.json({ success: false, message }, { status: 409 });
    }
    
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}