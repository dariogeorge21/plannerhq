"use client";

import React from "react";
import { WorkspaceInvite } from "@/types/workspace";
import { Button } from "@/components/ui/button";
import { Clock, X, Mail, Hash, AlertCircle } from "lucide-react";

interface PendingInvitesListProps {
  invites: any[]; // The API returns an anonymous shape for workspace invites
  onRevoke: (inviteId: string) => void;
  currentUserRole: string | null;
}

export default function PendingInvitesList({
  invites,
  onRevoke,
  currentUserRole
}: PendingInvitesListProps) {
  const hasAdminPrivilege = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-border bg-muted/30 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 md:col-span-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Invitation Target</div>
        <div className="hidden md:block md:col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</div>
        <div className="col-span-4 md:col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Sent Date</div>
        <div className="col-span-2 md:col-span-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider"></div>
      </div>
      
      <div className="divide-y divide-border">
        {invites.map((invite) => {
          const isEmail = !!invite.invitee_email;
          const target = isEmail ? invite.invitee_email : invite.invitee_hqid;
          
          return (
            <div key={invite.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-muted/50 transition-colors group">
              <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  {isEmail ? <Mail className="w-4 h-4 text-amber-500" /> : <Hash className="w-4 h-4 text-amber-500" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground truncate max-w-[150px] sm:max-w-[250px]">{target}</span>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending Accept
                  </span>
                </div>
              </div>
              
              <div className="hidden md:flex md:col-span-2 items-center">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                  {invite.role}
                </span>
              </div>
              
              <div className="col-span-4 md:col-span-3 text-sm font-medium text-muted-foreground flex items-center">
                {new Date(invite.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              
              <div className="col-span-2 md:col-span-2 flex justify-end">
                {hasAdminPrivilege && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRevoke(invite.id)}
                    className="h-8 px-3 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 mr-1.5" /> Revoke
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {invites.length === 0 && (
          <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No pending invites</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">All invitations have been processed or you haven't sent any yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
