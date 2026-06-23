"use client";

import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Hash, Loader2, ShieldCheck, User } from "lucide-react";
import { InviteUserToWorkspaceByEmail, InviteUserToWorkspaceByHqid } from "@/features/workspace/invites";
import { toast } from "sonner";
import { LogWorkspaceActivity } from "@/features/workspace/activity";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onInviteSuccess: () => void;
}

export default function InviteMemberDialog({
  isOpen,
  onOpenChange,
  workspaceId,
  onInviteSuccess
}: InviteMemberDialogProps) {
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
      
      let res;
      if (inviteMethod === "email") {
        formData.append("email", inviteValue);
        res = await InviteUserToWorkspaceByEmail(formData);
      } else {
        formData.append("hqid", inviteValue);
        res = await InviteUserToWorkspaceByHqid(formData);
      }

      if (res.success) {
        toast.success(res.message);
        
        // Log the activity
        await LogWorkspaceActivity(
          workspaceId, 
          'invited_user', 
          'user', 
          null, 
          { target: inviteValue, role: inviteRole, method: inviteMethod }
        );

        setInviteValue("");
        setInviteRole("member");
        onOpenChange(false);
        onInviteSuccess();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-neutral-200 rounded-3xl shadow-2xl">
        <div className="p-6 md:p-8 pb-4 bg-white">
          <DialogTitle className="text-xl font-extrabold text-neutral-900">Invite Team Member</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-neutral-500 font-medium">
            Bring someone into the workspace to start collaborating on tasks and documents.
          </DialogDescription>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white">
          <div className="px-6 md:px-8 pb-8 space-y-6">
            
            {/* Invite Method Toggle */}
            <div className="bg-neutral-100 p-1 rounded-xl flex">
              <button 
                type="button" 
                onClick={() => setInviteMethod("email")} 
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${inviteMethod === 'email' ? 'bg-white shadow-sm text-indigo-700' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                <Mail className="w-4 h-4" /> Email Address
              </button>
              <button 
                type="button" 
                onClick={() => setInviteMethod("hqid")} 
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${inviteMethod === 'hqid' ? 'bg-white shadow-sm text-indigo-700' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                <Hash className="w-4 h-4" /> PlannerHQ ID
              </button>
            </div>

            {/* Input Field */}
            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {inviteMethod === "email" ? "Enter Email Address" : "Enter User HQID"}
              </Label>
              <div className="relative">
                {inviteMethod === "email" ? 
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" /> : 
                  <Hash className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                }
                <Input 
                  value={inviteValue} 
                  onChange={e => setInviteValue(e.target.value)} 
                  placeholder={inviteMethod === "email" ? "colleague@acme.com" : "HQ-XXXX-XXXX"} 
                  className="pl-10 h-10 rounded-xl border-neutral-300 focus-visible:ring-indigo-500 bg-neutral-50/50" 
                  disabled={isPending} 
                  autoFocus
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Assign Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => !isPending && setInviteRole('member')}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${inviteRole === 'member' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-neutral-200 hover:border-neutral-300 bg-white'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className={`w-4 h-4 ${inviteRole === 'member' ? 'text-indigo-600' : 'text-neutral-500'}`} />
                    <span className={`font-bold text-sm ${inviteRole === 'member' ? 'text-indigo-900' : 'text-neutral-700'}`}>Member</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-2">Standard access. Can view, create, and collaborate.</p>
                </div>
                
                <div 
                  onClick={() => !isPending && setInviteRole('admin')}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${inviteRole === 'admin' ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600' : 'border-neutral-200 hover:border-neutral-300 bg-white'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className={`w-4 h-4 ${inviteRole === 'admin' ? 'text-purple-600' : 'text-neutral-500'}`} />
                    <span className={`font-bold text-sm ${inviteRole === 'admin' ? 'text-purple-900' : 'text-neutral-700'}`}>Admin</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-2">Full access. Can manage members and settings.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isPending} 
              className="flex-1 rounded-xl border-neutral-300 font-semibold h-10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending} 
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm h-10"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
