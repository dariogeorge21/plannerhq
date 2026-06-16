"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ListWorkspace, ArchieveWorkspace, LeaveWorkspace } from "@/features/workspace/workspace";
import { CreateWorkspaceModal } from "./modal/create-workspace-modal";
import { FileEdit, Trash2, Archive, Plus, LogOut, Loader2, ExternalLink, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type WorkspaceItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  created_by: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
};

export function WorkspacesList() {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionPending, startActionTransition] = useTransition();

  // Confirmation dialog state
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    type: 'archive' | 'leave';
    workspaceId: string;
    workspaceName: string;
  }>({
    open: false,
    type: 'archive',
    workspaceId: "",
    workspaceName: ""
  });

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await ListWorkspace();
      if (res.success && res.data) {
        setWorkspaces(res.data);
      } else {
        toast.error(res.message || "Failed to load workspaces");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const handleArchiveConfirm = () => {
    startActionTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", confirmState.workspaceId);

      const res = await ArchieveWorkspace(formData);
      if (res.success) {
        toast.success(res.message);
        setWorkspaces((prev) => prev.filter((ws) => ws.id !== confirmState.workspaceId));
        setConfirmState(prev => ({ ...prev, open: false }));
      } else {
        toast.error(res.message || "Failed to archive workspace");
      }
    });
  };

  const handleLeaveConfirm = () => {
    startActionTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", confirmState.workspaceId);

      const res = await LeaveWorkspace(formData);
      if (res.success) {
        toast.success(res.message);
        setWorkspaces((prev) => prev.filter((ws) => ws.id !== confirmState.workspaceId));
        setConfirmState(prev => ({ ...prev, open: false }));
      } else {
        toast.error(res.message || "Failed to leave workspace");
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-900">Workspaces</h2>
          <Button disabled><Plus className="w-4 h-4 mr-2" /> New Workspace</Button>
        </div>
        <div className="h-40 border border-neutral-100 bg-white/50 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-neutral-900">Your Workspaces</h2>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 px-4 py-2 text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Workspace
        </Button>
      </div>

      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-200/80 rounded-2xl bg-white/50 backdrop-blur-md text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-400 border border-neutral-100 mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">No workspaces found</h3>
          <p className="text-sm text-neutral-500 max-w-[280px] mt-1.5 mb-6 font-medium">
            Get started by creating your first workspace or accept pending invitations.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Workspace
          </Button>
        </div>
      ) : (
        <div className="border border-neutral-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md shadow-lg shadow-neutral-100/30">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="border-b border-neutral-100">
                <TableHead className="w-[80px] font-bold text-neutral-500 pl-6">S.No</TableHead>
                <TableHead className="font-bold text-neutral-500">Workspace Name</TableHead>
                <TableHead className="font-bold text-neutral-500">Role</TableHead>
                <TableHead className="font-bold text-neutral-500">Joined Date</TableHead>
                <TableHead className="text-right font-bold text-neutral-500 pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.map((ws, index) => (
                <TableRow key={ws.id} className="border-b border-neutral-100/50 hover:bg-neutral-50/30 transition-colors">
                  <TableCell className="font-semibold text-neutral-400 pl-6">{index + 1}</TableCell>
                  <TableCell className="font-extrabold text-neutral-950 hover:text-indigo-600 transition-colors">
                    <Link href={`/${ws.id}`} className="flex items-center gap-1.5 group">
                      <span>{ws.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize select-none ${
                      ws.role === 'owner' 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/60' 
                        : ws.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border border-purple-100/60'
                        : 'bg-neutral-100 text-neutral-600 border border-neutral-200/40'
                    }`}>
                      {ws.role}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-neutral-500">
                    {new Date(ws.joined_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1.5">
                      <Button asChild variant="ghost" size="icon-sm" className="hover:bg-neutral-100 rounded-xl cursor-pointer">
                        <Link href={`/${ws.id}`}>
                          <ExternalLink className="w-4 h-4 text-neutral-500" />
                        </Link>
                      </Button>
                      {(ws.role === 'owner' || ws.role === 'admin') ? (
                        <>
                          <Button asChild variant="ghost" size="icon-sm" className="hover:bg-neutral-100 rounded-xl cursor-pointer">
                            <Link href={`/${ws.id}/settings`}>
                              <FileEdit className="w-4 h-4 text-neutral-500" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            onClick={() => setConfirmState({
                              open: true,
                              type: 'archive',
                              workspaceId: ws.id,
                              workspaceName: ws.name
                            })}
                            className="hover:bg-red-50 hover:text-red-600 rounded-xl text-neutral-500 cursor-pointer"
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          onClick={() => setConfirmState({
                            open: true,
                            type: 'leave',
                            workspaceId: ws.id,
                            workspaceName: ws.name
                          })}
                          className="hover:bg-red-50 hover:text-red-600 rounded-xl text-neutral-500 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Workspace Creation Modal */}
      <CreateWorkspaceModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSuccess={loadWorkspaces}
      />

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmState.open} 
        onOpenChange={(open) => setConfirmState(prev => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md border border-neutral-100 bg-white/95 backdrop-blur-md rounded-3xl p-8 text-center flex flex-col items-center">
          <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
            <Archive className="w-6 h-6 animate-pulse" />
          </div>

          <DialogTitle className="text-xl font-extrabold text-neutral-900 tracking-tight">
            {confirmState.type === 'archive' ? 'Archive Workspace' : 'Leave Workspace'}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-neutral-500 font-medium max-w-[280px] sm:max-w-none">
            {confirmState.type === 'archive' 
              ? `Are you sure you want to archive "${confirmState.workspaceName}"? All collaborative projects and settings inside this workspace will be suspended.`
              : `Are you sure you want to leave "${confirmState.workspaceName}"? You will lose access to all sections and pages until invited back.`}
          </DialogDescription>

          <DialogFooter className="mt-8 flex w-full flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              disabled={actionPending}
              onClick={() => setConfirmState(prev => ({ ...prev, open: false }))}
              className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-200/80 hover:bg-neutral-100 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all active:scale-[0.98] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={actionPending}
              onClick={confirmState.type === 'archive' ? handleArchiveConfirm : handleLeaveConfirm}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/10 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {actionPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{confirmState.type === 'archive' ? 'Archive' : 'Leave'}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}