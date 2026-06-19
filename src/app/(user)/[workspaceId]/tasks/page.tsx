import { createClient } from "@/lib/supabase/server";
import { createTaskService } from "@/features/task/services";
import { TasksClient } from "./client";
import { redirect } from "next/navigation";

export default async function TasksPage(props: { params: Promise<{ workspaceId: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return redirect("/login");
  }

  const service = createTaskService(supabase);

  // Fetch sections and tasks server-side
  const [sections, tasks, assignees] = await Promise.all([
    service.getSections(params.workspaceId).catch(() => []),
    service.getTasks(params.workspaceId).catch(() => []),
    service.getAssignees(params.workspaceId).catch(() => []),
  ]);

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] text-foreground">
      <main className="flex-1 overflow-auto w-full">
        <TasksClient
          workspaceId={params.workspaceId}
          initialSections={sections}
          initialTasks={tasks}
          initialAssignees={assignees}
          userId={userData.user.id}
        />
      </main>
    </div>
  );
}
