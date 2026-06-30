// features/dashboard/components/PrimaryNavigation.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { BriefcaseIcon, Notebook, MessageSquare, CheckSquare, Users, Calendar, ChevronDown, Home } from 'lucide-react';
import { HoverDropdown } from './HoverDropdown';
import { WorkspaceDropdownContent } from './WorkspaceDropdownContent';

const navItems = [
  { label: 'Workspace', icon: BriefcaseIcon },
  { label: 'Notes', icon: Notebook },
  { label: 'Chat', icon: MessageSquare },
  { label: 'Tasks', icon: CheckSquare },
  { label: 'Members', icon: Users },
  { label: 'Calendar', icon: Calendar },
];

interface PrimaryNavigationProps {
  workspaces: any[];
  loading: boolean;
  onViewAll: () => void;
  onCreateNew: () => void;
}

export function PrimaryNavigation({ workspaces, loading, onViewAll, onCreateNew }: PrimaryNavigationProps) {
  return (
    <nav className="relative flex items-center gap-1 rounded-full border border-neutral-200/40 bg-white/60 px-1 py-1 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
      <Link className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-700/70 transition-colors cursor-pointer" href={'/dashboard'}>
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      {navItems.map((item) => (
        <HoverDropdown
          key={item.label}
          trigger={
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-700/70 transition-colors cursor-pointer">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 transition-transform duration-200 group-hover:rotate-180" />
            </div>
          }
          dropdown={
            <WorkspaceDropdownContent
              workspaces={workspaces}
              loading={loading}
              onViewAll={onViewAll}
              onCreateNew={onCreateNew}
            />
          }
          align="center"
        />
      ))}
    </nav>
  );
}