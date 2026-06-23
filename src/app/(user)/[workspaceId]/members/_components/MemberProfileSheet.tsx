"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { WorkspaceMember, WorkspaceActivityLog } from "@/types/workspace";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Calendar, Activity, Mail, Fingerprint, ShieldAlert, CheckCircle2, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: WorkspaceMember | null;
  activities: WorkspaceActivityLog[];
  currentUserRole: string | null;
  onManageRole: (userId: string) => void;
}

export default function MemberProfileSheet({
  isOpen,
  onOpenChange,
  member,
  activities,
  currentUserRole,
  onManageRole
}: MemberProfileSheetProps) {
  if (!member) return null;

  const hasAdminPrivilege = currentUserRole === 'owner' || currentUserRole === 'admin';
  const memberActivities = activities.filter(a => a.user_id === member.user_id).slice(0, 5);

  const getActivityIcon = (type: string) => {
    if (type.includes("task")) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (type.includes("document") || type.includes("note")) return <FileText className="w-4 h-4 text-indigo-500" />;
    if (type.includes("chat") || type.includes("message")) return <MessageSquare className="w-4 h-4 text-amber-500" />;
    return <Activity className="w-4 h-4 text-neutral-400" />;
  };

  const formatActionType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-y-auto border-l border-neutral-200">
        {/* Cover & Avatar Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-10 left-6">
            {member.avatar_url ? (
              <img src={member.avatar_url} alt={member.display_name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-2xl">
                  {member.display_name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4">
             <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white shadow-sm ${
                member.role === 'owner' ? 'text-indigo-700' :
                member.role === 'admin' ? 'text-purple-700' :
                'text-neutral-600'
              }`}>
                {member.role === 'owner' && <ShieldAlert className="w-3 h-3 mr-1" />}
                {member.role === 'admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                {member.role}
              </span>
          </div>
        </div>

        <div className="px-6 pt-14 pb-6 border-b border-neutral-100">
          <SheetHeader>
            <SheetTitle className="text-2xl font-extrabold text-neutral-900 text-left">{member.display_name}</SheetTitle>
            <SheetDescription className="text-left flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-neutral-600 font-medium text-sm">
                <Mail className="w-4 h-4 text-neutral-400" />
                {member.email}
              </div>
              <div className="flex items-center gap-2 text-neutral-600 font-medium text-sm">
                <Fingerprint className="w-4 h-4 text-neutral-400" />
                <span className="font-mono text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500">{member.hqid}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 font-medium text-sm">
                <Calendar className="w-4 h-4 text-neutral-400" />
                Joined {new Date(member.joined_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </SheetDescription>
          </SheetHeader>
          
          {hasAdminPrivilege && member.role !== 'owner' && (
            <div className="mt-6 flex gap-3">
              <Button onClick={() => { onOpenChange(false); onManageRole(member.user_id); }} variant="outline" className="flex-1 rounded-xl font-semibold border-neutral-200">
                Manage Role
              </Button>
            </div>
          )}
        </div>

        {/* Activity Feed Section */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-neutral-400" /> Recent Activity
          </h3>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
            {memberActivities.length > 0 ? (
              memberActivities.map((activity) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-neutral-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                        {getActivityIcon(activity.action_type)}
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl border border-neutral-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-neutral-900 text-xs">{formatActionType(activity.action_type)}</div>
                            <time className="text-[10px] font-medium text-neutral-500">{new Date(activity.created_at).toLocaleDateString()}</time>
                        </div>
                        <div className="text-xs text-neutral-500">
                          {activity.entity_type} {activity.entity_id ? "updated" : ""}
                        </div>
                    </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-neutral-500">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
