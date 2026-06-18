// src/app/(user)/[workspaceId]/layout.tsx
"use client";

import React, { useEffect, useState, use } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GetWorkspace } from "@/features/workspace/workspace";
import { useSession } from "@/features/auth/providers/SessionProvider";
import {
  LayoutDashboard,
  Settings,
  Users,
  Menu,
  X,
  ShieldAlert,
  Loader2,
  MessageSquareIcon,
  ChevronsLeft,
  FileText
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchWorkspaceDetails = async () => {
    try {
      const res = await GetWorkspace(workspaceId);
      if (res.success && res.data) {
        setWorkspace(res.data);
      } else {
        toast.error("Workspace not found or access denied");
      }
    } catch (err) {
      toast.error("Failed to fetch workspace details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceDetails();
  }, [workspaceId]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-neutral-500 animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-neutral-200/60 rounded-3xl p-8 text-center shadow-2xl shadow-neutral-200/40">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">Access Denied</h1>
          <p className="text-neutral-500 mb-8 leading-relaxed">
            You don't have permission to view this workspace, or it does not exist.
          </p>
          <Button asChild className="w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 h-12 font-semibold">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: "Overview", href: `/${workspaceId}`, icon: LayoutDashboard, exact: true },
    { name: "Notes", href: `/${workspaceId}/docs`, icon: FileText, exact: false },
    { name: "Chat", href: `/${workspaceId}/chat`, icon: MessageSquareIcon, exact: false },
    { name: "Members", href: `/${workspaceId}/members`, icon: Users, exact: false },
    { name: "Settings", href: `/${workspaceId}/settings`, icon: Settings, exact: false },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden font-sans selection:bg-indigo-500/20">

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="hidden md:flex flex-col bg-white border-r border-neutral-200/60 relative z-20 shadow-sm"
      >
        <div className="h-16 flex items-center px-6 border-b border-neutral-100">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <span className="font-bold text-neutral-900 tracking-tight truncate">
                {workspace.name}
              </span>
            )}
          </Link>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white border border-neutral-200 shadow-sm w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-indigo-600 transition-colors z-30"
        >
          <ChevronsLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-none">
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${active
                    ? "bg-indigo-50/80 text-indigo-700"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
              >
                <link.icon className={`w-5 h-5 shrink-0 ${active ? "text-indigo-600" : "text-neutral-400 group-hover:text-neutral-600"}`} />
                {!isCollapsed && (
                  <span className={`text-sm font-semibold ${active ? "text-indigo-700" : ""}`}>
                    {link.name}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-14 bg-neutral-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                    {link.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <Link
            href="/dashboard"
            className={`flex items-center justify-center gap-2 w-full rounded-xl border border-neutral-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors shadow-xs ${isCollapsed ? 'px-0' : ''}`}
          >
            {isCollapsed ? <ChevronsLeft className="w-5 h-5" /> : <span>Exit Workspace</span>}
          </Link>
        </div>
      </motion.aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between h-16 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 px-5 fixed top-0 w-full z-40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-inner">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-neutral-900 tracking-tight truncate max-w-[150px]">
            {workspace.name}
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* MOBILE SIDEBAR MODAL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-50 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100">
                <span className="font-bold text-neutral-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navLinks.map((link) => {
                  const active = isActive(link.href, link.exact);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${active
                          ? "text-indigo-700 bg-indigo-50 border border-indigo-100/50"
                          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                        }`}
                    >
                      <link.icon className={`w-5 h-5 ${active ? "text-indigo-600" : "text-neutral-400"}`} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-5 border-t border-neutral-100 bg-neutral-50/50">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-white border border-neutral-200/80 px-4 py-3 text-sm font-bold text-neutral-700 shadow-sm"
                >
                  Exit Workspace
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 relative bg-[#FAFAFA]">
        {children}
      </main>
    </div>
  );
}