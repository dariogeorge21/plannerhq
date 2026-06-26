"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WorkspaceMember, WorkspaceActivityLog } from "@/types/workspace";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Mail, FileText, CheckCircle2, MessageSquare, Activity, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: WorkspaceMember | null;
  activities: WorkspaceActivityLog[];
  currentUserRole: string | null;
  onManageRole: (userId: string) => void;
}

export default function MemberProfileSheet({ isOpen, onOpenChange, member, activities, currentUserRole }: MemberProfileSheetProps) {
  if (!member) return null;

  const memberActivities = activities.filter(a => a.user_id === member.user_id).slice(0, 5);

  const getActivityIcon = (type: string) => {
    if (type.includes("task")) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (type.includes("document") || type.includes("note")) return <FileText className="w-4 h-4 text-blue-500" />;
    if (type.includes("chat") || type.includes("message")) return <MessageSquare className="w-4 h-4 text-purple-500" />;
    return <Activity className="w-4 h-4 text-muted-foreground" />;
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-border bg-background p-0 flex flex-col shadow-2xl">

        {/* Minimal Profile Header */}
        <div className="relative pt-12 pb-6 px-6 flex flex-col items-center border-b border-border bg-muted/10">
          <Avatar className="w-24 h-24 border-4 border-background shadow-md mb-4">
            <AvatarImage src={member.avatar_url || ""} />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {member.display_name ? getInitials(member.display_name) : <User className="w-10 h-10" />}
            </AvatarFallback>
          </Avatar>

          <SheetTitle className="text-2xl font-bold tracking-tight text-foreground text-center">
            {member.display_name || "Unknown User"}
          </SheetTitle>

          <Badge variant={member.role === 'admin' || member.role === 'owner' ? 'default' : 'secondary'} className="mt-2 rounded-full px-3 shadow-sm">
            {member.role === 'owner' && <ShieldCheck className="w-3 h-3 mr-1" />}
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </Badge>

          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground bg-background px-3 py-1.5 rounded-full border border-border shadow-sm">
            <Mail className="w-4 h-4" />
            <span className="truncate max-w-[200px]">{member.email}</span>
          </div>
        </div>

        {/* Clean Activity Timeline */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6">Recent Activity</h3>

          {memberActivities.length > 0 ? (
            <div className="relative border-l-2 border-border/50 ml-3 space-y-8 pb-4">
              {memberActivities.map((activity, idx) => (
                <div key={idx} className="relative pl-6">
                  {/* Timeline Node */}
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-sm">
                    {getActivityIcon(activity.action_type)}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {activity.action_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.entity_type} {activity.entity_id ? "updated" : ""}
                    </p>
                    <time className="text-[10px] font-semibold text-muted-foreground/60 mt-1">
                      {new Date(activity.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center">
              <Activity className="w-8 h-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No recent activity found.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}