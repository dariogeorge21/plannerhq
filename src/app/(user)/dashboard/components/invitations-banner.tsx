"use client";

import React, { useEffect, useState, useTransition } from "react";
import { ListInvitationsForUser, AcceptInvitation, DeclineInvitation } from "@/features/workspace/invites";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Check, X, Mail } from "lucide-react";
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
        toast.success("Invitation rejected");
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      } else {
        toast.error(res.message || "Failed to reject invitation");
      }
    });
  };

  if (loading || invitations.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Mail className="w-4 h-4 text-indigo-500" />
        <h3 className="text-sm font-semibold tracking-tight text-neutral-700">
          Pending Invitations
        </h3>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {invitations.map((inv) => (
            <motion.div
              key={inv.id}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />

              <div className="flex items-center gap-4 pl-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 text-indigo-700 font-bold text-lg shadow-inner">
                  {inv.workspace_name.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-base font-semibold text-neutral-900 tracking-tight">
                      {inv.workspace_name}
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                      Role: {inv.role}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 font-medium line-clamp-1">
                    {inv.workspace_description || "You've been invited to collaborate on this workspace."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center pl-2 sm:pl-0">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actionPending}
                  onClick={() => handleDecline(inv.id)}
                  className="rounded-xl border-neutral-200 text-neutral-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors h-9 px-4"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  disabled={actionPending}
                  onClick={() => handleAccept(inv.id)}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all h-9 px-4"
                >
                  {actionPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  ) : (
                    <Check className="w-4 h-4 mr-1.5" />
                  )}
                  Accept Invite
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}