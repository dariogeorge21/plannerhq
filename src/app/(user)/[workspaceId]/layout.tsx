// src/app/(user)/[workspaceId]/layout.tsx
"use client";

import React, { useEffect, useState, use } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GetWorkspaceIncludingArchived, UpdateWorkspaceLastActive, UnarchiveWorkspace } from "@/features/workspace/workspace";
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
  FileText,
  SquareKanban,
  CalendarDays,
  FolderOpen,
  Search,
  Sun,
  Moon,
  Activity
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Workspace } from "@/types/workspace";
import { WorkspaceAvatar } from "@/components/ui/workspace-avatar";
import { toast } from "sonner";
import { TimeTrackerWidget } from "@/features/workspace/components/TimeTrackerWidget";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingScreen } from "@/components/ui/loading-screen";

const LOADING_MESSAGES = [
  "Connecting to your team...",
  "Fetching your documents...",
  "Loading your tasks...",
  "Syncing calendar events...",
  "Warming up the editor...",
  "Starting the chat...",
  "Almost there!",
];

function TopProgressBar() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timeout = setTimeout(() => setIsNavigating(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ width: "0%", opacity: 1 }}
          animate={{ width: "100%", opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary z-[100] shadow-[0_0_10px_rgba(var(--primary),0.5)]"
        />
      )}
    </AnimatePresence>
  );
}

