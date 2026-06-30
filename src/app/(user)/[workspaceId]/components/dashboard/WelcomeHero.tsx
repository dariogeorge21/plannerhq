"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GetWorkspace, GetWorkspaceMembers } from "@/features/workspace/workspace";
import { GetUserProfileOverview } from "@/features/dashboard/services";
import { Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function WelcomeHeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 p-8 md:p-12 shadow-sm animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-pink-500/5 blur-3xl rounded-full -z-10" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl w-full">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-12 w-full md:w-3/4 rounded-lg" />
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
        <Skeleton className="shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-[2rem]" />
      </div>
    </div>
  );
}

export function WelcomeHero({ workspaceId }: { workspaceId: string }) {
  const { data: wsRes, isLoading: wsLoading } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => GetWorkspace(workspaceId)
  });
  const workspace = wsRes?.data;

  const { data: membersRes, isLoading: memLoading } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => GetWorkspaceMembers(workspaceId)
  });
  const members = membersRes?.data || [];

  const { data: profileRes, isLoading: profLoading } = useQuery({
    queryKey: ["userProfileOverview"],
    queryFn: () => GetUserProfileOverview()
  });
  const profile = profileRes?.data;

  const isLoading = wsLoading || memLoading || profLoading || !workspace || !profile;

  if (isLoading) {
    return <WelcomeHeroSkeleton />;
  }

  const nonOwnerMembers = members.filter(m => m.role !== 'owner');
  const adminCount = nonOwnerMembers.filter(m => m.role === 'admin').length;
  const memberCount = nonOwnerMembers.filter(m => m.role === 'member').length;
  const createdByMember = members.find(m => m.user_id === workspace.created_by);
  const createdByName = createdByMember ? createdByMember.display_name : "Unknown";

  return (
    <motion.section 
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[2rem] bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 p-8 md:p-12 shadow-xl shadow-indigo-500/5 dark:shadow-none"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full -z-10" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase border border-indigo-100 dark:border-indigo-800/50">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Welcome {profile.displayName} to {workspace.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Badge variant="outline" className="bg-white/60 dark:bg-black/60 shadow-sm border-neutral-200/60 dark:border-neutral-800 py-1">
              <Calendar className="w-3 h-3 mr-1.5 text-indigo-500" />
              Created {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(workspace.created_at))}
            </Badge>
            <Badge variant="outline" className="bg-white/60 dark:bg-black/60 shadow-sm border-neutral-200/60 dark:border-neutral-800 py-1">
              By <span className="font-semibold ml-1">{createdByName}</span>
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 py-1 border-indigo-200 dark:border-indigo-800">
              {adminCount} Admins, {memberCount} Members
            </Badge>
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white font-bold text-4xl md:text-5xl shadow-indigo-500/30">
          {workspace.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </motion.section>
  );
}
