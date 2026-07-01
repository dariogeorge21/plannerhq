"use client";

import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, Hash, Loader2, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { InviteUserToWorkspaceByEmail, InviteUserToWorkspaceByHqid } from "@/features/workspace/invites";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onInviteSuccess: () => void;
}

export default function InviteMemberDialog({ isOpen, onOpenChange, workspaceId, onInviteSuccess }: InviteMemberDialogProps) {
  const [inviteMethod, setInviteMethod] = useState<"email" | "hqid">("email");
  const [inviteValue, setInviteValue] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteValue.trim()) {
      toast.error("Please enter an email or HQID");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("inviteType", inviteRole);

      let result;
      if (inviteMethod === "email") {
        formData.append("email", inviteValue);
        result = await InviteUserToWorkspaceByEmail(formData);
      } else {
        formData.append("hqid", inviteValue);
        result = await InviteUserToWorkspaceByHqid(formData);
      }

      if (result.success) {
        toast.success(result.message || "Invitation sent successfully!");
        onInviteSuccess();
        onOpenChange(false);
        setInviteValue("");
      } else {
        toast.error(result.message || "Failed to send invitation");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-background border-border shadow-2xl rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">Invite to Workspace</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Bring your team members on board to collaborate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-6">
            <Tabs defaultValue="email" onValueChange={(v) => setInviteMethod(v as "email" | "hqid")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="email" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">Email Address</TabsTrigger>
                <TabsTrigger value="hqid" className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">HQID</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="colleague@company.com"
                      type="email"
                      className="pl-9 h-11 rounded-xl bg-background border-border focus-visible:ring-primary/20"
                      value={inviteMethod === "email" ? inviteValue : ""}
                      onChange={(e) => setInviteValue(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hqid" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="hqid" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HQID</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="hqid"
                      placeholder="e.g. USER-8A9X"
                      className="pl-9 h-11 rounded-xl bg-background border-border focus-visible:ring-primary/20 uppercase"
                      value={inviteMethod === "hqid" ? inviteValue : ""}
                      onChange={(e) => setInviteValue(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workspace Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setInviteRole('member')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${inviteRole === 'member' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-card hover:border-muted-foreground/30'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className={`w-4 h-4 ${inviteRole === 'member' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-semibold text-sm ${inviteRole === 'member' ? 'text-primary' : 'text-foreground'}`}>Member</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Standard access to workspace features.</p>
                </div>

                <div
                  onClick={() => setInviteRole('admin')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${inviteRole === 'admin' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-card hover:border-muted-foreground/30'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className={`w-4 h-4 ${inviteRole === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-semibold text-sm ${inviteRole === 'admin' ? 'text-primary' : 'text-foreground'}`}>Admin</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Full access to manage members.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border flex sm:justify-between gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending} className="rounded-xl w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-xl w-full sm:w-auto shadow-sm">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}