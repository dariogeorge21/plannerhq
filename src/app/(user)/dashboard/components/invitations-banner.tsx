"use client";

import React, { useEffect, useState, useTransition } from "react";
import { ListInvitationsForUser, AcceptInvitation, DeclineInvitation } from "@/features/workspace/invites";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Check, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Invitation {
  id: string;
  workspace_id: string;
  inviter_id: string;
  invitee_hqid: string;
  invitee_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  expires_at: string;
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
        // Remove from list
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
        // Refresh page
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
        toast.success(res.message);
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      } else {
        toast.error(res.message || "Failed to decline invitation");
      }
    });
  };

  if (loading || invitations.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3 relative z-10">
      <AnimatePresence>
        {invitations.map((inv) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-full relative overflow-hidden rounded-2xl border border-indigo-100 bg-white/70 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-indigo-100/10 hover:shadow-indigo-100/20 transition-all"
          >
            {/* Background Accent Glow */}
            <div className="absolute top-0 right-0 w-32 h-full bg-indigo-50/20 rounded-l-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3.5 relative z-10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Users className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-neutral-950 tracking-tight">
                  Workspace Invitation Pending
                </h4>
                <p className="text-xs text-neutral-500 font-semibold mt-0.5">
                  You have been invited to join a collaborative workspace. Accept to start planning.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <Button
                variant="outline"
                size="sm"
                disabled={actionPending}
                onClick={() => handleDecline(inv.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-neutral-200/80 hover:bg-neutral-50 px-3.5 py-2 text-xs font-bold text-neutral-700 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-neutral-500" />
                <span>Decline</span>
              </Button>
              <Button
                size="sm"
                disabled={actionPending}
                onClick={() => handleAccept(inv.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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
  );
}
