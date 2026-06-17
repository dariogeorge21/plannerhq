// src/app/(user)/[workspaceId]/page.tsx
"use client";

import React, { useEffect, useState, use } from "react";
import { GetWorkspace, GetWorkspaceMembers } from "@/features/workspace/workspace";
import {
  Users,
  Calendar,
  Settings,
  Sparkles,
  FolderOpen,
  ArrowRight,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Workspace, WorkspaceMember } from "@/types/workspace";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function WorkspacePage({
  params: paramsPromise,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const params = use(paramsPromise);
  const workspaceId = params.workspaceId;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDetails = async () => {
    try {
      const [wsRes, memRes] = await Promise.all([
        GetWorkspace(workspaceId),
        GetWorkspaceMembers(workspaceId)
      ]);

      if (wsRes.success && wsRes.data) {
        setWorkspace(wsRes.data);
      }
      if (memRes.success && memRes.data) {
        setMembers(memRes.data);
      }
    } catch (err) {
      toast.error("Failed to load workspace information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [workspaceId]);

  if (loading || !workspace) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const owner = members.find(m => m.role === 'owner');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10 relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2rem] bg-white border border-neutral-200/60 p-8 md:p-12 shadow-xl shadow-neutral-200/20"
      >
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase border border-indigo-100/50">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
              Welcome to {workspace.name}
            </h1>
            <p className="text-base text-neutral-500 font-medium leading-relaxed max-w-xl">
              {workspace.description || "Start collaborating, planning, and executing your projects within this shared environment."}
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white font-bold text-4xl md:text-5xl shadow-indigo-500/20">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <motion.section variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Total Members", icon: Users, value: members.length, desc: "Collaborators in space", color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Workspace Owner", icon: ShieldCheck, value: owner ? owner.display_name.split(' ')[0] : "Unknown", desc: owner?.email || "—", color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Created On", icon: Calendar, value: new Date(workspace.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }), desc: "Workspace foundation", color: "text-purple-600", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="border-neutral-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden group bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">{stat.title}</CardTitle>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold tracking-tight text-neutral-900 truncate">{stat.value}</div>
                <p className="text-sm text-neutral-500 mt-1 font-medium truncate">{stat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Members List */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
            <h3 className="text-lg font-bold text-neutral-900">Recent Members</h3>
            <Button asChild variant="ghost" size="sm" className="hover:bg-neutral-100 text-neutral-600 rounded-lg">
              <Link href={`/${workspaceId}/members`} className="flex items-center gap-1.5">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="bg-white border border-neutral-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-neutral-100">
              {members.slice(0, 5).map((member) => (
                <div key={member.user_id} className="flex items-center justify-between p-4 hover:bg-neutral-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-neutral-100 to-neutral-200 border border-neutral-300/50 flex items-center justify-center font-bold text-sm text-neutral-700 shadow-inner">
                      {member.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">{member.display_name}</div>
                      <div className="text-xs text-neutral-500 font-medium">{member.email}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${member.role === 'owner' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    member.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-neutral-50 text-neutral-600 border-neutral-200'
                    }`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links / Actions */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
            <h3 className="text-lg font-bold text-neutral-900">Quick Actions</h3>
          </div>
          <div className="grid gap-3">
            <Link href={`/${workspaceId}/settings`} className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/60 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Settings className="w-5 h-5 text-neutral-600 group-hover:text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-neutral-900">Workspace Settings</div>
                <div className="text-xs text-neutral-500 font-medium">Manage details & preferences</div>
              </div>
            </Link>

            <Link href={`/${workspaceId}/members`} className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/60 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Users className="w-5 h-5 text-neutral-600 group-hover:text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-neutral-900">Invite Members</div>
                <div className="text-xs text-neutral-500 font-medium">Grow your workspace team</div>
              </div>
            </Link>

            <Link href="/dashboard" className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200/60 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <FolderOpen className="w-5 h-5 text-neutral-600 group-hover:text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-neutral-900">Switch Workspace</div>
                <div className="text-xs text-neutral-500 font-medium">Return to main dashboard</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}