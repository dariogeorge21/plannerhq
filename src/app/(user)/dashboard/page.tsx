"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, Loader2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { signOut } from "@/app/api/auth";
import { deleteCookie } from "@/utils/session";
import { toast } from "sonner";
import { KpiMetrics } from "./components/kpi";
import { WorkspacesList } from "./components/workspace-list";
import { InvitationsBanner } from "./components/invitations-banner";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { PlanBadge } from "./components/plan-badge";

const ACTIVITY_COOKIE = "plannerhq_last_activity";

export default function DashboardPage() {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLogoutConfirm(false);
    };
    if (showLogoutConfirm) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showLogoutConfirm]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await signOut();
    setIsLoggingOut(false);
    setShowLogoutConfirm(false);

    if (res.success) {
      deleteCookie(ACTIVITY_COOKIE);
      toast.success("Successfully logged out");
      router.push("/signin");
    } else {
      toast.error(res.message || "Failed to log out");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50/50 flex flex-col">
        <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-6 lg:px-8">
          <SkeletonLoader className="h-6 w-28" />
          <div className="flex gap-4"><SkeletonLoader className="h-8 w-8 rounded-full" /></div>
        </header>
        <main className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-10 space-y-8">
          <SkeletonLoader className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-32 rounded-2xl" />)}
          </div>
          <SkeletonLoader className="h-[400px] rounded-2xl" />
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-indigo-500/20">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
            </div>
            <span className="font-bold tracking-tight text-neutral-900">PlannerHQ</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 mr-2">
              <div className="text-right">
                <div className="text-sm font-semibold text-neutral-900 leading-tight">{user.displayName}</div>
                <div className="text-xs text-neutral-500 font-medium">{user.email}</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="h-5 w-px bg-neutral-200 hidden sm:block" />

            <Link href="/settings" className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
            <button onClick={() => setShowLogoutConfirm(true)} className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col gap-10">

        {/* Welcome Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <PlanBadge />
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Overview
            </h1>
            <p className="text-neutral-500 mt-1 text-base">
              Welcome back, {user.displayName.split(' ')[0]}. Here's what's happening today.
            </p>
          </motion.div>
        </section>

        {/* Dynamic Alerts */}
        <InvitationsBanner />

        {/* KPIs */}
        <KpiMetrics />

        {/* Data Grid */}
        <WorkspacesList />

        {/* Upsell / Settings callout */}
        <motion.section
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative overflow-hidden rounded-3xl glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer"
          onClick={() => router.push("/settings")}
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-white/50 border border-white/20 shadow-sm flex items-center justify-center shrink-0 backdrop-blur-md">
              <Settings className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Account Preferences</h3>
              <p className="text-sm text-neutral-500 mt-1">Manage your personal details, notifications, and security.</p>
            </div>
          </div>
          <div className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
            Manage Settings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.section>
      </main>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl z-10"
            >
              <div className="p-6 text-center flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
                  <LogOut className="w-5 h-5 text-neutral-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Sign out of PlannerHQ</h3>
                <p className="mt-2 text-sm text-neutral-500">You will be securely logged out of your account on this device.</p>
              </div>
              <div className="p-4 bg-neutral-50/80 border-t border-neutral-100 flex gap-3">
                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">Cancel</button>
                <button onClick={handleLogout} disabled={isLoggingOut} className="flex-1 flex justify-center items-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-all disabled:opacity-70">
                  {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Out"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}