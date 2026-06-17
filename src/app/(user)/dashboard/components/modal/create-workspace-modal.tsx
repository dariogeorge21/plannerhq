"use client";

import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateWorkspace } from "@/features/workspace/workspace";
import { toast } from "sonner";
import { Loader2, Box } from "lucide-react";

interface CreateWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateWorkspaceModal({ open, onOpenChange, onSuccess }: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceName", name);
      formData.append("workspaceDescription", description);

      const res = await CreateWorkspace(formData);
      if (res.success) {
        toast.success(res.message);
        setName("");
        setDescription("");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message || "Failed to create workspace");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-neutral-200/80 shadow-2xl rounded-2xl bg-white">
        <div className="px-8 pt-8 pb-6">
          <DialogHeader className="flex flex-col items-start text-left space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900">
                Create a new workspace
              </DialogTitle>
              <DialogDescription className="text-neutral-500 mt-1.5 text-sm">
                Workspaces are shared environments where teams collaborate on projects, tasks, and settings.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form id="create-workspace-form" onSubmit={handleSubmit} className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label htmlFor="ws-name" className="text-sm font-semibold text-neutral-900">
                Workspace Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ws-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                disabled={isPending}
                className="w-full rounded-xl border-neutral-200 bg-white px-4 py-2.5 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ws-desc" className="flex items-center justify-between text-sm font-semibold text-neutral-900">
                <span>Description</span>
                <span className="text-xs text-neutral-400 font-medium">Optional</span>
              </Label>
              <Textarea
                id="ws-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this workspace for?"
                disabled={isPending}
                className="w-full min-h-[100px] rounded-xl border-neutral-200 bg-white px-4 py-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all resize-none placeholder:text-neutral-400"
              />
            </div>
          </form>
        </div>

        <div className="px-8 py-5 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-workspace-form"
            disabled={isPending}
            className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 px-6 py-2.5 text-sm font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Workspace"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}