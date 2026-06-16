"use client";

import React, { useEffect, useState, use } from "react";
import { GetWorkspace, GetWorkspaceMembers } from "@/features/workspace/workspace";
import { 
  Users, 
  Calendar, 
  Settings, 
  Sparkles, 
  FolderOpen, 
  CheckSquare, 
  ArrowRight,
  TrendingUp,
  Clock
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
      console.error(err);
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
      <div className="h-60 flex items-center justify-center">
        <Clock className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  // Find owner details
  const owner = members.find(m => m.role === 'owner');

  return (
    <div className="space-y-8 relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200/50 bg-white/70 backdrop-blur-md p-8 md:p-10 shadow-lg shadow-neutral-100/30">
        <div className="absolute top-0 right-0 w-48 h-full bg-linear-to-l from-indigo-50/30 to-transparent blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2 max-w-xl"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950">
              Welcome to {workspace.name} <span>🚀</span>
            </h1>
            <p className="text-sm text-neutral-500 font-medium leading-relaxed">
              {workspace.description || "Start collaborating, planning, and getting things done in this workspace."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-2 text-indigo-700 text-sm font-semibold w-fit"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Workspace Dashboard</span>
          </motion.div>
        </div>
      </section>

      {/* Workspace Quick Stats */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border-neutral-200/50 rounded-2xl bg-white/70 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Members</CardTitle>
            <Users className="w-4.5 h-4.5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-neutral-950 mt-1">{members.length}</div>
            <p className="text-xs text-neutral-400 mt-1 font-semibold">Collaborating in this space</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200/50 rounded-2xl bg-white/70 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Owner</CardTitle>
            <Sparkles className="w-4.5 h-4.5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-extrabold text-neutral-950 mt-2 truncate">
              {owner ? owner.display_name : "Unknown"}
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-semibold truncate">{owner ? owner.email : "—"}</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200/50 rounded-2xl bg-white/70 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">Created At</CardTitle>
            <Calendar className="w-4.5 h-4.5 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-extrabold text-neutral-950 mt-2">
              {new Date(workspace.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-semibold">Workspace foundation date</p>
          </CardContent>
        </Card>
      </section>

      {/* Grid: Members & Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Members preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-950">Workspace Members</h3>
            <Button asChild variant="ghost" size="sm" className="hover:bg-neutral-100 rounded-xl cursor-pointer">
              <Link href={`/${workspaceId}/members`} className="flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="border border-neutral-200/50 rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-sm space-y-4">
            <div className="divide-y divide-neutral-100">
              {members.slice(0, 4).map((member) => (
                <div key={member.user_id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm select-none">
                      {member.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-neutral-950">{member.display_name}</div>
                      <div className="text-xs text-neutral-400 font-semibold">{member.email}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black capitalize select-none ${
                    member.role === 'owner' 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/60' 
                      : member.role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border border-purple-100/60'
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200/40'
                  }`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-950">Quick Settings</h3>
          <div className="border border-neutral-200/50 rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-sm space-y-3">
            <Button asChild variant="outline" className="w-full justify-start rounded-xl cursor-pointer hover:bg-neutral-50 border-neutral-200/80">
              <Link href={`/${workspaceId}/settings`}>
                <Settings className="w-4 h-4 mr-2 text-neutral-500" />
                <span>Manage Workspace Info</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start rounded-xl cursor-pointer hover:bg-neutral-50 border-neutral-200/80">
              <Link href={`/${workspaceId}/members`}>
                <Users className="w-4 h-4 mr-2 text-neutral-500" />
                <span>Invite New Members</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start rounded-xl cursor-pointer hover:bg-neutral-50 border-neutral-200/80">
              <Link href="/dashboard">
                <FolderOpen className="w-4 h-4 mr-2 text-neutral-500" />
                <span>Switch Workspaces</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
