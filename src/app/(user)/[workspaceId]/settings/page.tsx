"use client";

import React, { useEffect, useState, useTransition, use } from "react";
import { GetWorkspace, UpdateWorkspace, ArchieveWorkspace, GetWorkspaceMembers } from "@/features/workspace/workspace";
import { 
  InviteUserToWorkspaceByHqid, 
  InviteUserToWorkspaceByEmail, 
  ListInvitationsForWorkspace, 
  DeclineInvitation 
} from "@/features/workspace/invites";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Loader2, 
  ShieldAlert, 
  Sparkles, 
  Settings, 
  UserPlus, 
  Archive, 
  Mail, 
  Hash, 
  Clock, 
  X,
  Lock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Workspace, WorkspaceMember } from "@/types/workspace";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type WorkspaceInviteItem = {
  id: string;
  invitee_email: string | null;
  invitee_hqid: string;
  role: 'owner' | 'admin' | 'member';
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  expires_at: string;
};

export default function WorkspaceSettingsPage({
  params: paramsPromise,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const params = use(paramsPromise);
  const workspaceId = params.workspaceId;
  const router = useRouter();
  const { user } = useSession();
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<WorkspaceInviteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [wsName, setWsName] = useState("");
  const [wsDescription, setWsDescription] = useState("");
  const [isUpdatePending, startUpdateTransition] = useTransition();

  // Invite states
  const [inviteMethod, setInviteMethod] = useState<"email" | "hqid">("email");
  const [inviteValue, setInviteValue] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isInvitePending, startInviteTransition] = useTransition();

  // Archive modal
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [isArchivePending, startArchiveTransition] = useTransition();

  const loadData = async () => {
    try {
      const [wsRes, memRes, inviteRes] = await Promise.all([
        GetWorkspace(workspaceId),
        GetWorkspaceMembers(workspaceId),
        ListInvitationsForWorkspace(workspaceId)
      ]);

      if (wsRes.success && wsRes.data) {
        setWorkspace(wsRes.data);
        setWsName(wsRes.data.name);
        setWsDescription(wsRes.data.description || "");
      }
      if (memRes.success && memRes.data) {
        setMembers(memRes.data);
      }
      if (inviteRes.success && inviteRes.data) {
        setPendingInvites(inviteRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load settings data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [workspaceId]);

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

  // Check user role
  const currentUserMembership = members.find(m => m.user_id === user.id);
  const isOwnerOrAdmin = currentUserMembership?.role === 'owner' || currentUserMembership?.role === 'admin';

  const handleUpdateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    startUpdateTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("workspaceName", wsName);
      formData.append("workspaceDescription", wsDescription);

      const res = await UpdateWorkspace(formData);
      if (res.success) {
        toast.success(res.message);
        // Reload details
        loadData();
      } else {
        toast.error(res.message || "Failed to update workspace details");
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
        // Reload invitations list
        const inviteRes = await ListInvitationsForWorkspace(workspaceId);
        if (inviteRes.success && inviteRes.data) {
          setPendingInvites(inviteRes.data);
        }
      } else {
        toast.error(res.message || "Failed to send invitation");
      }
    });
  };

  const handleCancelInvite = (inviteId: string) => {
    startInviteTransition(async () => {
      const formData = new FormData();
      formData.append("invitationId", inviteId);
      const res = await DeclineInvitation(formData);
      if (res.success) {
        toast.success("Invitation cancelled successfully");
        setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
      } else {
        toast.error(res.message || "Failed to cancel invitation");
      }
    });
  };

  const handleArchiveWorkspace = () => {
    startArchiveTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);

      const res = await ArchieveWorkspace(formData);
      if (res.success) {
        toast.success(res.message);
        router.push("/dashboard");
      } else {
        toast.error(res.message || "Failed to archive workspace");
      }
    });
  };

  if (!isOwnerOrAdmin) {
    return (
      <div className="max-w-md mx-auto py-12 text-center flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mb-6">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-extrabold text-neutral-900">Settings Restricted</h3>
        <p className="text-sm text-neutral-500 mt-2 font-medium leading-relaxed">
          Only workspace owners and administrators can configure details, send invitations, or archive this workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950">Workspace Settings</h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Configure profile details and invite collaborators.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: General Profile Settings */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-neutral-200/50 bg-white/70 backdrop-blur-md rounded-2xl shadow-xs overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-neutral-950">General Details</CardTitle>
              <CardDescription className="text-neutral-500">Edit workspace profile information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateWorkspace} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="settings-name" className="text-sm font-semibold text-neutral-700">Workspace Name</Label>
                    <Input
                      id="settings-name"
                      value={wsName}
                      onChange={(e) => setWsName(e.target.value)}
                      placeholder="Enter workspace name"
                      disabled={isUpdatePending}
                      className="w-full rounded-xl border border-neutral-200/80 focus:border-indigo-500/50 bg-white/50 px-4 py-3 outline-hidden focus:ring-2 focus:ring-indigo-500/10 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="settings-desc" className="text-sm font-semibold text-neutral-700">Description</Label>
                    <Textarea
                      id="settings-desc"
                      value={wsDescription}
                      onChange={(e) => setWsDescription(e.target.value)}
                      placeholder="Provide a description for your workspace"
                      disabled={isUpdatePending}
                      className="w-full min-h-[120px] rounded-xl border border-neutral-200/80 focus:border-indigo-500/50 bg-white/50 px-4 py-3 outline-hidden focus:ring-2 focus:ring-indigo-500/10 transition-all font-semibold resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdatePending}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {isUpdatePending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200/60 bg-red-50/20 backdrop-blur-md rounded-2xl shadow-xs overflow-hidden">
            <CardHeader className="border-b border-red-100/40 pb-5">
              <CardTitle className="text-lg font-bold text-red-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription className="text-red-700/70">Critical actions that affect workspace lifecycle.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-red-950">Archive Workspace</h4>
                  <p className="text-xs text-red-700/80 font-semibold leading-relaxed max-w-md">
                    Archiving suspends this workspace and all internal project links. This action can only be reversed by administrators.
                  </p>
                </div>
                <Button
                  onClick={() => setShowArchiveConfirm(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archive Space</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Inviting and pending invites */}
        <div className="space-y-8">
          <Card className="border-neutral-200/50 bg-white/70 backdrop-blur-md rounded-2xl shadow-xs overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-neutral-950">Invite Members</CardTitle>
              <CardDescription className="text-neutral-500">Add collaborators to join this workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSendInvite} className="space-y-4">
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
                  <Label htmlFor="invite-input" className="text-sm font-semibold text-neutral-700">
                    {inviteMethod === 'email' ? 'Email Address' : 'Invitee HQID'}
                  </Label>
                  <Input
                    id="invite-input"
                    value={inviteValue}
                    onChange={(e) => setInviteValue(e.target.value)}
                    placeholder={inviteMethod === 'email' ? 'colleague@example.com' : 'e.g. HQ-98A4X2'}
                    disabled={isInvitePending}
                    className="w-full rounded-xl border border-neutral-200/80 focus:border-indigo-500/50 bg-white/50 px-4 py-2 text-sm outline-hidden focus:ring-2 focus:ring-indigo-500/10 transition-all font-semibold"
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

                <Button
                  type="submit"
                  disabled={isInvitePending}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isInvitePending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Send Invite</span>
                    </>
                  )}
                </Button>
              </form>

              {/* Pending Invites List */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Invites ({pendingInvites.length})</span>
                </h4>

                {pendingInvites.length === 0 ? (
                  <p className="text-xs text-neutral-400 font-semibold italic text-center py-2 bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200/40">
                    No pending invites
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {pendingInvites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 rounded-xl border border-neutral-200/50 bg-white/50 hover:bg-white/80 transition-colors">
                        <div className="overflow-hidden pr-2">
                          <div className="text-xs font-bold text-neutral-900 truncate">
                            {invite.invitee_email || invite.invitee_hqid}
                          </div>
                          <span className="inline-flex text-[9px] font-black uppercase tracking-wider text-indigo-600 mt-0.5">
                            {invite.role}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleCancelInvite(invite.id)}
                          disabled={isInvitePending}
                          className="hover:bg-red-50 hover:text-red-600 text-neutral-400 rounded-lg cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Archive Confirmation Dialog */}
      <Dialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <DialogContent className="sm:max-w-md border border-neutral-100 bg-white/95 backdrop-blur-md rounded-3xl p-8 text-center flex flex-col items-center">
          <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
            <Archive className="w-6 h-6 animate-pulse" />
          </div>

          <DialogTitle className="text-xl font-extrabold text-neutral-900 tracking-tight">
            Confirm Workspace Archival
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-neutral-500 font-medium max-w-[280px] sm:max-w-none">
            Are you sure you want to archive "{workspace.name}"? This operation soft-deletes the workspace, and you will be redirected to the dashboard.
          </DialogDescription>

          <DialogFooter className="mt-8 flex w-full flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              disabled={isArchivePending}
              onClick={() => setShowArchiveConfirm(false)}
              className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-200/80 hover:bg-neutral-100 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all active:scale-[0.98] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={isArchivePending}
              onClick={handleArchiveWorkspace}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/10 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isArchivePending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Archiving...</span>
                </>
              ) : (
                <span>Archive Space</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
