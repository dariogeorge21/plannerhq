'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, CheckCircle2, ChevronRight,
    TrendingUp, Users, FolderKanban, BellRing,
    Briefcase, Calendar as CalendarIcon, Link as LinkIcon,
    ArrowUpNarrowWide, Loader2, Plus, Search
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

import { useSubscription } from '@/features/billing/hooks/useSubscription';
import {
    useUserWorkspaces,
    useUserPendingInvitations,
    useUserTasks,
    useDashboardCalendarEvents,
    useUserProfileStats
} from '@/features/dashboard/hooks/UseDashboardData';
import { useToggleTaskCompletion } from '@/features/task/hooks';
import { AcceptInvitation, DeclineInvitation } from '@/features/workspace/invites';
import { TrackWorkspaceTime } from '@/features/workspace/workspace';

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

    const firstWorkspace = workspaces?.[0];

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
                            {user?.displayName?.split(' ')[0] || 'User'}
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
                                disabled={!firstWorkspace || isNavigating}
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
    const { data: stats, isLoading } = useUserProfileStats(user?.id);

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl">
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-indigo-100 dark:border-indigo-900">
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback className="text-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            {user?.displayName?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                            {user?.displayName || 'User Profile'}
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">
                            {user?.role || 'User'}
                        </p>
                    </div>

                    <Button onClick={() => router.push('/settings/profile')} variant="outline" size="sm" className="hidden sm:flex rounded-full">
                        Edit Profile
                    </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="text-center">
                        {isLoading ? <Skeleton className="w-12 h-8 mx-auto" /> : <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats?.workspaceCount || 0}</p>}
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Workspaces</p>
                    </div>
                    <div className="text-center border-l border-neutral-100 dark:border-neutral-800">
                        {isLoading ? <Skeleton className="w-12 h-8 mx-auto" /> : <p className="text-2xl font-bold text-neutral-900 dark:text-white">{Math.floor((stats?.timeTrackedSeconds || 0) / 3600)}h</p>}
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Tracked</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function RecentWorkspaces() {
    const router = useRouter();
    const { data: workspaces, isLoading } = useUserWorkspaces();

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Recent Workspaces</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3">
                                <Skeleton className="w-10 h-10 rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="w-24 h-4" />
                                    <Skeleton className="w-16 h-3" />
                                </div>
                            </div>
                        ))
                    ) : workspaces && workspaces.length > 0 ? (
                        workspaces.slice(0, 3).map((ws) => (
                            <div
                                key={ws.id}
                                onClick={() => router.push(`/${ws.slug || ws.id}`)}
                                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                            >
                                <div className="flex items-center gap-3">
                                    <WorkspaceAvatar workspace={{ name: ws.name, avatar_url: ws.avatar_url }} className="w-10 h-10 rounded-xl" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors">{ws.name}</p>
                                        <p className="text-xs text-neutral-500 capitalize">{ws.role}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-neutral-500 p-3">No workspaces found.</p>
                    )}
                </div>
            </CardContent>
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

    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter((t: any) => t.completed).length || 0;
    const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const metrics = [
        { label: 'Total Tasks', value: totalTasks.toString(), change: '', positive: true, icon: CheckCircle2 },
        { label: 'Time Logged', value: `${Math.floor((stats?.timeTrackedSeconds || 0) / 3600)}h`, change: '', positive: true, icon: Clock },
        { label: 'Productivity', value: `${productivity}%`, change: '', positive: productivity > 50, icon: TrendingUp },
        { label: 'Active Workspaces', value: (stats?.workspaceCount || 0).toString(), change: '', positive: true, icon: FolderKanban },
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

    if (loading) return <Skeleton className="h-40 w-full rounded-2xl" />;

    const planName = subData?.plan?.id || 'Free';
    const renewalDate = subData?.subscription?.current_period_end
        ? new Date(subData.subscription.current_period_end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : 'Never';

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Current Plan</CardTitle>
                <CardDescription>You are on the <span className="capitalize">{planName}</span> tier.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl">
                    <div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200 capitalize">{planName} Plan</p>
                        {planName !== 'free' && (
                            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-1">Renews on {renewalDate}</p>
                        )}
                    </div>
                    <Button onClick={() => router.push('/settings/billing')} variant="outline" size="sm" className="rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900">
                        Manage
                    </Button>
                </div>
            </CardContent>
        </Card>
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
    const { data: workspaces } = useUserWorkspaces();
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load active timer from local storage to persist across reloads
    useEffect(() => {
        const stored = localStorage.getItem('plannerhq_timer_state');
        if (stored) {
            const parsed = JSON.parse(stored);
            setTime(parsed.time || 0);
            setIsActive(parsed.isActive || false);
            if (parsed.isActive && parsed.lastTick) {
                // Add elapsed time since last unmount
                const elapsed = Math.floor((Date.now() - parsed.lastTick) / 1000);
                setTime(t => t + elapsed);
            }
        }
    }, []);

    // Save timer state periodically and on unmount
    useEffect(() => {
        const saveState = () => {
            localStorage.setItem('plannerhq_timer_state', JSON.stringify({
                time,
                isActive,
                lastTick: Date.now()
            }));
        };

        saveState();
        return () => saveState();
    }, [time, isActive]);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const stopTimer = async () => {
        setIsActive(false);
        if (time > 0 && workspaces && workspaces.length > 0) {
            // Log to the first available workspace (usually the most recent)
            const wsId = workspaces[0].id;
            try {
                await TrackWorkspaceTime(wsId, time);
                toast.success("Time logged to workspace");
            } catch (e) {
                toast.error("Failed to log time");
            }
        }
        setTime(0);
        localStorage.removeItem('plannerhq_timer_state');
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass bg-gradient-to-r from-neutral-900 to-neutral-800 text-white border-0">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-md">
                        <Clock className="w-6 h-6 text-white" />
                        {isActive && <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-neutral-900 rounded-full animate-pulse"></span>}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-300">Currently Tracking</p>
                        <h3 className="text-xl font-bold font-mono tracking-wider mt-1">{formatTime(time)}</h3>
                    </div>
                </div>
                <div className="flex-1 max-w-sm w-full bg-black/20 p-3 rounded-xl border border-white/10">
                    <p className="text-xs text-neutral-400 mb-1">Active Context</p>
                    <p className="text-sm font-medium truncate">
                        {workspaces && workspaces.length > 0 ? workspaces[0].name : "No active workspace"}
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button onClick={toggleTimer} variant="outline" className="flex-1 md:flex-none border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full">
                        {isActive ? "Pause" : "Resume"}
                    </Button>
                    <Button onClick={stopTimer} disabled={time === 0} className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white rounded-full border-0 disabled:opacity-50 disabled:bg-emerald-500">
                        Stop & Log
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
