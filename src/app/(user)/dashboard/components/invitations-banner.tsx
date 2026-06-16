"use client";

import React, { useEffect, useState, useTransition } from "react";
import { ListInvitationsForUser, AcceptInvitation, DeclineInvitation } from "@/features/workspace/invites";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Check, X, Mail, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Invitation {
  id: string;
  role: string;
  created_at: string;
  workspace_name: string;
  workspace_description: string | null;
}

export function InvitationsBanner() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionPending, startActionTransition] = useTransition();

  const fetchInvitations = async () => {
    try {
      const res = await ListInvitationsForUser();
      if (res.success && res.data) {

        setInvitations(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch invitations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = (invitationId: string) => {
    startActionTransition(async () => {
      const formData = new FormData();
      formData.append("invitationId", invitationId);

      const res = await AcceptInvitation(formData);
      if (res.success) {
        toast.success(res.message);
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
        window.location.reload();
      } else {
        toast.error(res.message || "Failed to accept invitation");
      }
    });
  };

  const handleDecline = (invitationId: string) => {
    startActionTransition(async () => {
      const formData = new FormData();
      formData.append("invitationId", invitationId);

      const res = await DeclineInvitation(formData);
      if (res.success) {
        toast.success("Invitation rejected successfully");
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      } else {
        toast.error(res.message || "Failed to reject invitation");
      }
    });
  };

  if (loading || invitations.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4 relative z-10">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100/60">
          <Mail className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-400">
          Workspace Invitations
        </h3>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {invitations.map((inv) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white/70 backdrop-blur-md px-6 py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md shadow-neutral-100/10 hover:shadow-neutral-100/20 transition-all"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-full bg-indigo-50/10 rounded-l-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 font-bold text-lg select-none">
                  {inv.workspace_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-neutral-950 tracking-tight">
                      {inv.workspace_name}
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/60">
                      As {inv.role}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-semibold mt-1">
                    {inv.workspace_description || "You've been invited to collaborate in this workspace."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 relative z-10 sm:self-center">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={actionPending}
                  onClick={() => handleDecline(inv.id)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl hover:bg-red-50 hover:text-red-600 text-neutral-500 px-4 py-2 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </Button>
                <Button
                  size="sm"
                  disabled={actionPending}
                  onClick={() => handleAccept(inv.id)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {actionPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Accept</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
