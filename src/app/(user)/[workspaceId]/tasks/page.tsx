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
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-[60px]">
        <h1 className="text-lg font-semibold">Tasks</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
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
