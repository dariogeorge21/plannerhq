"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut,
  User as UserIcon,
  Mail,
  Hash,
  Sparkles,
  LayoutDashboard,
  Calendar,
  CheckSquare,
  FolderKanban,
  Settings,
  Bell,
  ArrowRight,
  TrendingUp,
  Clock,
  Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { signOut } from "@/api/auth";
import { deleteCookie } from "@/utils/session";
import { toast } from "sonner";

const ACTIVITY_COOKIE = "plannerhq_last_activity";

export default function DashboardPage() {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await signOut();
    setIsLoggingOut(false);
    router.push('/signin')

    if (res.success) {
      deleteCookie(ACTIVITY_COOKIE);
      toast.success("Successfully logged out!");
      router.push("/signin");
    } else {
      toast.error(res.message || "Failed to log out.");
    }
  };

  // Skeleton Loader for loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50/50 flex flex-col font-sans">
        <header className="h-20 border-b border-neutral-200/50 bg-white/70 backdrop-blur-md flex items-center justify-between px-8">
          <div className="h-8 w-32 bg-neutral-200 animate-pulse rounded-lg" />
          <div className="h-10 w-24 bg-neutral-200 animate-pulse rounded-full" />
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-6">
          <div className="h-12 w-64 bg-neutral-200 animate-pulse rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-neutral-200 animate-pulse rounded-2xl md:col-span-2" />
            <div className="h-48 bg-neutral-200 animate-pulse rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  // Double check user exists just in case redirect hasn't run yet
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50/30 text-neutral-900 font-sans flex flex-col selection:bg-indigo-500/30">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/50 bg-white/80 backdrop-blur-md shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white transition-transform group-hover:scale-105 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              <Image src="/logo.png" alt="PlannerHQ Logo" width={36} height={36} />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-indigo-600">
              PlannerHQ
            </span>
          </Link>

          {/* User Details & Logout */}
          <div className="flex items-center gap-6">
            {/* Quick Profile Summary */}
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div>
                <div className="text-sm font-bold text-neutral-950">{user.displayName}</div>
                <div className="text-xs text-neutral-400 font-medium">{user.email}</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center font-bold text-lg select-none">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-xs active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700" />
                  <span>Log Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 flex items-center gap-2">
              Welcome back, {user.displayName} <span className="animate-[wave_1.5s_infinite] origin-[70%_70%]">👋</span>
            </h1>
            <p className="text-neutral-500 mt-1.5 font-medium">
              Here's what is happening in your workspace today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-2 text-indigo-700 text-sm font-semibold w-fit"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>Free Starter Plan</span>
          </motion.div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Columns - Core Details */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: "Total Workspaces", count: "1 / 3", icon: FolderKanban, color: "text-blue-600 bg-blue-50" },
                { title: "Active Tasks", count: "0", icon: CheckSquare, color: "text-amber-600 bg-amber-50" },
                { title: "Calendar Events", count: "0", icon: Calendar, color: "text-emerald-600 bg-emerald-50" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className="bg-white rounded-2xl border border-neutral-200/50 p-6 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="space-y-1">
                    <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">{stat.title}</span>
                    <h3 className="text-2xl font-bold text-neutral-900">{stat.count}</h3>
                  </div>
                  <div className={`p-3.5 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Profile Information Panel */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-white rounded-3xl border border-neutral-200/50 p-8 shadow-xs flex flex-col gap-6"
            >
              <div>
                <h3 className="text-lg font-bold text-neutral-950">Your Security Profile</h3>
                <p className="text-sm text-neutral-400 mt-1 font-medium">Verify your profile metadata details linked to this session.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-center text-neutral-500">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-semibold">Full Name</span>
                    <p className="text-sm font-bold text-neutral-900">{user.displayName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-center text-neutral-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-semibold">Email Address</span>
                    <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-center text-neutral-500">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-semibold">Public HQID ID</span>
                    <p className="text-sm font-mono font-bold text-indigo-600">{user.hqid || "Not assigned"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-center text-neutral-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-semibold">Timezone</span>
                    <p className="text-sm font-bold text-neutral-900">{user.timezone}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Activity & Features */}
          <div className="flex flex-col gap-8">

            {/* Quick Actions Panel */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="bg-white rounded-3xl border border-neutral-200/50 p-6 shadow-xs flex flex-col gap-4"
            >
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight">Active Inactivity Guard</h3>
              <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100 p-4 flex gap-3 text-emerald-800">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 animate-ping flex-shrink-0" />
                <div className="text-xs leading-relaxed font-medium">
                  Your session is actively guarded. You will be automatically signed out after <strong>24 hours</strong> of complete inactivity.
                </div>
              </div>
              <div className="text-xs text-neutral-400 flex items-center gap-1.5 px-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-neutral-300" />
                <span>Timer resets on mouse moves, clicks & typing.</span>
              </div>
            </motion.div>

            {/* Launch Workspace card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-neutral-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 bg-indigo-600/30 rounded-full blur-[60px]" />
              <div className="relative z-10 flex flex-col justify-between h-full gap-8">
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold">Ready to start planning?</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                    Dive into your Notion-style pages and ClickUp-style project boards to boost your shipping speed.
                  </p>
                </div>
                <button
                  onClick={() => toast.info("Workspace features coming soon in upcoming sprint!")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 px-4 py-3 text-xs font-extrabold w-fit transition-all active:scale-[0.98] group cursor-pointer"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Global CSS for wave keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes wave {
          0% { transform: rotate( 0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate( 0.0deg) }
          100% { transform: rotate( 0.0deg) }
        }
      `}} />
    </div>
  );
}
