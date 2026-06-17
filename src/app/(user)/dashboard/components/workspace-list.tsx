"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ListWorkspace, ArchieveWorkspace, LeaveWorkspace, WorkspaceListItem } from "@/features/workspace/workspace";
import { CreateWorkspaceModal } from "./modal/create-workspace-modal";
import {
  FileEdit,
  Archive,
  Plus,
  LogOut,
  Loader2,
  ExternalLink,
  Building2,
  Users2,
  AlertTriangle,
  FolderOpen
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmState = {
  open: boolean;
  type: "archive" | "leave";
  workspaceId: string;
  workspaceName: string;
};

function RoleBadge({ role }: { role: WorkspaceListItem["role"] }) {
  const styles: Record<WorkspaceListItem["role"], string> = {
    owner: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    admin: "bg-purple-50 text-purple-700 border-purple-200/60",
    member: "bg-neutral-100 text-neutral-600 border-neutral-200/60",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-[11px] font-bold uppercase tracking-wider ${styles[role]}`}>
      {role}
    </span>
  );
}

interface WorkspaceTableProps {
  workspaces: WorkspaceListItem[];
  onArchive: (ws: WorkspaceListItem) => void;
  onLeave: (ws: WorkspaceListItem) => void;
}

function WorkspaceTable({ workspaces, onArchive, onLeave }: WorkspaceTableProps) {
  return (
    <div className="border border-neutral-200/60 rounded-2xl overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-neutral-50/80">
          <TableRow className="border-b border-neutral-200/60 hover:bg-transparent">
            <TableHead className="w-[60px] font-semibold text-neutral-500 pl-6 text-xs uppercase tracking-wider">#</TableHead>
            <TableHead className="font-semibold text-neutral-500 text-xs uppercase tracking-wider">Workspace</TableHead>
            <TableHead className="font-semibold text-neutral-500 text-xs uppercase tracking-wider">Access Level</TableHead>
            <TableHead className="font-semibold text-neutral-500 text-xs uppercase tracking-wider">Joined</TableHead>
            <TableHead className="text-right font-semibold text-neutral-500 pr-6 text-xs uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaces.map((ws, index) => (
            <TableRow key={ws.id} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors group">
              <TableCell className="font-medium text-neutral-400 pl-6 text-sm">{index + 1}</TableCell>
              <TableCell>
                <Link href={`/${ws.id}`} className="flex items-center gap-3 w-fit">
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-700">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                    {ws.name}
                  </span>
                </Link>
              </TableCell>
              <TableCell><RoleBadge role={ws.role} /></TableCell>
              <TableCell className="text-sm font-medium text-neutral-500">
                {new Date(ws.joined_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                  <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg border-neutral-200">
                    <Link href={`/${ws.id}`}>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
                    </Link>
                  </Button>
                  {ws.role === "owner" || ws.role === "admin" ? (
                    <>
                      <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg border-neutral-200">
                        <Link href={`/${ws.id}/settings`}>
                          <FileEdit className="w-3.5 h-3.5 text-neutral-600" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onArchive(ws)} className="h-8 w-8 p-0 rounded-lg border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                        <Archive className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => onLeave(ws)} className="h-8 w-8 p-0 rounded-lg border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                      <LogOut className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function WorkspacesList() {
  const [owned, setOwned] = useState<WorkspaceListItem[]>([]);
  const [joined, setJoined] = useState<WorkspaceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionPending, startActionTransition] = useTransition();
  const [confirmState, setConfirmState] = useState<ConfirmState>({ open: false, type: "archive", workspaceId: "", workspaceName: "" });

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await ListWorkspace();
      if (res.success && res.data) {
        setOwned(res.data.owned);
        setJoined(res.data.joined);
      } else {
        toast.error(res.message || "Failed to load workspaces");
      }
    } catch (err) {
      toast.error("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWorkspaces(); }, []);

  const openArchive = (ws: WorkspaceListItem) => setConfirmState({ open: true, type: "archive", workspaceId: ws.id, workspaceName: ws.name });
  const openLeave = (ws: WorkspaceListItem) => setConfirmState({ open: true, type: "leave", workspaceId: ws.id, workspaceName: ws.name });

  const handleConfirm = () => {
    startActionTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", confirmState.workspaceId);
      
      const action = confirmState.type === "archive" ? ArchieveWorkspace : LeaveWorkspace;
      const res = await action(formData);
      
      if (res.success) {
        toast.success(res.message);
        if (confirmState.type === "archive") setOwned((prev) => prev.filter((ws) => ws.id !== confirmState.workspaceId));
        else setJoined((prev) => prev.filter((ws) => ws.id !== confirmState.workspaceId));
        setConfirmState((prev) => ({ ...prev, open: false }));
      } else {
        toast.error(res.message || `Failed to ${confirmState.type} workspace`);
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-neutral-200 animate-pulse rounded-md" />
          <div className="h-9 w-36 bg-neutral-200 animate-pulse rounded-xl" />
        </div>
        <div className="h-[200px] border border-neutral-200 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-neutral-300" />
        </div>
      </div>
    );
  }

  const hasNoWorkspaces = owned.length === 0 && joined.length === 0;

  return (
    <div className="space-y-12">
      <section className="space-y-5">
        <div className="flex items-end justify-between border-b border-neutral-200/60 pb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-neutral-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-neutral-500" />
              My Workspaces
            </h2>
            <p className="text-sm text-neutral-500 mt-1">Workspaces you manage and control.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold shadow-sm transition-all h-9 px-4">
            <Plus className="w-4 h-4 mr-1.5" /> Create Workspace
          </Button>
        </div>

        {owned.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-neutral-200/80 rounded-2xl bg-neutral-50/50">
            <div className="h-12 w-12 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center mb-4">
              <FolderOpen className="w-5 h-5 text-neutral-400" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">No workspaces found</h3>
            <p className="text-sm text-neutral-500 mt-1 mb-6 text-center max-w-[280px]">
              Get started by creating a new workspace for your team or personal projects.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-xl bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50 shadow-sm font-semibold h-9 px-5">
              Create your first workspace
            </Button>
          </div>
        ) : (
          <WorkspaceTable workspaces={owned} onArchive={openArchive} onLeave={openLeave} />
        )}
      </section>

      {joined.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-end justify-between border-b border-neutral-200/60 pb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 flex items-center gap-2">
                <Users2 className="w-5 h-5 text-neutral-500" />
                Joined Workspaces
              </h2>
              <p className="text-sm text-neutral-500 mt-1">Workspaces you participate in as a collaborator.</p>
            </div>
          </div>
          <WorkspaceTable workspaces={joined} onArchive={openArchive} onLeave={openLeave} />
        </section>
      )}

      <CreateWorkspaceModal open={isModalOpen} onOpenChange={setIsModalOpen} onSuccess={loadWorkspaces} />

      <Dialog open={confirmState.open} onOpenChange={(open) => setConfirmState(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-neutral-200/80 shadow-2xl rounded-2xl bg-white">
            <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4 ring-8 ring-red-50/50">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <DialogTitle className="text-lg font-bold text-neutral-900">
                    {confirmState.type === "archive" ? "Archive Workspace" : "Leave Workspace"}
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    {confirmState.type === "archive"
                        ? `Are you sure you want to archive "${confirmState.workspaceName}"? All data will be preserved but access will be suspended.`
                        : `Are you sure you want to leave "${confirmState.workspaceName}"? You will lose access immediately.`}
                </DialogDescription>
            </div>
            <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex gap-3">
                <Button variant="outline" disabled={actionPending} onClick={() => setConfirmState(prev => ({ ...prev, open: false }))} className="flex-1 rounded-xl font-semibold border-neutral-200">
                    Cancel
                </Button>
                <Button disabled={actionPending} onClick={handleConfirm} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm">
                    {actionPending ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmState.type === "archive" ? "Archive" : "Leave"}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}