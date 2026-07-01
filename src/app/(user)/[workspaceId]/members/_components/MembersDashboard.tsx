"use client";

import React, { useState, useEffect } from "react";
import { Workspace, WorkspaceMember, WorkspaceInvite, WorkspaceActivityLog } from "@/types/workspace";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MembersOverviewCards from "./MembersOverviewCards";
import MembersDirectoryList from "./MembersDirectoryList";
import RolePermissionsMatrix from "./RolePermissionsMatrix";
import InviteMemberDialog from "./InviteMemberDialog";
import MemberProfileSheet from "./MemberProfileSheet";
import { RemoveUserFromWorkspace, CancelInvitation } from "@/features/workspace/invites";
import { UpdateMemberRole } from "@/features/workspace/workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogWorkspaceActivity } from "@/features/workspace/activity";

interface MembersDashboardProps {
  workspace: Workspace;
  initialMembers: WorkspaceMember[];
  initialInvites: any[];
  initialActivities: WorkspaceActivityLog[];
  currentUser: any;
  currentUserRole: string | null;
}

export default function MembersDashboard({
  workspace,
  initialMembers,
  initialInvites,
  initialActivities,
  currentUser,
  currentUserRole
}: MembersDashboardProps) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [invites, setInvites] = useState(initialInvites);
  const [activities, setActivities] = useState(initialActivities);

  // Sync state with props when router.refresh() fetches new data
  useEffect(() => {
    setMembers(initialMembers);
    setInvites(initialInvites);
    setActivities(initialActivities);
  }, [initialMembers, initialInvites, initialActivities]);

  const [activeTab, setActiveTab] = useState<"members" | "permissions">("members");

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null);

  const hasAdminPrivilege = currentUserRole === 'owner' || currentUserRole === 'admin';

  const handleUpdateRole = async (targetUserId: string, newRole: string) => {
    const formData = new FormData();
    formData.append("workspaceId", workspace.id);
    formData.append("userId", targetUserId); // Updated from targetUserId to match UpdateMemberRole API
    formData.append("role", newRole);

    const res = await UpdateMemberRole(formData);
    if (res.success) {
      toast.success("Role updated successfully");

      // Optimistic update
      setMembers(members.map(m => m.user_id === targetUserId ? { ...m, role: newRole as any } : m));

      // Log activity
      await LogWorkspaceActivity(workspace.id, 'changed_role', 'user', targetUserId, { newRole });

      router.refresh(); // Background refresh
    } else {
      toast.error(res.message);
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    if (!confirm("Are you sure you want to remove this member? They will lose access to the workspace immediately.")) return;

    const formData = new FormData();
    formData.append("workspaceId", workspace.id);
    formData.append("userId", targetUserId); // Updated to match RemoveUserFromWorkspace API

    const res = await RemoveUserFromWorkspace(formData);
    if (res.success) {
      toast.success("Member removed");

      // Optimistic update
      setMembers(members.filter(m => m.user_id !== targetUserId));

      // Log activity
      await LogWorkspaceActivity(workspace.id, 'removed_user', 'user', targetUserId);

      if (selectedMember?.user_id === targetUserId) {
        setSelectedMember(null);
      }

      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    const formData = new FormData();
    formData.append("workspaceId", workspace.id);
    formData.append("invitationId", inviteId);

    const res = await CancelInvitation(formData);
    if (res.success) {
      toast.success("Invitation revoked");

      // Optimistic update
      setInvites(invites.filter(i => i.id !== inviteId));

      // Log activity
      await LogWorkspaceActivity(workspace.id, 'revoked_invite', 'invite', inviteId);

      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="max-w-9xl mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Workspace Members</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage access, permissions, and team members for {workspace.name}.</p>
        </div>
        {hasAdminPrivilege && (
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm h-11 px-6 font-semibold shrink-0"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Invite Member
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <MembersOverviewCards
        totalMembers={members.length}
        activeToday={Math.max(1, Math.floor(members.length * 0.8))} // Mocked active today since we don't track sessions precisely
        pendingInvites={invites.length}
        adminCount={members.filter(m => m.role === 'owner' || m.role === 'admin').length}
      />

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-border pb-px">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-3 px-1 font-bold text-sm border-b-2 transition-colors ${activeTab === "members" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
          >
            Members & Invites
          </button>
          <button
            onClick={() => setActiveTab("permissions")}
            className={`pb-3 px-1 font-bold text-sm border-b-2 transition-colors ${activeTab === "permissions" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
          >
            Roles & Permissions
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === "members" && (
            <MembersDirectoryList
              members={members}
              invites={invites}
              currentUserId={currentUser.id}
              currentUserRole={currentUserRole}
              onUpdateRole={handleUpdateRole}
              onRemoveMember={handleRemoveMember}
              onRevokeInvite={handleRevokeInvite}
              onViewProfile={(member) => setSelectedMember(member)}
            />
          )}

          {activeTab === "permissions" && (
            <RolePermissionsMatrix />
          )}
        </div>
      </div>

      {/* Dialogs & Sheets */}
      <InviteMemberDialog
        isOpen={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        workspaceId={workspace.id}
        onInviteSuccess={() => router.refresh()}
      />

      <MemberProfileSheet
        isOpen={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
        member={selectedMember}
        activities={activities}
        currentUserRole={currentUserRole}
        onManageRole={(userId) => {
          // If we want to manage role from sheet, we could open a small dialog or something
          // But since it's just a test, we can close the sheet and maybe focus the row
        }}
      />
    </div>
  );
}
