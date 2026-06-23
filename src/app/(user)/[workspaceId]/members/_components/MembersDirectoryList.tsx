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
    <div className="bg-white border border-neutral-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 md:col-span-5 text-xs font-bold text-neutral-500 uppercase tracking-wider">Member</div>
        <div className="hidden md:block md:col-span-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Role</div>
        <div className="col-span-4 md:col-span-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Joined</div>
        <div className="col-span-2 md:col-span-1 text-right text-xs font-bold text-neutral-500 uppercase tracking-wider"></div>
      </div>

      <div className="divide-y divide-neutral-100">
        {members.map((member) => {
          const isSelf = member.user_id === currentUserId;
          const canManage = hasAdminPrivilege && !isSelf && member.role !== 'owner';

          return (
            <div
              key={member.user_id}
              className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-neutral-50/50 transition-colors group cursor-pointer"
              onClick={() => onViewProfile(member)}
            >
              <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                <div className="relative">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.display_name} className="w-10 h-10 rounded-full object-cover border border-neutral-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {member.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Status Indicator (Mocked online status) */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-neutral-900 flex items-center gap-2">
                    {member.display_name}
                    {isSelf && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 uppercase tracking-wider bg-neutral-100 text-neutral-600">You</Badge>}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium truncate max-w-[150px] sm:max-w-[200px]">{member.email}</span>
                </div>
              </div>

              <div className="hidden md:flex md:col-span-3 items-center">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${member.role === 'owner' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    member.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-neutral-50 text-neutral-600 border-neutral-200'
                  }`}>
                  {member.role === 'owner' && <ShieldAlert className="w-3 h-3 mr-1" />}
                  {member.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                  {member.role}
                </span>
              </div>

              <div className="col-span-4 md:col-span-3 text-sm font-medium text-neutral-500 flex items-center">
                {new Date(member.joined_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>

              <div className="col-span-2 md:col-span-1 flex justify-end">
                {canManage ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-400 hover:text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-xl border-neutral-200/60">
                        <div className="px-2 py-1.5 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Manage Role</div>
                        <DropdownMenuItem
                          onClick={() => onUpdateRole(member.user_id, 'admin')}
                          className="rounded-lg cursor-pointer font-medium mb-1"
                          disabled={member.role === 'admin'}
                        >
                          <ShieldCheck className="w-4 h-4 mr-2 text-purple-600" /> Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateRole(member.user_id, 'member')}
                          className="rounded-lg cursor-pointer font-medium"
                          disabled={member.role === 'member'}
                        >
                          <Edit2 className="w-4 h-4 mr-2 text-neutral-500" /> Make Member
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 border-neutral-100" />
                        <DropdownMenuItem
                          onClick={() => onRemoveMember(member.user_id)}
                          className="text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg cursor-pointer font-bold"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="w-8 h-8" /> /* Placeholder to maintain layout */
                )}
              </div>
            </div>
          );
        })}
        {members.length === 0 && (
          <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">No members found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm">This workspace has no active members yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
