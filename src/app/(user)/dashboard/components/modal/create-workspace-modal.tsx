"use client";

import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateWorkspace } from "@/features/workspace/workspace";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

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
      <DialogContent className="sm:max-w-[425px] border border-neutral-100 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden p-8">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-32 h-32 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-32 h-32 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-neutral-900">
            Create Workspace
          </DialogTitle>
          <DialogDescription className="text-neutral-500 mt-2 font-medium">
            Bring your team together in a shared collaborative space.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ws-name" className="text-sm font-semibold text-neutral-700">
                Workspace Name
              </Label>
              <Input
                id="ws-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Design, Personal Tasks"
                disabled={isPending}
                className="w-full rounded-xl border border-neutral-200/80 focus:border-indigo-500/50 bg-white/70 px-4 py-3 shadow-xs outline-hidden focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ws-desc" className="text-sm font-semibold text-neutral-700">
                Description <span className="text-xs text-neutral-400 font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="ws-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of your projects or team..."
                disabled={isPending}
                className="w-full min-h-[100px] rounded-xl border border-neutral-200/80 focus:border-indigo-500/50 bg-white/70 px-4 py-3 shadow-xs outline-hidden focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-200/80 hover:bg-neutral-100 hover:border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all active:scale-[0.98] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Space</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
