'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, CheckCircle2, ChevronRight,
    TrendingUp, Users, FolderKanban, BellRing,
    Briefcase, Calendar as CalendarIcon, Link as LinkIcon,
    ArrowUpNarrowWide, Loader2, Plus, Search,
    Shield, Star, Hash, Timer, Building2, Calendar,
    Zap, Sparkles, CreditCard, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WorkspaceAvatar } from '@/components/ui/workspace-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AllWorkspacesModal } from '@/features/workspace/components/AllWorkspacesModal';
import { CreateWorkspaceModal } from '@/features/workspace/components/CreateWorkspaceModal';
import { CustomClock } from './CustomClock';
import { LoadingScreen } from "@/components/ui/loading-screen";

import { useSubscription } from '@/features/billing/hooks/useSubscription';
import {
    useUserWorkspaces,
    useUserPendingInvitations,
    useUserTasks,
    useDashboardCalendarEvents,
    useUserProfileStats,
    useUserProfileOverview,
    useUserDailyProductivity
} from '@/features/dashboard/hooks/UseDashboardData';
import { useToggleTaskCompletion } from '@/features/task/hooks';
import { AcceptInvitation, DeclineInvitation } from '@/features/workspace/invites';
import { CreateWorkspace } from '@/features/workspace/workspace';
import { Input } from '@/components/ui/input';
import { useWorkspaceTimeSpent } from '@/features/time-tracking/hooks';


interface WelcomeHeroProps {
    user: any;
}

interface UserProps {
    user: any;
}

