"use client";

import React from "react";
import { WorkspaceMember } from "@/types/workspace";
import { ShieldCheck, MoreHorizontal, Trash2, Edit2, ShieldAlert, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MembersDirectoryListProps {
  members: WorkspaceMember[];
  currentUserId: string;
  currentUserRole: string | null;
  onUpdateRole: (userId: string, newRole: string) => void;
  onRemoveMember: (userId: string) => void;
  onViewProfile: (member: WorkspaceMember) => void;
}

export default function MembersDirectoryList({
  members,
  currentUserId,
  currentUserRole,
  onUpdateRole,
  onRemoveMember,
  onViewProfile
}: MembersDirectoryListProps) {
  const hasAdminPrivilege = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Header mapping semantic colors */}
      <div className="px-6 py-4 border-b border-border bg-muted/30 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 md:col-span-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Member</div>
        <div className="hidden md:block md:col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</div>
        <div className="col-span-4 md:col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Joined</div>
        <div className="col-span-2 md:col-span-1 text-right"></div>
      </div>

      <div className="divide-y divide-border">
        {members.map((member) => {
          const isSelf = member.user_id === currentUserId;
          const canManage = hasAdminPrivilege && !isSelf && member.role !== 'owner';

          return (
            <div key={member.user_id} className="px-6 py-3 grid grid-cols-12 gap-4 items-center hover:bg-muted/50 transition-colors group cursor-pointer" onClick={() => onViewProfile(member)}>
              {/* Avatar Section */}
              <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                <Avatar className="w-10 h-10">
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

              {/* Role Section */}
              <div className="hidden md:flex md:col-span-3 items-center">
                <Badge variant={member.role === 'admin' || member.role === 'owner' ? 'default' : 'secondary'} className="rounded-full px-2.5 py-0.5 shadow-sm">
                  {member.role === 'owner' && <ShieldAlert className="w-3 h-3 mr-1" />}
                  {member.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </Badge>
              </div>

              {/* Joined Section */}
              <div className="col-span-4 md:col-span-3 text-sm font-medium text-muted-foreground flex items-center">
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
        {members.length === 0 && (
          <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No members found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">This workspace has no active members yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
