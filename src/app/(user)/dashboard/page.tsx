"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { signOut } from "@/api/auth";
import { deleteCookie } from "@/utils/session";
import { toast } from "sonner";
import { KpiMetrics } from "./components/kpi";
import { WorkspacesList } from "./components/workspace-list";
import { DashboardBreadcrumbs } from "./components/breadcrumbs";
import { ApplicationSettings } from "./components/application-settings";

const ACTIVITY_COOKIE = "plannerhq_last_activity";

export default function DashboardPage() {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close modal on escape press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowLogoutConfirm(false);
      }
    };
    if (showLogoutConfirm) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showLogoutConfirm]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await signOut();
    setIsLoggingOut(false);
    setShowLogoutConfirm(false);

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
              onClick={() => setShowLogoutConfirm(true)}
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
            <KpiMetrics />
          </div>
        </div>
        <WorkspacesList />
        <ApplicationSettings />
      </main>


      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-100 bg-white p-8 shadow-2xl z-10 flex flex-col items-center text-center"
            >
              {/* Decorative background glows */}
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-36 h-36 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-36 h-36 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

              {/* Warning/Signout Icon Box */}
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="w-8 h-8 animate-pulse" />
              </div>

              {/* Modal Typography */}
              <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                Confirm Sign Out
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500 font-medium max-w-[280px] sm:max-w-none">
                Are you sure you want to sign out of PlannerHQ? You'll need to log in again to access your collaborative workspaces.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex w-full flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-200/80 hover:bg-neutral-100 hover:border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/10 transition-all hover:shadow-red-600/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing Out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
