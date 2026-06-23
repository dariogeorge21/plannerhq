import { GetWorkspace, GetWorkspaceMembers } from "@/features/workspace/workspace";
import { ListInvitationsForWorkspace } from "@/features/workspace/invites";
import { GetWorkspaceActivity } from "@/features/workspace/activity";
import MembersDashboard from "./_components/MembersDashboard";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function WorkspaceMembersPage({
  params: paramsPromise,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const params = await paramsPromise;
  const workspaceId = params.workspaceId;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all required data in parallel
  const [wsRes, memRes, invitesRes, activityRes] = await Promise.all([
    GetWorkspace(workspaceId),
    GetWorkspaceMembers(workspaceId),
    ListInvitationsForWorkspace(workspaceId),
    GetWorkspaceActivity(workspaceId, 50)
  ]);

  if (!wsRes.success || !wsRes.data) {
    return <div className="p-10 text-center text-neutral-500">Workspace not found or access denied.</div>;
  }

  const members = memRes.data || [];
  const invites = invitesRes.data || [];
  const activities = activityRes.data || [];
  
  const currentMember = members.find(m => m.user_id === user.id);
  const currentUserRole = currentMember ? currentMember.role : null;

  return (
    <MembersDashboard 
      workspace={wsRes.data}
      initialMembers={members}
      initialInvites={invites}
      initialActivities={activities}
      currentUser={user}
      currentUserRole={currentUserRole}
    />
  );
}