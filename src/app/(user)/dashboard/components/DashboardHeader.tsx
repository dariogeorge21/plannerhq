// features/user/UserHeader.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PrimaryNavigation } from './PrimaryNavigation';
import { NotificationCenter } from './NotificationCenter';
import { UserProfileMenu } from './UserProfileMenu';
import { ThemeToggle } from './ThemeToggle';

interface DashboardHeaderProps {
    user: any; // replace with proper User type
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/80">
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2.5 opacity-90 hover:opacity-100 transition-opacity">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                        <Image src="/logo.png" alt="PlannerHQ Logo" width={32} height={32} />
                    </div>
                    <span className="font-bold tracking-tight text-neutral-900 dark:text-white">PlannerHQ</span>
                </Link>

                {/* Primary Navigation (visible on md+) */}
                <div className="hidden md:flex flex-1 justify-center">
                    <PrimaryNavigation />
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <NotificationCenter />
                    <UserProfileMenu user={user} />
                </div>
            </div>
        </header>
    );
}