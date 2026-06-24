// app/(dashboard)/dashboard/page.tsx
'use client';


import { useSession } from '@/features/auth/providers/SessionProvider';
import { DashboardHeader } from './components/DashboardHeader';
import { ThemeToggle } from './components/ThemeToggle';
import { Skeleton } from '@/components/ui/skeleton';
import {
  WelcomeHero, ProfileOverviewCard, RecentWorkspaces,
  TaskPriorityBoard, MiniCalendar, UpcomingEvents,
  WorkspaceInvitations, KpiMetrics, SubscriptionStatus,
  QuotaUsage, TimeTracking
} from './components/DashboardWidgets';

export default function DashboardPage() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null; // or redirect to signin
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-900/50 selection:bg-indigo-500/20">
      <DashboardHeader user={user} />

      <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-8">
        {/* Welcome Hero */}
        <WelcomeHero user={user} />

        {/* Two‑column grid for main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileOverviewCard user={user} />
            <RecentWorkspaces />
            {/* <TaskPriorityBoard user={user} /> */}
          </div>

          {/* Right column: 1/3 width */}
          <div className="space-y-6">
            <MiniCalendar user={user} />
            <UpcomingEvents user={user} />
            <WorkspaceInvitations />
          </div>
        </div>

        {/* KPI Metrics Row */}
        <KpiMetrics user={user} />

        {/* Subscription & Quota */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SubscriptionStatus />
          <QuotaUsage />
        </div>

        {/* Time Tracking (optional) */}
        <TimeTracking />

        {/* Theme toggle is also in header, but we place it here for completeness */}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </main>
    </div>
  );
}

// Skeleton component
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-900/50">
      <div className="h-16 border-b border-neutral-200 bg-white/80 dark:bg-neutral-800/80 flex items-center px-6">
        <div className="flex-1 flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}