export function WorkspaceSkeletonLoader({ userName }: { userName?: string }) {
  return (
    <LoadingScreen fullScreen={true} messages={LOADING_MESSAGES}>
      <div className="flex h-screen w-full flex-col bg-background">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar skeleton */}
          <aside className="w-64 border-r bg-muted/20 p-4 hidden md:block">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-3/4 rounded-xl" />
                ))}
              </div>
            </div>
          </aside>

          {/* Main content skeleton */}
          <main className="flex-1 p-6 bg-background/50">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                ))}
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-1/4 rounded-md" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-3/4 rounded-2xl" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </LoadingScreen>
  );
}

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
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchWorkspaceDetails = async () => {
    try {
      const res = await GetWorkspaceIncludingArchived(workspaceId);
      if (res.success && res.data) {
        setWorkspace(res.data);
        UpdateWorkspaceLastActive(workspaceId);
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
    return <WorkspaceSkeletonLoader userName={user?.displayName} />;
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        {/* Subtle background glow for error state */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 text-center shadow-2xl shadow-black/5 dark:shadow-black/40 relative z-10">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto mb-6 ring-4 ring-destructive/5">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            You don't have permission to view this workspace, or it does not exist.
          </p>
          <Button asChild className="w-full rounded-xl bg-foreground text-background hover:scale-[1.02] transition-transform h-12 font-semibold shadow-lg shadow-foreground/10">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (workspace.is_deleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-muted/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-md w-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 text-center shadow-2xl shadow-black/5 dark:shadow-black/40 relative z-10">
          <div className="w-16 h-16 bg-muted text-muted-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 ring-4 ring-muted/50">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Workspace Archived</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            This workspace has been archived. You can no longer access its notes, tasks, or settings.
          </p>
          <div className="flex flex-col gap-3">
            {workspace.role === 'owner' && (
              <form action={async (formData) => {
                const res = await UnarchiveWorkspace(formData);
                if (res.success) {
                  toast.success(res.message);
                  window.location.reload();
                } else {
                  toast.error(res.message);
                }
              }}>
                <input type="hidden" name="workspaceId" value={workspaceId} />
                <Button type="submit" className="w-full rounded-xl bg-primary text-primary-foreground hover:scale-[1.02] transition-transform h-12 font-semibold shadow-lg shadow-primary/20">
                  Unarchive Workspace
                </Button>
              </form>
            )}
            <Button asChild variant="outline" className="w-full rounded-xl hover:scale-[1.02] transition-transform h-12 font-semibold">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: "Overview", href: `/${workspaceId}`, icon: LayoutDashboard, exact: true },
    { name: "Notes", href: `/${workspaceId}/docs`, icon: FileText, exact: false },
    { name: "Chat", href: `/${workspaceId}/chat`, icon: MessageSquareIcon, exact: false },
    { name: "Tasks", href: `/${workspaceId}/tasks`, icon: SquareKanban, exact: false },
    { name: "Calendar", href: `/${workspaceId}/calendar`, icon: CalendarDays, exact: false },
    { name: "Files", href: `/${workspaceId}/files`, icon: FolderOpen, exact: false },
    { name: "Members", href: `/${workspaceId}/members`, icon: Users, exact: false },
    { name: "Settings", href: `/${workspaceId}/settings`, icon: Settings, exact: false },
    ...(workspace.role === 'owner' ? [{ name: "Workspace Logs", href: `/${workspaceId}/logs`, icon: Activity, exact: false }] : []),
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans selection:bg-primary/20">
      <TopProgressBar />

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="hidden md:flex flex-col bg-sidebar/80 backdrop-blur-xl border-r border-border relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
      >
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            <WorkspaceAvatar workspace={workspace} className="w-8 h-8 rounded-lg shadow-sm group-hover:shadow-md transition-shadow" />
            {!isCollapsed && (
              <span className="font-bold text-sidebar-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                {workspace.name}
              </span>
            )}
          </Link>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-background border border-border shadow-md w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-110 z-30"
        >
          <ChevronsLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="px-3 pt-4 pb-2">
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/80 transition-all text-muted-foreground hover:text-foreground group hover:shadow-sm ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <Search className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between">
                <span className="text-sm font-medium">Search</span>
                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded-md border border-border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            )}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-none relative">
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setLoadingHref(link.href)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeSidebarPill"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10 rounded-xl -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {!active && (
                  <div className="absolute inset-0 bg-accent/50 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                {loadingHref === link.href ? (
                  <Loader2 className={`w-5 h-5 shrink-0 relative z-10 transition-transform duration-300 animate-spin ${active ? "text-primary" : "text-muted-foreground"}`} />
                ) : (
                  <link.icon className={`w-5 h-5 shrink-0 relative z-10 transition-transform duration-300 ${active ? "text-primary scale-110" : "text-muted-foreground group-hover:scale-110 group-hover:text-foreground"}`} />
                )}
                {!isCollapsed && (
                  <span className={`text-sm font-semibold relative z-10 ${active ? "text-primary" : ""}`}>
                    {link.name}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-14 bg-popover border border-border text-popover-foreground text-xs font-semibold px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl z-50 translate-x-[-10px] group-hover:translate-x-0">
                    {link.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 flex flex-col gap-2 bg-sidebar/50">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`flex items-center justify-center gap-2 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-sm hover:shadow ${isCollapsed ? 'px-0' : ''}`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
            </button>
          )}
          <Link
            href="/dashboard"
            className={`flex items-center justify-center gap-2 w-full rounded-xl border border-transparent hover:border-destructive/30 bg-background/50 px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all shadow-sm hover:shadow ${isCollapsed ? 'px-0' : ''}`}
          >
            {isCollapsed ? <ChevronsLeft className="w-5 h-5" /> : <span>Exit Workspace</span>}
          </Link>
        </div>
      </motion.aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between h-16 bg-background/80 backdrop-blur-xl border-b border-border px-5 fixed top-0 w-full z-40 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <WorkspaceAvatar workspace={workspace} className="w-8 h-8 rounded-lg shadow-sm" />
          <span className="font-bold text-foreground tracking-tight truncate max-w-[150px]">
            {workspace.name}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <TimeTrackerWidget workspaceId={workspaceId} />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR MODAL - Theme Compliant */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-card border-r border-border shadow-2xl z-50 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <span className="font-bold text-foreground">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navLinks.map((link) => {
                  const active = isActive(link.href, link.exact);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => {
                        setLoadingHref(link.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${active
                        ? "text-primary bg-primary/10 border border-primary/20 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                    >
                      {loadingHref === link.href ? (
                        <Loader2 className={`w-5 h-5 animate-spin ${active ? "text-primary" : "text-muted-foreground"}`} />
                      ) : (
                        <link.icon className={`w-5 h-5 ${active ? "text-primary scale-110" : "text-muted-foreground"} transition-transform`} />
                      )}
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-5 border-t border-border bg-muted/20">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm font-bold text-foreground shadow-sm hover:shadow-md transition-shadow hover:border-destructive/30 hover:text-destructive"
                >
                  Exit Workspace
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 relative bg-background/50">


        <div className="h-full w-full relative">
          {/* Optional: Add a subtle ambient top gradient to the main content area for premium feel */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sidebar/30 to-transparent pointer-events-none" />
          {children}
        </div>
      </main>
      <div className="absolute bottom-4 right-6 z-30 hidden md:block">
        <TimeTrackerWidget workspaceId={workspaceId} />
      </div>
    </div>
  );
}