export function WelcomeHero({ user }: WelcomeHeroProps) {
    const router = useRouter();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const { data: subData, loading: subLoading } = useSubscription();
    const { data: workspaces, isLoading: wsLoading } = useUserWorkspaces();

    const [isAllModalOpen, setIsAllModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [navigatingId, setNavigatingId] = useState<string | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);

    const handleNavigate = (id: string) => {
        setNavigatingId(id);
        setIsNavigating(true);
        router.push(`/${id}`);
    };

    const handleViewSchedule = () => {
        setIsNavigating(true);
        router.push(`/calendar`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] bg-white dark:bg-[#0A0A0A] p-6 sm:p-10 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl border border-neutral-200 dark:border-white/10"
        >
            {/* Loading progress bar */}
            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        initial={{ width: 0, opacity: 1 }}
                        animate={{ width: '100%', opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 z-50"
                    />
                )}
            </AnimatePresence>

            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 dark:bg-indigo-500/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-400/10 dark:bg-purple-500/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-blue-400/5 dark:bg-blue-500/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_10%)]" />
            </div>

            <div className={`relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 transition-opacity duration-300 ${isNavigating ? 'opacity-80 pointer-events-none' : 'opacity-100'}`}>
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100/80 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 mb-6 backdrop-blur-md"
                    >
                        {subLoading ? (
                            <Skeleton className="w-16 h-4 rounded-full" />
                        ) : (
                            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 capitalize">
                                {subData?.plan?.id || 'Free'} Plan
                            </span>
                        )}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 leading-[1.1]"
                    >
                        {greeting}, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-neutral-900 to-purple-600 dark:from-indigo-300 dark:via-white dark:to-purple-300">
                            {user?.displayName || 'User'}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-neutral-600 dark:text-neutral-400 text-lg max-w-xl font-light"
                    >
                        Let's make it a productive and focused day.
                    </motion.p>
                </div>

                <div className="flex flex-col lg:items-end gap-5 shrink-0 w-full lg:w-auto mt-6 lg:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="w-full flex justify-start sm:justify-start lg:justify-end"
                    >
                        <CustomClock />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
                    >
                        {wsLoading ? (
                            <>
                                <Skeleton className="h-12 w-full sm:w-44 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60" />
                                <Skeleton className="h-12 w-full sm:w-36 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60" />
                            </>
                        ) : (
                            <>
                                {(!workspaces || workspaces.length === 0) ? (
                                    <Button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        disabled={wsLoading || isNavigating}
                                        className="h-12 px-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] w-full sm:w-auto justify-center"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Create Workspace
                                    </Button>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                disabled={wsLoading || isNavigating}
                                                className="h-12 px-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] w-full sm:w-auto justify-center"
                                            >
                                                {navigatingId ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Entering...
                                                    </>
                                                ) : (
                                                    <>
                                                        Dive to Workspace <ChevronRight className="w-4 h-4 ml-2" />
                                                    </>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-neutral-200/60 dark:border-neutral-800/60 shadow-glass">
                                            <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                                Recent Workspaces
                                            </div>
                                            {workspaces.slice(0, 3).map((ws) => (
                                                <DropdownMenuItem
                                                    key={ws.id}
                                                    onClick={() => handleNavigate(ws.id)}
                                                    disabled={isNavigating}
                                                    className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                                >
                                                    {navigatingId === ws.id ? (
                                                        <Loader2 className="w-8 h-8 p-2 animate-spin text-neutral-500" />
                                                    ) : (
                                                        <WorkspaceAvatar
                                                            workspace={{ name: ws.name, avatar_url: ws.avatar_url }}
                                                            className="w-8 h-8 rounded-lg"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                                            {ws.name}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 capitalize">{ws.role}</p>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                            <DropdownMenuSeparator className="my-1 border-neutral-100 dark:border-neutral-800" />
                                            <DropdownMenuItem
                                                onClick={() => setIsAllModalOpen(true)}
                                                disabled={isNavigating}
                                                className="p-2 justify-center rounded-xl cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                            >
                                                Show all workspaces
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}

                                <Button
                                    onClick={handleViewSchedule}
                                    variant="outline"
                                    disabled={isNavigating}
                                    className="h-12 px-6 rounded-full bg-white/50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
                                >
                                    {isNavigating && !navigatingId ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin text-neutral-500 dark:text-neutral-400" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <CalendarIcon className="w-4 h-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                                            View Schedule
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Modals */}
            <AllWorkspacesModal
                isOpen={isAllModalOpen}
                onClose={() => setIsAllModalOpen(false)}
                workspaces={workspaces || []}
                onCreateWorkspace={() => setIsCreateModalOpen(true)}
            />
            <CreateWorkspaceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </motion.div>
    );
}

export function ProfileOverviewCard({ user }: UserProps) {
    const router = useRouter();
    const { data: overview, isLoading } = useUserProfileOverview();
    const { data: subData } = useSubscription();

    const planName = subData?.plan?.id || 'free';

    // ── helpers ──────────────────────────────────────────────────────────────
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h === 0 && m === 0) return '0m';
        if (h === 0) return `${m}m`;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    const planConfig: Record<string, { label: string; color: string }> = {
        free: { label: 'Free', color: 'bg-slate-100 text-slate-600 border-slate-200/60 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700/40' },
        pro: { label: 'Pro', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30' },
        ultra: { label: 'Ultra', color: 'bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30' },
        enterprise: { label: 'Enterprise', color: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30' },
    };

    const planStyle = planConfig[planName.toLowerCase() as keyof typeof planConfig]?.color ?? planConfig.free.color;
    const planLabel = planConfig[planName.toLowerCase() as keyof typeof planConfig]?.label ?? planName;

    const statTiles = [
        {
            icon: Building2,
            value: overview?.ownedCount ?? 0,
            label: 'Owned',
            sublabel: 'Workspaces',
            iconBg: 'bg-violet-50 dark:bg-violet-500/10',
            iconColor: 'text-violet-600 dark:text-violet-400',
            valueColor: 'text-violet-700 dark:text-violet-300',
        },
        {
            icon: FolderKanban,
            value: overview?.joinedCount ?? 0,
            label: 'Joined',
            sublabel: 'Workspaces',
            iconBg: 'bg-sky-50 dark:bg-sky-500/10',
            iconColor: 'text-sky-600 dark:text-sky-400',
            valueColor: 'text-sky-700 dark:text-sky-300',
        },
        {
            icon: Users,
            value: overview?.connectedMembersCount ?? 0,
            label: 'Connected',
            sublabel: 'Members',
            iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            valueColor: 'text-emerald-700 dark:text-emerald-300',
        },
        {
            icon: Timer,
            value: formatTime(overview?.totalTimeSeconds ?? 0),
            label: 'Time',
            sublabel: 'Worked',
            iconBg: 'bg-rose-50 dark:bg-rose-500/10',
            iconColor: 'text-rose-600 dark:text-rose-400',
            valueColor: 'text-rose-700 dark:text-rose-300',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
        >
            <Card className="relative overflow-hidden border-neutral-200/60 dark:border-neutral-800/60 shadow-glass bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
                {/* Ambient top gradient */}
                <div className="absolute top-0 inset-x-0 h-36 pointer-events-none bg-gradient-to-b from-indigo-50/60 via-white/0 to-transparent dark:from-indigo-950/30 dark:via-neutral-900/0" />

                <CardContent className="relative p-6 sm:p-8 space-y-6">

                    {/* ── Identity Row ─────────────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                        {/* Avatar */}
                        <div className="relative shrink-0 self-start">
                            {isLoading ? (
                                <Skeleton className="h-20 w-20 rounded-2xl" />
                            ) : (
                                <div className="relative">
                                    <Avatar className="h-20 w-20 rounded-2xl border-[3px] border-white dark:border-neutral-800 shadow-lg">
                                        <AvatarImage
                                            src={overview?.avatarUrl || user?.avatarUrl}
                                            className="rounded-2xl object-cover"
                                        />
                                        <AvatarFallback className="rounded-2xl text-2xl font-semibold bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                                            {(overview?.displayName || user?.displayName)?.charAt(0)?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Online dot */}
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900 shadow" />
                                </div>
                            )}
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 min-w-0 space-y-2.5">
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-7 w-40" />
                                    <Skeleton className="h-5 w-28" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight leading-tight truncate">
                                        {overview?.displayName || user?.displayName || 'User'}
                                    </h2>

                                    {/* HQID & Role */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {(overview?.hqid || user?.hqid) && (
                                            <div className="inline-flex items-center gap-1.5 text-sm font-mono text-neutral-500 dark:text-neutral-400">
                                                <Hash className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{overview?.hqid || user?.hqid}</span>
                                            </div>
                                        )}

                                        {(overview?.role || user?.role) && (
                                            <div className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{overview?.role || user?.role}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Badges row */}
                                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                        {/* Plan badge */}
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${planStyle}`}>
                                            <Star className="w-3 h-3" />
                                            {planLabel} Plan
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Edit button */}
                        <Button
                            onClick={() => router.push('/settings/profile')}
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex shrink-0 rounded-full border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all"
                        >
                            Edit Profile
                        </Button>
                    </div>

                    {/* ── Stats Grid ───────────────────────────────────────── */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {statTiles.map((tile, idx) => {
                                const Icon = tile.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.08 * idx, duration: 0.35 }}
                                        className="group relative flex flex-col gap-3 p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-200 hover:shadow-sm overflow-hidden"
                                    >
                                        {/* Icon */}
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tile.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                                            <Icon className={`w-4 h-4 ${tile.iconColor}`} />
                                        </div>

                                        {/* Value */}
                                        <div>
                                            {isLoading ? (
                                                <>
                                                    <Skeleton className="h-7 w-10 mb-1.5" />
                                                    <Skeleton className="h-3.5 w-16" />
                                                </>
                                            ) : (
                                                <>
                                                    <p className={`text-2xl font-bold leading-none tracking-tight ${tile.valueColor}`}>
                                                        {tile.value}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-500 mt-1.5 leading-tight">
                                                        {tile.label}{' '}
                                                        <span className="text-neutral-400 dark:text-neutral-600">{tile.sublabel}</span>
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        {/* Subtle corner accent */}
                                        <div className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-full opacity-20 blur-lg ${tile.iconBg}`} />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile edit button */}
                    <Button
                        onClick={() => router.push('/settings/profile')}
                        variant="outline"
                        size="sm"
                        className="sm:hidden w-full rounded-full border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    >
                        Edit Profile
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function RecentWorkspaces() {
    const router = useRouter();
    const { data: workspaces, isLoading } = useUserWorkspaces();
    const [isCreating, setIsCreating] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [launchingId, setLaunchingId] = useState<string | null>(null);

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;

        setIsCreating(true);
        const formData = new FormData();
        formData.append('workspaceName', newWorkspaceName.trim());

        try {
            const res = await CreateWorkspace(formData);
            if (res.success && res.data) {
                toast.success(res.message);
                setLaunchingId(res.data.id);
                // Fake a progress bar delay
                setTimeout(() => {
                    router.push(`/${res.data.id}`);
                }, 1000);
            } else {
                toast.error(res.message);
                setIsCreating(false);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            setIsCreating(false);
        }
    };

    const handleLaunch = (ws: any) => {
        setLaunchingId(ws.id);
        setTimeout(() => {
            router.push(`/${ws.id}`);
        }, 800);
    };

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass overflow-hidden flex flex-col relative">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                    Recent Workspaces
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3">
                                <Skeleton className="w-10 h-10 rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="w-1/2 h-4" />
                                    <Skeleton className="w-1/4 h-3" />
                                </div>
                            </div>
                        ))
                    ) : workspaces && workspaces.length > 0 ? (
                        workspaces.slice(0, 3).map((ws) => (
                            <div
                                key={ws.id}
                                className="relative group overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all shadow-sm hover:shadow-md"
                            >
                                {/* Launch progress overlay */}
                                {launchingId === ws.id && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="absolute inset-y-0 left-0 bg-indigo-50 dark:bg-indigo-900/30 z-0"
                                    />
                                )}

                                <div
                                    onClick={() => handleLaunch(ws)}
                                    className="relative z-10 flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <WorkspaceAvatar workspace={{ name: ws.name, avatar_url: ws.avatar_url }} className="w-10 h-10 rounded-xl shadow-sm border border-neutral-200/50 dark:border-neutral-700/50" />
                                            {launchingId === ws.id && (
                                                <div className="absolute -inset-1 rounded-xl border-2 border-indigo-500 animate-pulse" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{ws.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                                                    {ws.slug}
                                                </Badge>
                                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {ws.memberCount} {ws.memberCount === 1 ? 'member' : 'members'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {launchingId === ws.id ? (
                                            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                                        ) : (
                                            <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-all h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:group-hover:bg-indigo-900/40 dark:group-hover:text-indigo-400 transform translate-x-2 group-hover:translate-x-0">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center h-full border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                                <Building2 className="w-6 h-6 text-indigo-500" />
                            </div>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">No workspaces found</p>
                            <p className="text-xs text-neutral-500 mb-4 max-w-[220px]">Create a new workspace to start collaborating with your team.</p>

                            <form onSubmit={handleCreateWorkspace} className="w-full max-w-[240px] space-y-2 relative z-10">
                                <Input
                                    placeholder="e.g. Acme Corp"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    disabled={isCreating || !!launchingId}
                                    className="h-9 text-sm rounded-lg bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
                                />
                                <Button
                                    type="submit"
                                    disabled={!newWorkspaceName.trim() || isCreating || !!launchingId}
                                    className="w-full h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {isCreating || launchingId ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {launchingId ? 'Launching...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create & Launch
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Absolute progress indicator along bottom of card if something is launching */}
            <AnimatePresence>
                {launchingId && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 dark:bg-neutral-800"
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="h-full bg-indigo-600"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

export function TaskPriorityBoard({ user }: UserProps) {
    const { data: tasks, isLoading } = useUserTasks(user?.id);

    // Using a fake workspaceId here just to satisfy the hook signature. 
    // In reality we may want a custom hook that handles multiple workspaces.
    const { mutate: toggleTask } = useToggleTaskCompletion('all');

    const handleToggle = (task: any) => {
        // If we use the task's workspace id to toggle:
        // Actually, the hook is tied to a single workspace. Let's just use it and pass workspaceId inside the mutate action if needed.
        // Wait, the hook `useToggleTaskCompletion` accepts workspaceId in the hook call. It invalidates that specific workspace queries.
        // For the dashboard, we might need a custom mutation or just call the action directly.
        import('@/features/task/actions').then(({ toggleTaskCompletionAction }) => {
            toggleTaskCompletionAction(task.id, !task.completed, task.workspace_id).then(() => {
                // Ideally invalidate 'dashboard_tasks' here
                import('@/lib/supabase/client').then(({ createClient }) => {
                    // We can just rely on the realtime listener or manually invalidate
                });
            });
        });
    };

    // Filter out done tasks and sort by priority
    const priorityOrder: Record<string, number> = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1, 'none': 0 };
    const activeTasks = tasks
        ?.filter(t => !t.completed && t.status !== 'done')
        .sort((a, b) => priorityOrder[b.priority || 'none'] - priorityOrder[a.priority || 'none'])
        .slice(0, 5);

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Priority Tasks</CardTitle>
                <Button variant="outline" size="sm" className="h-8 rounded-full text-xs"><FolderKanban className="w-3 h-3 mr-2" /> Board View</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                        ))
                    ) : activeTasks && activeTasks.length > 0 ? (
                        activeTasks.map((task: any) => (
                            <div key={task.id} className="flex items-start gap-3 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow group">
                                <button
                                    onClick={() => handleToggle(task)}
                                    className={`mt-0.5 rounded-full w-5 h-5 flex flex-shrink-0 items-center justify-center border transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 dark:border-neutral-600 hover:border-indigo-500'}`}
                                >
                                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${task.completed ? 'text-neutral-500 line-through' : 'text-neutral-900 dark:text-white'}`}>
                                        {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 rounded-md">
                                            {task.workspaces?.name || 'Workspace'}
                                        </Badge>
                                        <span className={`text-[10px] font-medium px-1.5 py-0 rounded-md ${task.priority === 'urgent' || task.priority === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                                            task.priority === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                                                'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                            }`}>
                                            {task.priority || 'None'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-neutral-500 p-2">No priority tasks assigned to you.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function MiniCalendar({ user }: UserProps) {
    const { data: events, isLoading } = useDashboardCalendarEvents(user?.id);
    const today = new Date();

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-semibold text-neutral-900 dark:text-white">Today</span>
                </div>
                <span className="text-sm font-medium text-neutral-500">
                    {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
            </div>
            <CardContent className="p-0">
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-64 overflow-y-auto">
                    {isLoading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="p-4 flex gap-4">
                                <Skeleton className="w-12 h-10" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : events && events.length > 0 ? (
                        events.map((event: any) => {
                            const date = new Date(event.start_at);
                            const hours = date.getHours();
                            const ampm = hours >= 12 ? 'PM' : 'AM';
                            const hours12 = hours % 12 || 12;
                            const minutes = date.getMinutes().toString().padStart(2, '0');

                            return (
                                <div key={event.id} className="p-4 flex gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <div className="w-12 text-center shrink-0">
                                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">{hours12}:{minutes}</p>
                                        <p className="text-xs text-neutral-400">{ampm}</p>
                                    </div>
                                    <div className="border-l-2 border-indigo-500 pl-4 py-1">
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{event.title}</p>
                                        <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                                            {event.location ? <LinkIcon className="w-3 h-3" /> : null}
                                            {event.location || 'Calendar Event'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-neutral-500 p-6 text-center">No events for today.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function UpcomingEvents({ user }: UserProps) {
    const { data: tasks, isLoading } = useUserTasks(user?.id);

    // Find tasks due soon
    const upcomingTasks = tasks?.filter((t: any) => {
        if (!t.due_date || t.completed) return false;
        const due = new Date(t.due_date);
        const now = new Date();
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
    }).slice(0, 3);

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-amber-500" /> Reminders
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {isLoading ? (
                        <Skeleton className="h-16 w-full rounded-2xl" />
                    ) : upcomingTasks && upcomingTasks.length > 0 ? (
                        upcomingTasks.map((task: any) => {
                            const due = new Date(task.due_date);
                            const now = new Date();
                            const diffTime = due.getTime() - now.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const dueText = diffDays === 0 ? 'Due today' : `Due in ${diffDays} days`;

                            return (
                                <div key={task.id} className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-4 flex gap-3">
                                    <div className="mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-amber-100">{task.title}</p>
                                        <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-1">{dueText}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-neutral-500 text-center py-2">No upcoming reminders.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function WorkspaceInvitations() {
    const router = useRouter();
    const { data: invitations, isLoading, refetch } = useUserPendingInvitations();
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleAccept = async (id: string) => {
        setActionLoading(id);
        const formData = new FormData();
        formData.append('invitationId', id);
        const res = await AcceptInvitation(formData);
        if (res.success) {
            toast.success("Invitation accepted");
            refetch();
            router.refresh();
        } else {
            toast.error(res.message);
        }
        setActionLoading(null);
    };

    const handleDecline = async (id: string) => {
        setActionLoading(id);
        const formData = new FormData();
        formData.append('invitationId', id);
        const res = await DeclineInvitation(formData);
        if (res.success) {
            toast.success("Invitation declined");
            refetch();
            router.refresh();
        } else {
            toast.error(res.message);
        }
        setActionLoading(null);
    };

    if (isLoading) return <Skeleton className="h-40 w-full rounded-2xl" />;

    if (!invitations || invitations.length === 0) return null;

    return (
        <div className="space-y-4">
            {invitations.map((invite) => (
                <Card key={invite.id} className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass bg-gradient-to-b from-white to-indigo-50/50 dark:from-neutral-900 dark:to-indigo-950/20">
                    <CardContent className="p-5 text-center">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">New Invitation</h3>
                        <p className="text-xs text-neutral-500 mb-4">You were invited to join <strong>{invite.workspace_name}</strong></p>
                        <div className="flex gap-2 justify-center">
                            <Button
                                onClick={() => handleDecline(invite.id)}
                                disabled={actionLoading === invite.id}
                                variant="outline" size="sm" className="h-8 text-xs px-4 rounded-full"
                            >
                                Decline
                            </Button>
                            <Button
                                onClick={() => handleAccept(invite.id)}
                                disabled={actionLoading === invite.id}
                                size="sm" className="h-8 text-xs px-4 rounded-full bg-indigo-600 hover:bg-indigo-700"
                            >
                                {actionLoading === invite.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null} Accept
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function KpiMetrics({ user }: UserProps) {
    const { data: tasks } = useUserTasks(user?.id);
    const { data: stats } = useUserProfileStats(user?.id);
    const { data: events } = useDashboardCalendarEvents(user?.id);
    const { data: productivity } = useUserDailyProductivity(user?.id);

    // Live session timer — tracks seconds this user has been active on this page today
    const [sessionSeconds, setSessionSeconds] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setSessionSeconds(s => s + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter((t: any) => t.completed).length || 0;
    const totalEvents = events?.length || 0;

    const timeTrackedSeconds = stats?.timeTrackedSeconds || 0;
    const hours = Math.floor(timeTrackedSeconds / 3600);
    const minutes = Math.floor((timeTrackedSeconds % 3600) / 60);
    const formattedTime = hours > 0 ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim() : `${minutes}m`;

    // Productivity: how today's active session compares to the user's average daily time
    const avgDailySeconds = productivity?.avgDailySeconds || 0;
    const productivityPct = avgDailySeconds > 0
        ? Math.min(200, Math.round((sessionSeconds / avgDailySeconds) * 100))
        : 0;
    const isProductivityPositive = productivityPct >= 100;

    const metrics = [
        { label: 'Time Logged', value: formattedTime, change: '', positive: true, icon: Clock },
        { label: 'Productivity', value: `${productivityPct}%`, change: '', positive: isProductivityPositive, icon: TrendingUp },
        { label: 'Active Workspaces', value: (stats?.workspaceCount || 0).toString(), change: '', positive: true, icon: FolderKanban },
        { label: 'Total Events', value: totalEvents.toString(), change: '', positive: true, icon: Calendar },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
                <Card key={i} className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                <metric.icon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">{metric.value}</p>
                        <p className="text-xs font-medium text-neutral-500 mt-1">{metric.label}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function SubscriptionStatus() {
    const { data: subData, loading } = useSubscription();
    const router = useRouter();

    if (loading) {
        return (
            <div className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 p-5 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                    <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-4 w-36 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                    <div className="h-7 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-14 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl" />
                    ))}
                </div>
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full" />
            </div>
        );
    }

    const dbPlan = subData?.dbPlan;
    const subscription = subData?.subscription;
    const plan = subData?.plan;
    const usage = subData?.usage;
    const lastPaymentDate = subData?.lastPaymentDate;

    const isPaid = dbPlan && dbPlan.key !== 'free';
    const isCancelling = subscription?.cancel_at_period_end;
    const planDisplayName = dbPlan?.name || 'Free Starter';

    const renewalDate = subscription?.current_period_end
        ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;
    const lastPaidDisplay = lastPaymentDate
        ? new Date(lastPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;
    const billingCycle = (subscription?.billing_cycle as string) || null;

    // Usage bar — workspaces
    const wsUsed = usage?.workspaces_count ?? 0;
    const wsLimit = (plan?.maxWorkspaces as number) ?? 3;
    const wsIsUnlimited = wsLimit > 999_999;
    const wsPct = wsIsUnlimited ? 5 : Math.min(100, (wsUsed / wsLimit) * 100);
    const wsBarColor = wsPct >= 90 ? 'bg-red-500' : wsPct >= 70 ? 'bg-amber-500' : 'bg-indigo-500';

    return (
        <div className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 overflow-hidden shadow-sm">
            {/* Gradient top stripe */}
            <div className={`h-0.5 w-full ${isPaid ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />

            <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPaid ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-neutral-100 dark:bg-neutral-800'
                            }`}>
                            {isPaid
                                ? <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                : <Sparkles className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-0.5">Current Plan</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-base font-extrabold text-neutral-900 dark:text-white leading-tight">{planDisplayName}</span>
                                {isPaid && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isCancelling
                                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isCancelling ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} />
                                        {isCancelling ? 'Cancels soon' : 'Active'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    {!isPaid ? (
                        <button
                            onClick={() => router.push('/billing')}
                            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all active:scale-95"
                        >
                            <Zap className="w-3.5 h-3.5" /> Upgrade
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push('/billing')}
                            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <CreditCard className="w-3.5 h-3.5" /> Manage
                        </button>
                    )}
                </div>

                {/* Billing details grid */}
                {isPaid ? (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-3">
                            <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">Cycle</p>
                            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 capitalize">{billingCycle || '—'}</p>
                        </div>
                        <div className={`rounded-xl p-3 ${isCancelling ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-neutral-50 dark:bg-neutral-800/60'
                            }`}>
                            <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isCancelling ? 'text-amber-500' : 'text-neutral-400 dark:text-neutral-500'
                                }`}>{isCancelling ? 'Ends' : 'Renews'}</p>
                            <p className={`text-xs font-bold ${isCancelling ? 'text-amber-800 dark:text-amber-400' : 'text-neutral-800 dark:text-neutral-200'
                                }`}>{renewalDate || '—'}</p>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-3">
                            <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">Last Paid</p>
                            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{lastPaidDisplay || '—'}</p>
                        </div>
                    </div>
                ) : (
                    /* Free plan: show pricing teaser */
                    <div className="mb-4 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                        <p className="text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold">
                            ✦ Pro from <span className="font-extrabold">₹299/mo</span> — save ₹1,200/yr on the yearly plan
                        </p>
                    </div>
                )}

                {/* Workspace usage bar */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Workspaces</span>
                        <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                            {wsIsUnlimited ? `${wsUsed} used` : `${wsUsed} / ${wsLimit}`}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${wsPct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                            className={`h-full rounded-full ${wsBarColor}`}
                        />
                    </div>
                </div>

                {/* Footer link */}
                <button
                    onClick={() => router.push('/billing')}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    View full billing details <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

export function QuotaUsage() {
    const { data: subData, loading } = useSubscription();

    if (loading) return <Skeleton className="h-40 w-full rounded-2xl" />;

    const usage = subData?.usage?.storage_used_bytes || 0;
    const limit = subData?.plan?.maxStorageBytes || 1;
    const percentage = Math.min(100, Math.round((usage / limit) * 100));

    const usageGB = (usage / (1024 * 1024 * 1024)).toFixed(2);
    const limitGB = (limit / (1024 * 1024 * 1024)).toFixed(0);

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Storage Quota</CardTitle>
                <CardDescription>Workspace file storage usage.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{usageGB} GB used</span>
                        <span className="text-neutral-500">{limitGB} GB total</span>
                    </div>
                    <Progress value={percentage} className="h-2.5 bg-neutral-100 dark:bg-neutral-800" />
                    <p className="text-xs text-neutral-500 text-center mt-2">
                        {percentage >= 90 ? "You are running out of space!" : "Clean up old files to free up space."}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export function TimeTracking() {
    const { data: workspaceTimes, isLoading } = useWorkspaceTimeSpent();

    const formatTimeSpent = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
    };

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass overflow-hidden">
            <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-sm border border-indigo-200/50 dark:border-indigo-500/20">
                        <Timer className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">Time per Workspace</CardTitle>
                        <CardDescription className="text-sm text-neutral-500 mt-0.5">Total time spent across all your joined and owned workspaces</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <LoadingScreen fullScreen={false} messages={["Loading time tracking data..."]}>
                        <div className="p-6 space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-6 h-6 rounded" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-20 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </LoadingScreen>
                ) : !workspaceTimes || workspaceTimes.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center bg-neutral-50/30 dark:bg-neutral-900/20">
                        <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 flex items-center justify-center mb-4 shadow-sm">
                            <Clock className="w-7 h-7 text-neutral-400" />
                        </div>
                        <h4 className="text-neutral-900 dark:text-white font-medium text-base">No Time Tracked</h4>
                        <p className="text-sm text-neutral-500 mt-1 max-w-[250px] mx-auto">You haven't spent any time in your workspaces yet.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-neutral-100 dark:divide-neutral-800/60 bg-white dark:bg-transparent">
                        {workspaceTimes.map((wt, index) => (
                            <li key={wt.workspaceId} className="group flex items-center justify-between p-4 sm:px-6 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-all duration-200 ease-in-out">
                                <div className="flex items-center gap-4 sm:gap-5">
                                    <span className="text-sm font-mono text-neutral-400 dark:text-neutral-500 font-semibold min-w-[24px]">
                                        {(index + 1).toString().padStart(2, '0')}.
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <WorkspaceAvatar
                                            workspace={{ name: wt.workspaceName, avatar_url: wt.avatarUrl }}
                                            className="w-8 h-8 rounded-lg shadow-sm border border-neutral-200/60 dark:border-neutral-700/60"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {wt.workspaceName}
                                            </span>
                                            <span className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                                <Briefcase className="w-3 h-3 text-neutral-400" />
                                                /{wt.workspaceSlug}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right pl-4">
                                    <Badge variant="secondary" className="px-2.5 py-1 font-mono text-sm tracking-wide bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700">
                                        {formatTimeSpent(wt.timeSpentSeconds)}
                                    </Badge>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
