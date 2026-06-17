// src/app/(user)/[workspaceId]/settings/page.tsx
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
import { toast } from "sonner";
import {
  Loader2,
  ShieldAlert,
  Settings,
  Archive,
  Mail,
  Hash,
  Clock,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Workspace, WorkspaceMember } from "@/types/workspace";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type WorkspaceInviteItem = {
  id: string;
  invitee_email: string | null;
  invitee_hqid: string | null;
  role: string;
  created_at: string;
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
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Update state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdatePending, startUpdateTransition] = useTransition();

  // Archive state
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [isArchivePending, startArchiveTransition] = useTransition();

  // Invites state
  const [pendingInvites, setPendingInvites] = useState<WorkspaceInviteItem[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wsRes, memRes] = await Promise.all([
          GetWorkspace(workspaceId),
          GetWorkspaceMembers(workspaceId)
        ]);

        if (wsRes.success && wsRes.data) {
          setWorkspace(wsRes.data);
          setName(wsRes.data.name);
          setDescription(wsRes.data.description || "");
        }

        if (memRes.success && memRes.data && user) {
          const currentMem = memRes.data.find((m: WorkspaceMember) => m.user_id === user.id);
          if (currentMem) setCurrentUserRole(currentMem.role);
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId, user]);

  const loadInvites = async () => {
    try {
      const res = await ListInvitationsForWorkspace(workspaceId);
      if (res.success && res.data) {
        setPendingInvites(res.data);
      }
    } finally {
      setInvitesLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserRole === 'owner' || currentUserRole === 'admin') {
      loadInvites();
    }
  }, [currentUserRole, workspaceId]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Workspace name required");

    startUpdateTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("workspaceName", name);
      formData.append("workspaceDescription", description);

      const res = await UpdateWorkspace(formData);
      if (res.success) toast.success(res.message);
      else toast.error(res.message || "Failed to update workspace");
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
        setShowArchiveConfirm(false);
      }
    });
  };

  const handleCancelInvite = async (inviteId: string) => {
    const formData = new FormData();
    formData.append("invitationId", inviteId);
    const res = await DeclineInvitation(formData);
    if (res.success) {
      toast.success("Invitation cancelled");
      setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
    } else {
      toast.error(res.message || "Failed to cancel invitation");
    }
  };

  if (loading || !workspace) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const hasPrivilege = currentUserRole === 'owner' || currentUserRole === 'admin';

  if (!hasPrivilege) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white border border-neutral-200/60 rounded-3xl text-center shadow-xl">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Insufficient Permissions</h2>
        <p className="text-neutral-500">Only Workspace Owners and Admins can access settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">Workspace Settings</h1>
        <p className="text-neutral-500 mt-2 font-medium">Manage your workspace preferences, pending invitations, and danger zone actions.</p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <section className="bg-white border border-neutral-200/60 rounded-3xl shadow-sm overflow-hidden">
          <div className="border-b border-neutral-100 p-6 bg-neutral-50/50 flex items-center gap-3">
            <Settings className="w-5 h-5 text-neutral-500" />
            <h2 className="text-lg font-bold text-neutral-900">General Information</h2>
          </div>
          <form onSubmit={handleUpdate} className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ws-name" className="text-sm font-semibold text-neutral-900">Workspace Name</Label>
              <Input
                id="ws-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isUpdatePending}
                className="max-w-md rounded-xl border-neutral-300 focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ws-desc" className="text-sm font-semibold text-neutral-900">Description</Label>
              <Textarea
                id="ws-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUpdatePending}
                className="max-w-xl min-h-[100px] rounded-xl border-neutral-300 focus-visible:ring-indigo-500 resize-y"
              />
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={isUpdatePending} className="rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold shadow-sm h-10 px-6">
                {isUpdatePending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </section>

        {/* Pending Invitations */}
        <section className="bg-white border border-neutral-200/60 rounded-3xl shadow-sm overflow-hidden">
          <div className="border-b border-neutral-100 p-6 bg-neutral-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-neutral-500" />
              <h2 className="text-lg font-bold text-neutral-900">Pending Invitations</h2>
            </div>
          </div>
          <div className="p-0">
            {invitesLoading ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-neutral-400" /></div>
            ) : pendingInvites.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-medium">No pending invitations.</div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {pendingInvites.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between p-4 px-6 hover:bg-neutral-50/50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-semibold text-neutral-900 flex items-center gap-2">
                        {inv.invitee_email ? <Mail className="w-4 h-4 text-neutral-400" /> : <Hash className="w-4 h-4 text-neutral-400" />}
                        {inv.invitee_email || inv.invitee_hqid}
                      </span>
                      <span className="text-xs text-neutral-500 font-medium mt-1">
                        Invited as <strong className="uppercase">{inv.role}</strong> on {new Date(inv.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCancelInvite(inv.id)} className="text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Danger Zone */}
        {currentUserRole === 'owner' && (
          <section className="border border-red-200 bg-red-50/30 rounded-3xl overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                  <Archive className="w-5 h-5" /> Danger Zone
                </h2>
                <p className="text-sm text-red-600/80 mt-1 font-medium max-w-lg">
                  Archiving this workspace will suspend all activities. Data will be preserved, but members will lose access.
                </p>
              </div>
              <Button variant="destructive" onClick={() => setShowArchiveConfirm(true)} className="rounded-xl font-bold shadow-sm whitespace-nowrap">
                Archive Workspace
              </Button>
            </div>
          </section>
        )}
      </div>

      <Dialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-neutral-200 rounded-3xl">
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50">
              <Archive className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-neutral-900 tracking-tight">Archive Workspace?</DialogTitle>
            <DialogDescription className="mt-3 text-neutral-500 text-sm leading-relaxed">
              Are you sure you want to archive <strong>"{workspace.name}"</strong>? You can restore it later, but all active collaborations will be paused immediately.
            </DialogDescription>
          </div>
          <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3">
            <Button variant="outline" disabled={isArchivePending} onClick={() => setShowArchiveConfirm(false)} className="flex-1 rounded-xl border-neutral-300 font-semibold">
              Cancel
            </Button>
            <Button variant="destructive" disabled={isArchivePending} onClick={handleArchiveWorkspace} className="flex-1 rounded-xl font-semibold shadow-sm">
              {isArchivePending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Archive Space"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}