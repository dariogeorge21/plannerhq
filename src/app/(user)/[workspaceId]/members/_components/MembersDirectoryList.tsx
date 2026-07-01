"use client";

import React from "react";
import { WorkspaceMember } from "@/types/workspace";
import { ShieldCheck, MoreHorizontal, Trash2, Edit2, ShieldAlert, Users, Clock, X, Mail, Hash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MembersDirectoryListProps {
  members: WorkspaceMember[];
  invites?: any[];
  currentUserId: string;
  currentUserRole: string | null;
  onUpdateRole: (userId: string, newRole: string) => void;
  onRemoveMember: (userId: string) => void;
  onRevokeInvite?: (inviteId: string) => void;
  onViewProfile: (member: WorkspaceMember) => void;
}

export default function MembersDirectoryList({
  members,
  invites = [],
  currentUserId,
  currentUserRole,
  onUpdateRole,
  onRemoveMember,
  onRevokeInvite,
  onViewProfile
}: MembersDirectoryListProps) {
  const hasAdminPrivilege = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Header mapping semantic colors */}
      <div className="px-6 py-4 border-b border-border bg-muted/30 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-5 md:col-span-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Member</div>
        <div className="hidden md:block md:col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</div>
        <div className="hidden md:block md:col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</div>
        <div className="col-span-5 md:col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</div>
        <div className="col-span-2 md:col-span-1 text-right"></div>
      </div>

      <div className="divide-y divide-border">
        {members.map((member) => {
          const isSelf = member.user_id === currentUserId;
          const canManage = hasAdminPrivilege && !isSelf && member.role !== 'owner';

          return (
            <div key={member.user_id} className="px-6 py-3 grid grid-cols-12 gap-4 items-center hover:bg-muted/50 transition-colors group cursor-pointer" onClick={() => onViewProfile(member)}>
              {/* Avatar Section */}
              <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-border/50">
                    <AvatarImage src={member.avatar_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                         {member.display_name?.substring(0,2).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold text-foreground truncate flex items-center gap-2">
                    {member.display_name}
                    {isSelf && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 uppercase tracking-wider bg-muted text-muted-foreground">You</Badge>}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                </div>
              </div>

              {/* Status Section */}
              <div className="hidden md:flex md:col-span-2 items-center">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </div>
              </div>

              {/* Role Section */}
              <div className="hidden md:flex md:col-span-2 items-center">
                <Badge variant={member.role === 'admin' || member.role === 'owner' ? 'default' : 'secondary'} className="rounded-full px-2.5 py-0.5 shadow-sm capitalize">
                  {member.role === 'owner' && <ShieldAlert className="w-3 h-3 mr-1" />}
                  {member.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                  {member.role}
                </Badge>
              </div>

              {/* Joined Section */}
              <div className="col-span-5 md:col-span-3 text-sm font-medium text-muted-foreground flex items-center">
                {new Date(member.joined_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>

              {/* Actions Section - Only shows clearly on row hover for minimalism */}
              <div className="col-span-2 md:col-span-1 flex justify-end">
                {canManage ? (
                  <div onClick={(e) => e.stopPropagation()} className="opacity-50 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background shadow-sm border border-transparent hover:border-border">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                        <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Manage Role</div>
                        <DropdownMenuItem
                          onClick={() => onUpdateRole(member.user_id, 'admin')}
                          className="rounded-lg cursor-pointer font-medium mb-1"
                          disabled={member.role === 'admin'}
                        >
                          <ShieldCheck className="w-4 h-4 mr-2 text-primary" /> Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateRole(member.user_id, 'member')}
                          className="rounded-lg cursor-pointer font-medium"
                          disabled={member.role === 'member'}
                        >
                          <Edit2 className="w-4 h-4 mr-2 text-muted-foreground" /> Make Member
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 border-border" />
                        <DropdownMenuItem
                          onClick={() => onRemoveMember(member.user_id)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer font-bold"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            </div>
          );
        })}

        {invites.map((invite) => {
          const isEmail = !!invite.invitee_email;
          const target = isEmail ? invite.invitee_email : invite.invitee_hqid;
          
          return (
            <div key={invite.id} className="px-6 py-3 grid grid-cols-12 gap-4 items-center hover:bg-muted/50 transition-colors group">
              {/* Avatar Section */}
              <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  {isEmail ? <Mail className="w-4 h-4 text-amber-500" /> : <Hash className="w-4 h-4 text-amber-500" />}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold text-foreground truncate">{target}</span>
                  <span className="text-xs text-muted-foreground truncate">{isEmail ? "Invited via Email" : "Invited via HQID"}</span>
                </div>
              </div>

              {/* Status Section */}
              <div className="hidden md:flex md:col-span-2 items-center">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  Pending
                </div>
              </div>

              {/* Role Section */}
              <div className="hidden md:flex md:col-span-2 items-center">
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 shadow-sm capitalize border-dashed">
                  {invite.role}
                </Badge>
              </div>

              {/* Date Section */}
              <div className="col-span-5 md:col-span-3 text-sm font-medium text-muted-foreground flex items-center">
                {new Date(invite.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>

              {/* Actions Section */}
              <div className="col-span-2 md:col-span-1 flex justify-end">
                {hasAdminPrivilege && onRevokeInvite && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 xl:mr-1.5" /> <span className="hidden xl:inline">Revoke</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to revoke this invitation for <strong className="text-foreground">{target}</strong>? They will no longer be able to join the workspace using this invite.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onRevokeInvite(invite.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Revoke
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          );
        })}

        {members.length === 0 && invites.length === 0 && (
          <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No members found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">This workspace has no active members or pending invites.</p>
          </div>
        )}
      </div>
    </div>
  );
}
