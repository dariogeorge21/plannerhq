import { createClient } from "@/lib/supabase/server";
import { CalendarPageClient } from "./client";
import { redirect } from "next/navigation";

export default async function CalendarPage(props: { params: Promise<{ workspaceId: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <main className="flex-1 overflow-hidden w-full">
        <CalendarPageClient workspaceId={params.workspaceId} />
      </main>
    </div>
  );
}
