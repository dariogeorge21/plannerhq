// src/app/(user)/[workspaceId]/settings/page.tsx
"use client";

import React, { useEffect, useState, useTransition, use } from "react";
import { GetWorkspace, UpdateWorkspace, ArchieveWorkspace, GetWorkspaceMembers, LeaveWorkspace } from "@/features/workspace/workspace";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Settings,
  Archive,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Workspace, WorkspaceMember } from "@/types/workspace";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AvatarPicker } from "@/app/(user)/profile/components/ui/avatar-picker";

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUpdatePending, startUpdateTransition] = useTransition();

  // Archive state
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [isArchivePending, startArchiveTransition] = useTransition();

  // Leave state
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeavePending, startLeaveTransition] = useTransition();

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
          setAvatarUrl(wsRes.data.avatar_url || null);
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

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Workspace name required");

    startUpdateTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("workspaceName", name);
      formData.append("workspaceDescription", description);
      if (avatarUrl) {
          formData.append("avatarUrl", avatarUrl);
      }

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

  const handleLeaveWorkspace = () => {
    startLeaveTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      const res = await LeaveWorkspace(formData);

      if (res.success) {
        toast.success("You have left the workspace");
        router.push("/dashboard");
      } else {
        toast.error(res.message || "Failed to leave workspace");
        setShowLeaveConfirm(false);
      }
    });
  };

  if (loading || !workspace || !currentUserRole) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const canEdit = currentUserRole === 'owner' || currentUserRole === 'admin';
  const canArchive = currentUserRole === 'owner';
  const canLeave = currentUserRole === 'admin' || currentUserRole === 'member';

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-10 font-sans">
      <div>
        <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Workspace Settings</h1>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {currentUserRole}
            </span>
        </div>
        <p className="text-muted-foreground mt-2 font-medium">Manage your workspace preferences and settings.</p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <section className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="border-b border-border p-6 bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">General Information</h2>
            </div>
            {!canEdit && (
                <span className="text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">
                    Read-only (Owner or Admin required)
                </span>
            )}
          </div>
          <form onSubmit={handleUpdate} className="p-6 md:p-8 space-y-8">
            <div className={`mb-4 ${!canEdit ? 'pointer-events-none opacity-80' : ''}`}>
              <AvatarPicker 
                value={avatarUrl} 
                onChange={(url) => setAvatarUrl(url)} 
                displayName={name || workspace?.name || "?"}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label htmlFor="ws-name" className="text-sm font-semibold text-foreground">Workspace Name</Label>
                <Input
                    id="ws-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!canEdit || isUpdatePending}
                    className="w-full rounded-xl border-input focus-visible:ring-primary bg-background"
                />
                </div>
                
                <div className="space-y-2">
                <Label htmlFor="ws-slug" className="text-sm font-semibold text-foreground">Workspace Slug</Label>
                <Input
                    id="ws-slug"
                    value={workspace.slug}
                    readOnly
                    disabled
                    className="w-full rounded-xl border-input bg-muted text-muted-foreground cursor-not-allowed font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Unique identifier used in URLs.</p>
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ws-desc" className="text-sm font-semibold text-foreground">Description</Label>
              <Textarea
                id="ws-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!canEdit || isUpdatePending}
                className="max-w-xl min-h-[100px] rounded-xl border-input focus-visible:ring-primary resize-y bg-background"
              />
            </div>
            
            {canEdit && (
                <div className="pt-2">
                <Button type="submit" disabled={isUpdatePending} className="rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-sm h-10 px-6 transition-all active:scale-95">
                    {isUpdatePending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
                </Button>
                </div>
            )}
          </form>
        </section>

        {/* Member Actions */}
        {canLeave && (
            <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <LogOut className="w-5 h-5 text-muted-foreground" /> Leave Workspace
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium max-w-lg">
                    You will lose access to all notes, tasks, and files. You will need a new invitation to rejoin.
                    </p>
                </div>
                <Button variant="outline" onClick={() => setShowLeaveConfirm(true)} className="rounded-xl font-bold shadow-sm whitespace-nowrap hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border-border transition-colors">
                    Leave Workspace
                </Button>
                </div>
            </section>
        )}

        {/* Danger Zone */}
        {canArchive && (
          <section className="border border-destructive/30 bg-destructive/5 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-bold text-destructive flex items-center gap-2">
                  <Archive className="w-5 h-5" /> Danger Zone
                </h2>
                <p className="text-sm text-destructive/80 mt-1 font-medium max-w-lg">
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

      {/* Archive Confirm Modal */}
      <Dialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-border bg-card rounded-3xl">
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6 ring-8 ring-destructive/5">
              <Archive className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground tracking-tight">Archive Workspace?</DialogTitle>
            <DialogDescription className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Are you sure you want to archive <strong>"{workspace?.name}"</strong>? You can restore it later, but all active collaborations will be paused immediately.
            </DialogDescription>
          </div>
          <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
            <Button variant="outline" disabled={isArchivePending} onClick={() => setShowArchiveConfirm(false)} className="flex-1 rounded-xl border-border font-semibold bg-background hover:bg-accent transition-colors">
              Cancel
            </Button>
            <Button variant="destructive" disabled={isArchivePending} onClick={handleArchiveWorkspace} className="flex-1 rounded-xl font-semibold shadow-sm">
              {isArchivePending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Archive Space"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Confirm Modal */}
      <Dialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-border bg-card rounded-3xl">
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-accent text-muted-foreground rounded-full flex items-center justify-center mb-6 ring-8 ring-accent/50">
              <LogOut className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground tracking-tight">Leave Workspace?</DialogTitle>
            <DialogDescription className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Are you sure you want to leave <strong>"{workspace?.name}"</strong>? You will lose access to all its content immediately.
            </DialogDescription>
          </div>
          <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
            <Button variant="outline" disabled={isLeavePending} onClick={() => setShowLeaveConfirm(false)} className="flex-1 rounded-xl border-border font-semibold bg-background hover:bg-accent transition-colors">
              Cancel
            </Button>
            <Button variant="destructive" disabled={isLeavePending} onClick={handleLeaveWorkspace} className="flex-1 rounded-xl font-semibold shadow-sm">
              {isLeavePending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Leave Workspace"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}