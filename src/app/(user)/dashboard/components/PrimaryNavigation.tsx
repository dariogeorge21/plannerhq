// features/dashboard/components/PrimaryNavigation.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Home, Notebook, MessageSquare, CheckSquare, Users, Calendar } from 'lucide-react';

const navItems = [
    { label: 'Workspace', icon: Home, href: '/workspace' },
    { label: 'Notes', icon: Notebook, href: '/notes' },
    { label: 'Chat', icon: MessageSquare, href: '/chat' },
    { label: 'Tasks', icon: CheckSquare, href: '/tasks' },
    { label: 'Members', icon: Users, href: '/members' },
    { label: 'Calendar', icon: Calendar, href: '/calendar' },
];

// Mock recent workspaces (replace with data from hook)
const recentWorkspaces = [
    { id: '1', name: 'Design Team', icon: '🎨' },
    { id: '2', name: 'Engineering', icon: '⚙️' },
    { id: '3', name: 'Marketing', icon: '📈' },
];

export function PrimaryNavigation() {
    const router = useRouter();

    return (
        <nav className="flex items-center gap-1 p-1 rounded-full border border-neutral-200/50 bg-white/70 backdrop-blur-md shadow-glass dark:border-neutral-700/50 dark:bg-neutral-800/70">
            {navItems.map((item) => {
                const isWorkspace = item.label === 'Workspace';
                const Comp = isWorkspace ? DropdownMenu : 'div';

                if (isWorkspace) {
                    return (
                        <DropdownMenu key={item.label}>
                            <DropdownMenuTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-700/70 transition-colors"
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                    <ChevronDown className="w-3 h-3 ml-0.5" />
                                </motion.button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-56">
                                <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500">Recent Workspaces</div>
                                {recentWorkspaces.map((ws) => (
                                    <DropdownMenuItem key={ws.id} onClick={() => router.push(`/workspace/${ws.id}`)}>
                                        <span className="mr-2">{ws.icon}</span>
                                        {ws.name}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem onClick={() => router.push('/workspaces')} className="text-indigo-600">
                                    View all workspaces
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                }

                return (
                    <Link key={item.label} href={item.href}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-700/70 transition-colors"
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </motion.div>
                    </Link>
                );
            })}
        </nav>
    );
}