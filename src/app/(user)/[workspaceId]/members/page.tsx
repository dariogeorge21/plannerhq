"use client";

import React, { useEffect, useState, useTransition, use } from "react";
import { GetWorkspace, GetWorkspaceMembers, UpdateMemberRole } from "@/features/workspace/workspace";
import { 
  RemoveUserFromWorkspace, 
  InviteUserToWorkspaceByEmail, 
  InviteUserToWorkspaceByHqid,
  ListInvitationsForWorkspace,
  CancelInvitation
} from "@/features/workspace/invites";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Loader2, 
  UserPlus, 
  Trash2, 
  Mail, 
  Hash, 
  Sparkles,
  Shield,
  ShieldAlert,
  Search
} from "lucide-react";
import { Workspace, WorkspaceMember } from "@/types/workspace";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";

export default function WorkspaceMembersPage({
  params: paramsPromise,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const params = use(paramsPromise);
  const workspaceId = params.workspaceId;
  const { user } = useSession();
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<"email" | "hqid">("email");
  const [inviteValue, setInviteValue] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [isPendingInvitesLoading, setIsPendingInvitesLoading] = useState(true);

  const loadData = async () => {
    try {
      const [wsRes, memRes, inviteRes] = await Promise.all([
        GetWorkspace(workspaceId),
        GetWorkspaceMembers(workspaceId),
        ListInvitationsForWorkspace(workspaceId)
      ]);

      if (wsRes.success && wsRes.data) {
        setWorkspace(wsRes.data);
      }
      if (memRes.success && memRes.data) {
        setMembers(memRes.data);
      }
      if (inviteRes.success) {
        setPendingInvites(inviteRes.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members list");
    } finally {
      setLoading(false);
      setIsPendingInvitesLoading(false);
    }
  };

  const loadPendingInvites = async () => {
    setIsPendingInvitesLoading(true);
    try {
      const res = await ListInvitationsForWorkspace(workspaceId);
      if (res.success) {
        setPendingInvites(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPendingInvitesLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [workspaceId]);
    
  const [isInvitePending, startInviteTransition] = useTransition();
  const [isActionPending, startActionTransition] = useTransition();

  // Remove member confirmation state
  const [confirmRemove, setConfirmRemove] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({
    open: false,
    userId: "",
    userName: ""
  });

  // Cancel invitation confirmation state
  const [confirmCancelInvite, setConfirmCancelInvite] = useState<{
    open: boolean;
    inviteId: string;
    inviteName: string;
  }>({
    open: false,
    inviteId: "",
    inviteName: ""
  });

  const handleCancelInvite = (invitationId: string) => {
    startActionTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("invitationId", invitationId);

      const res = await CancelInvitation(formData);
      if (res.success) {
        toast.success(res.message);
        setConfirmCancelInvite({ open: false, inviteId: "", inviteName: "" });
        loadPendingInvites();
      } else {
        toast.error(res.message || "Failed to cancel invitation");
      }
    });
  };

  if (loading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!workspace || !user) {
    return <div className="text-center py-12">Workspace not found</div>;
  }

  const currentUserMembership = members.find(m => m.user_id === user.id);
  const isOwnerOrAdmin = currentUserMembership?.role === 'owner' || currentUserMembership?.role === 'admin';
  const currentUserRole = currentUserMembership?.role;

  const handleRoleChange = (memberId: string, newRole: string) => {
    startActionTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("userId", memberId);
      formData.append("role", newRole);

      const res = await UpdateMemberRole(formData);
      if (res.success) {
        toast.success(res.message);
        loadData();
      } else {
        toast.error(res.message || "Failed to update member role");
      }
    });
  };

  const handleRemoveMember = () => {
    startActionTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("userId", confirmRemove.userId);

      const res = await RemoveUserFromWorkspace(formData);
      if (res.success) {
        toast.success(res.message);
        setMembers(prev => prev.filter(m => m.user_id !== confirmRemove.userId));
        setConfirmRemove({ open: false, userId: "", userName: "" });
      } else {
        toast.error(res.message || "Failed to remove member");
      }
    });
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteValue.trim()) {
      toast.error(`Please enter an ${inviteMethod === 'email' ? 'email address' : 'HQID'}`);
      return;
    }

    startInviteTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("inviteType", inviteRole);

      let res;
      if (inviteMethod === 'email') {
        formData.append("email", inviteValue.trim());
        res = await InviteUserToWorkspaceByEmail(formData);
      } else {
        formData.append("hqid", inviteValue.trim());
        res = await InviteUserToWorkspaceByHqid(formData);
      }

      if (res.success) {
        toast.success(res.message);
        setInviteValue("");
        setIsInviteOpen(false);
        loadPendingInvites();
      } else {
        toast.error(res.message || "Failed to send invitation");
      }
    });
  };

  const filteredMembers = members.filter(member => 
    member.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.hqid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvites = pendingInvites.filter(invite => 
    invite.invitee_hqid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (invite.invitee_email && invite.invitee_email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950">Workspace Members</h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Manage user roles and team access permissions.</p>
        </div>
        {isOwnerOrAdmin && (
          <Button 
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 px-4 py-2 text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer w-fit"
          >
            <UserPlus className="w-4 h-4" /> Invite Member
          </Button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-2 max-w-md w-full border border-neutral-200 bg-white/70 backdrop-blur-md rounded-xl px-3 py-2 shadow-2xs">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by name, email, or HQID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-0 outline-hidden font-semibold text-sm placeholder:text-neutral-400 text-neutral-800"
        />
      </div>

      {/* Members List both pending and active */}
      <div className="border border-neutral-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md shadow-lg shadow-neutral-100/30">
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow className="border-b border-neutral-100">
              <TableHead className="font-bold text-neutral-500 pl-6">Member</TableHead>
              <TableHead className="font-bold text-neutral-500">HQID</TableHead>
              <TableHead className="font-bold text-neutral-500">Joined Date</TableHead>
              <TableHead className="font-bold text-neutral-500">Role</TableHead>
              {isOwnerOrAdmin && <TableHead className="text-right font-bold text-neutral-500 pr-6">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => {
              const isSelf = member.user_id === user.id;
              const isMemberOwner = member.role === 'owner';
              const isMemberAdmin = member.role === 'admin';
              
              // Determine if current user can manage this member's role
              const canManage = isOwnerOrAdmin && !isMemberOwner && !isSelf && (
                currentUserRole === 'owner' || (currentUserRole === 'admin' && member.role === 'member')
              );

              return (
                <TableRow key={member.user_id} className="border-b border-neutral-100/50 hover:bg-neutral-50/30 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm select-none">
                        {member.display_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-neutral-950 flex items-center gap-1.5">
                          <span>{member.display_name}</span>
                          {isSelf && <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-sm font-black uppercase">You</span>}
                        </div>
                        <div className="text-xs text-neutral-400 font-semibold">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-neutral-500 font-bold">{member.hqid}</TableCell>
                  <TableCell className="font-semibold text-neutral-500">
                    {new Date(member.joined_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    {canManage ? (
                      <Select 
                        value={member.role} 
                        onValueChange={(val) => handleRoleChange(member.user_id, val)}
                        disabled={isActionPending}
                      >
                        <SelectTrigger className="h-8 w-28 rounded-lg border border-neutral-200 bg-white px-2.5 font-bold text-xs outline-hidden cursor-pointer capitalize">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border border-neutral-100 bg-white shadow-lg">
                          <SelectItem value="member" className="font-semibold text-xs cursor-pointer rounded-lg">Member</SelectItem>
                          <SelectItem value="admin" className="font-semibold text-xs cursor-pointer rounded-lg">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize select-none ${
                        member.role === 'owner' 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/60' 
                          : member.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100/60'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200/40'
                      }`}>
                        {member.role}
                      </span>
                    )}
                  </TableCell>
                  
                  {isOwnerOrAdmin && (
                    <TableCell className="text-right pr-6">
                      {canManage ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setConfirmRemove({
                            open: true,
                            userId: member.user_id,
                            userName: member.display_name
                          })}
                          disabled={isActionPending}
                          className="hover:bg-red-50 hover:text-red-600 rounded-xl text-neutral-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <span className="text-xs text-neutral-300 font-semibold">—</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}

            {filteredInvites.map((invite) => {
              const displayName = invite.invitee_email || invite.invitee_hqid;
              return (
                <TableRow key={invite.id} className="border-b border-neutral-100/50 hover:bg-neutral-50/30 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm select-none">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-neutral-950 flex items-center gap-1.5">
                          <span>{displayName}</span>
                          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100/60 px-1.5 py-0.5 rounded-sm font-black uppercase">Pending</span>
                        </div>
                        <div className="text-xs text-neutral-400 font-semibold">Invited via {invite.invitee_email ? "Email" : "HQID"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-neutral-500 font-bold">
                    {invite.invitee_hqid ? `@${invite.invitee_hqid}` : "—"}
                  </TableCell>
                  <TableCell className="font-semibold text-neutral-500">
                    {new Date(invite.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize select-none bg-neutral-100 text-neutral-600 border border-neutral-200/40">
                      {invite.role}
                    </span>
                  </TableCell>
                  
                  {isOwnerOrAdmin && (
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setConfirmCancelInvite({
                          open: true,
                          inviteId: invite.id,
                          inviteName: displayName
                        })}
                        disabled={isActionPending}
                        className="hover:bg-red-50 hover:text-red-600 rounded-xl text-neutral-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmDeleteModal
        isOpen={confirmRemove.open}
        onClose={() => setConfirmRemove({ open: false, userId: "", userName: "" })}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        description={`Are you sure you want to remove "${confirmRemove.userName}" from this workspace? They will lose access to all collaborative pages and tasks.`}
        confirmText="Remove User"
        isLoading={isActionPending}
      />

      <ConfirmDeleteModal
        isOpen={confirmCancelInvite.open}
        onClose={() => setConfirmCancelInvite({ open: false, inviteId: "", inviteName: "" })}
        onConfirm={() => handleCancelInvite(confirmCancelInvite.inviteId)}
        title="Cancel Invitation"
        description={`Are you sure you want to cancel the invitation sent to "${confirmCancelInvite.inviteName}"? They will no longer be able to accept it and join.`}
        confirmText="Cancel Invite"
        isLoading={isActionPending}
      />

      {/* Invite Member Modal */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md border border-neutral-100 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <UserPlus className="w-5 h-5 animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-extrabold tracking-tight text-neutral-900">
              Invite Member
            </DialogTitle>
            <DialogDescription className="text-neutral-500 mt-2 font-medium">
              Invite collaborators to join "{workspace.name}"
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendInvite} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Invite Method</Label>
                <div className="flex gap-2 p-1 bg-neutral-100/60 border border-neutral-200/30 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setInviteMethod("email"); setInviteValue(""); }}
                    className={`w-full py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      inviteMethod === 'email' ? 'bg-white text-neutral-950 shadow-sm border border-neutral-200/40' : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInviteMethod("hqid"); setInviteValue(""); }}
                    className={`w-full py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      inviteMethod === 'hqid' ? 'bg-white text-neutral-950 shadow-sm border border-neutral-200/40' : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>HQID</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="members-invite-input" className="text-sm font-semibold text-neutral-700">
                  {inviteMethod === 'email' ? 'Email Address' : 'Invitee HQID'}
                </Label>
                <Input
                  id="members-invite-input"
                  value={inviteValue}
                  onChange={(e) => setInviteValue(e.target.value)}
                  placeholder={inviteMethod === 'email' ? 'colleague@example.com' : 'e.g. HQ-98A4X2'}
                  disabled={isInvitePending}
                  className="w-full rounded-xl border border-neutral-200/80 focus:border-indigo-500/50 bg-white/50 px-4 py-2.5 text-sm outline-hidden focus:ring-2 focus:ring-indigo-500/10 transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-neutral-700">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole} disabled={isInvitePending}>
                  <SelectTrigger className="w-full rounded-xl border border-neutral-200 bg-white/50 px-4 py-2.5 font-semibold text-sm outline-hidden cursor-pointer">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-neutral-100 bg-white shadow-lg">
                    <SelectItem value="member" className="font-semibold text-sm cursor-pointer rounded-lg">Member</SelectItem>
                    <SelectItem value="admin" className="font-semibold text-sm cursor-pointer rounded-lg">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isInvitePending}
                onClick={() => setIsInviteOpen(false)}
                className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-200/80 hover:bg-neutral-100 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all active:scale-[0.98] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isInvitePending}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isInvitePending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Inviting...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Invite</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
