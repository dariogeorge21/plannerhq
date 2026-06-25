// features/user/UserHeader.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PrimaryNavigation } from './PrimaryNavigation';
import { NotificationCenter } from './NotificationCenter';
import { UserProfileMenu } from './UserProfileMenu';
import { ThemeToggle } from './ThemeToggle';
import { AllWorkspacesModal } from '@/features/workspace/components/AllWorkspacesModal';
import { CreateWorkspaceModal } from '@/features/workspace/components/CreateWorkspaceModal';
import { useUserWorkspaces } from '@/features/dashboard/hooks/UseDashboardData';

interface DashboardHeaderProps {
  user: any; // replace with proper User type
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: workspaces = [], isLoading: loading, refetch } = useUserWorkspaces(); // fetch workspaces sorted by last accessed

  // Refetch workspaces when modals close to keep data fresh
  useEffect(() => {
    if (!isAllModalOpen && !isCreateModalOpen) {
      refetch();
    }
  }, [isAllModalOpen, isCreateModalOpen, refetch]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/60 bg-white/70 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-900/70">
        <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <Image src="/logo.png" alt="PlannerHQ Logo" width={32} height={32} />
            </div>
            <span className="font-bold tracking-tight text-neutral-900 dark:text-white">PlannerHQ</span>
          </Link>

          {/* Primary Navigation - centered with curved pill background */}
          <div className="hidden md:flex flex-1 justify-center">
            <PrimaryNavigation
              workspaces={workspaces}
              loading={loading}
              onViewAll={() => setIsAllModalOpen(true)}
              onCreateNew={() => setIsCreateModalOpen(true)}
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationCenter />
            <UserProfileMenu user={user} />
          </div>
        </div>
      </header>

      {/* Modals */}
      <AllWorkspacesModal
        isOpen={isAllModalOpen}
        onClose={() => setIsAllModalOpen(false)}
        workspaces={workspaces}
        onCreateWorkspace={() => {
          setIsAllModalOpen(false);
          setIsCreateModalOpen(true);
        }}
      />
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}