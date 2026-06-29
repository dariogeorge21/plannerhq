// features/dashboard/components/WorkspaceDropdownContent.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FolderOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkspaceDropdownContentProps {
  workspaces: any[];
  loading: boolean;
  onViewAll: () => void;
  onCreateNew: () => void;
}

import { LoadingScreen } from "@/components/ui/loading-screen";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceDropdownContent({
  workspaces,
  loading,
  onViewAll,
  onCreateNew,
}: WorkspaceDropdownContentProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="py-2 min-h-[140px] relative">
        <LoadingScreen fullScreen={false} messages={["Loading workspaces..."]}>
           <div className="px-2 py-1.5 space-y-2">
             <Skeleton className="h-3 w-24 mb-2" />
             <Skeleton className="h-8 w-full rounded-md" />
             <Skeleton className="h-8 w-full rounded-md" />
             <Skeleton className="h-8 w-full rounded-md" />
           </div>
        </LoadingScreen>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="py-3 text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No workspaces yet</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          onClick={onCreateNew}
        >
          <Plus className="w-4 h-4 mr-1" /> Create one
        </Button>
      </div>
    );
  }

  // Show latest 3 workspaces (already sorted by last accessed from hook)
  const recent = workspaces.slice(0, 3);

  return (
    <div>
      <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">Recent Workspaces</div>
      <div className="space-y-0.5">
        {recent.map((ws) => (
          <button
            key={ws.id}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => router.push(`/${ws.id}`)}
          >
            <span className="text-lg">{ws.icon || '📁'}</span>
            <span className="truncate">{ws.name}</span>
          </button>
        ))}
      </div>
      <div className="my-2 border-t border-neutral-200/70 dark:border-neutral-700/70" />
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        onClick={onViewAll}
      >
        <FolderOpen className="w-4 h-4 mr-2" /> View all workspaces
      </Button>
    </div>
  );
}