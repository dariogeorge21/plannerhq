"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { GetWorkspace } from "@/features/workspace/workspace";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  ChevronLeft, 
  Menu, 
  X, 
  Sparkles, 
  ShieldAlert,
  Loader2,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Workspace } from "@/types/workspace";
import { toast } from "sonner";

export default function WorkspaceLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const params = use(paramsPromise);
  const workspaceId = params.workspaceId;
  const pathname = usePathname();
  const { user, isLoading: authLoading } = useSession();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchWorkspaceDetails = async () => {
    try {
      const res = await GetWorkspace(workspaceId);
      if (res.success && res.data) {
        setWorkspace(res.data);
      } else {
        toast.error("Workspace not found or access denied");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load workspace details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceDetails();
  }, [workspaceId]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-neutral-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user || !workspace) {
    return (
      <div className="min-h-screen bg-neutral-50/30 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-neutral-200/80 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100 mb-6">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-neutral-900">Access Denied</h3>
          <p className="text-sm text-neutral-500 mt-2 mb-6 font-medium leading-relaxed">
            You do not have permission to view this workspace, or it may have been archived.
          </p>
          <Button asChild className="w-full rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 py-3">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const navLinks = [
    {
      name: "Workspace Home",
      href: `/${workspaceId}`,
      icon: LayoutDashboard,
      active: pathname === `/${workspaceId}`
    },
    {
      name: "Members",
      href: `/${workspaceId}/members`,
      icon: Users,
      active: pathname === `/${workspaceId}/members`
    },
    {
      name: "Settings",
      href: `/${workspaceId}/settings`,
      icon: Settings,
      active: pathname === `/${workspaceId}/settings`
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50/20 text-neutral-900 font-sans flex flex-col lg:flex-row selection:bg-indigo-500/30">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 border-r border-neutral-200/50 bg-white/80 backdrop-blur-md flex-col shrink-0">
        {/* Workspace Brand Block */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center font-bold text-lg select-none">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-extrabold text-neutral-950 truncate leading-tight">
                {workspace.name}
              </h2>
              <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase block mt-0.5">
                Active Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative ${
                  link.active 
                    ? "text-indigo-600 bg-indigo-50/50 border border-indigo-100/50" 
                    : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50/50"
                }`}
              >
                {link.active && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${link.active ? "text-indigo-600" : "text-neutral-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-100 space-y-3 bg-neutral-50/30">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 px-4 py-2.5 text-xs font-bold text-neutral-700 shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-neutral-400" />
            <span>All Workspaces</span>
          </Link>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-40 w-full border-b border-neutral-200/50 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 h-16 shadow-2xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center font-bold text-sm select-none">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-sm font-extrabold text-neutral-950 truncate max-w-[150px]">
            {workspace.name}
          </h2>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-9 w-9 rounded-xl border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-neutral-950/20 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="lg:hidden fixed top-16 left-0 bottom-0 z-45 w-72 bg-white border-r border-neutral-100 flex flex-col"
            >
              <nav className="flex-1 px-4 py-6 space-y-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        link.active 
                          ? "text-indigo-600 bg-indigo-50/50 border border-indigo-100/50" 
                          : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${link.active ? "text-indigo-600" : "text-neutral-400"}`} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-neutral-100 bg-neutral-50/30">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-neutral-200/80 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-400" />
                  <span>All Workspaces</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto px-6 py-8 lg:p-10 relative">
        <div className="max-w-5xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
