'use client';

import { motion } from 'framer-motion';
import {
    Clock, CheckCircle2, ChevronRight,
    TrendingUp, Users, FolderKanban, BellRing,
    Briefcase, Calendar as CalendarIcon, Link as LinkIcon,
    ArrowUpNarrowWide
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Types
interface UserProps {
    user: any;
}

export function WelcomeHero({ user }: UserProps) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#0A0A0A] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl border border-neutral-200 dark:border-white/10"
        >
            {/* Sophisticated Ambient Glow / Aurora Effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 dark:bg-indigo-500/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-400/10 dark:bg-purple-500/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-blue-400/5 dark:bg-blue-500/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_10%)]" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100/80 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 mb-6 backdrop-blur-md"
                    >
                        {/* Current Subscription */}
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">Pro</span>
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

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 shrink-0"
                >
                    <Button className="h-12 px-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-medium transition-all hover:scale-105 active:scale-95 border border-transparent shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                        Dive to Workspace <ArrowUpNarrowWide className="w-4 h-4 mr-2" />
                    </Button>
                    <Button variant="outline" className="h-12 px-6 rounded-full bg-white/50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95">
                        <CalendarIcon className="w-4 h-4 mr-2 text-neutral-500 dark:text-neutral-400" /> View Schedule
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}

export function ProfileOverviewCard({ user }: UserProps) {
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
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {/* Display profiles.role for the user */}
                        </p>
                    </div>

                    {/* Redirect to /settings/profile */}
                    <Button variant="outline" size="sm" className="hidden sm:flex rounded-full">
                        Edit Profile
                    </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">12</p>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Workspaces</p>
                    </div>
                    <div className="text-center border-l border-neutral-100 dark:border-neutral-800">
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">4</p>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Members</p>
                    </div>
                    <div className="text-center border-l border-neutral-100 dark:border-neutral-800">
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">32h</p>
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Tracked</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function RecentWorkspaces() {
    const workspaces = [
        { id: 1, name: 'Design System', role: 'Admin', color: 'bg-blue-500' },
        { id: 2, name: 'Marketing Q3', role: 'Editor', color: 'bg-emerald-500' },
        { id: 3, name: 'Engineering', role: 'Viewer', color: 'bg-purple-500' },
    ];

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Recent Workspaces</CardTitle>
                <Button variant="ghost" size="sm" className="text-indigo-600 h-8 text-xs font-medium">View all</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {workspaces.map((ws) => (
                        <div key={ws.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${ws.color} shadow-sm`}>
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-indigo-600 transition-colors">{ws.name}</p>
                                    <p className="text-xs text-neutral-500">{ws.role}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function TaskPriorityBoard() {
    const tasks = [
        { id: 1, title: 'Finalize Q3 roadmap', project: 'Product Strategy', priority: 'High', status: 'In Progress' },
        { id: 2, title: 'Update design system components', project: 'Design System', priority: 'Medium', status: 'To Do' },
        { id: 3, title: 'Review marketing copy', project: 'Website Redesign', priority: 'Low', status: 'Done' },
    ];

    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Priority Tasks</CardTitle>
                <Button variant="outline" size="sm" className="h-8 rounded-full text-xs"><FolderKanban className="w-3 h-3 mr-2" /> Board View</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow group">
                            <button className={`mt-0.5 rounded-full w-5 h-5 flex flex-shrink-0 items-center justify-center border transition-colors ${task.status === 'Done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 dark:border-neutral-600 hover:border-indigo-500'}`}>
                                {task.status === 'Done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${task.status === 'Done' ? 'text-neutral-500 line-through' : 'text-neutral-900 dark:text-white'}`}>
                                    {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 rounded-md">
                                        {task.project}
                                    </Badge>
                                    <span className={`text-[10px] font-medium px-1.5 py-0 rounded-md ${task.priority === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                                            'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                        }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function MiniCalendar() {
    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-semibold text-neutral-900 dark:text-white">Today</span>
                </div>
                <span className="text-sm font-medium text-neutral-500">Oct 24</span>
            </div>
            <CardContent className="p-0">
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    <div className="p-4 flex gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <div className="w-12 text-center shrink-0">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white">10:00</p>
                            <p className="text-xs text-neutral-400">AM</p>
                        </div>
                        <div className="border-l-2 border-indigo-500 pl-4 py-1">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Design Sync</p>
                            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1"><Users className="w-3 h-3" /> 4 attendees</p>
                        </div>
                    </div>
                    <div className="p-4 flex gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors opacity-60">
                        <div className="w-12 text-center shrink-0">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white">01:30</p>
                            <p className="text-xs text-neutral-400">PM</p>
                        </div>
                        <div className="border-l-2 border-emerald-500 pl-4 py-1">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Product Review</p>
                            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Zoom</p>
                        </div>
                    </div>
                </div>
                <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
                    <Button variant="ghost" className="w-full text-xs font-medium h-8 text-neutral-600">View Full Calendar</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function UpcomingEvents() {
    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-amber-500" /> Reminders
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-4 flex gap-3">
                    <div className="mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-amber-100">Submit expense report</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-1">Due in 2 days</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function WorkspaceInvitations() {
    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass bg-gradient-to-b from-white to-indigo-50/50 dark:from-neutral-900 dark:to-indigo-950/20">
            <CardContent className="p-5 text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">New Invitation</h3>
                <p className="text-xs text-neutral-500 mb-4">Sarah invited you to join <strong>Marketing Repo</strong></p>
                <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm" className="h-8 text-xs px-4 rounded-full">Decline</Button>
                    <Button size="sm" className="h-8 text-xs px-4 rounded-full bg-indigo-600 hover:bg-indigo-700">Accept</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function KpiMetrics() {
    const metrics = [
        { label: 'Total Tasks', value: '142', change: '+12%', positive: true, icon: CheckCircle2 },
        { label: 'Time Logged', value: '45h', change: '+5%', positive: true, icon: Clock },
        { label: 'Productivity', value: '88%', change: '-2%', positive: false, icon: TrendingUp },
        { label: 'Active Projects', value: '12', change: '0%', positive: true, icon: FolderKanban },
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
                            <span className={`text-xs font-medium px-2 py-1 rounded-md ${metric.positive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-red-600 bg-red-50 dark:bg-red-500/10'}`}>
                                {metric.change}
                            </span>
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
    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Current Plan</CardTitle>
                <CardDescription>You are on the Pro tier.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl">
                    <div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Pro Plan - Annual</p>
                        <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-1">Renews on Jan 12, 2027</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900">
                        Manage
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function QuotaUsage() {
    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Storage Quota</CardTitle>
                <CardDescription>Workspace file storage usage.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">45 GB used</span>
                        <span className="text-neutral-500">100 GB total</span>
                    </div>
                    <Progress value={45} className="h-2.5 bg-neutral-100 dark:bg-neutral-800" />
                    <p className="text-xs text-neutral-500 text-center mt-2">You have 55 GB remaining. Clean up old files to free up space.</p>
                </div>
            </CardContent>
        </Card>
    );
}

export function TimeTracking() {
    return (
        <Card className="border-neutral-200/60 dark:border-neutral-800/60 shadow-glass bg-gradient-to-r from-neutral-900 to-neutral-800 text-white border-0">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-md">
                        <Clock className="w-6 h-6 text-white" />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-neutral-900 rounded-full animate-pulse"></span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-300">Currently Tracking</p>
                        <h3 className="text-xl font-bold font-mono tracking-wider mt-1">01:24:45</h3>
                    </div>
                </div>
                <div className="flex-1 max-w-sm w-full bg-black/20 p-3 rounded-xl border border-white/10">
                    <p className="text-xs text-neutral-400 mb-1">Project</p>
                    <p className="text-sm font-medium truncate">PlannerHQ Dashboard Redesign</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full">
                        Pause
                    </Button>
                    <Button className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white rounded-full border-0">
                        Stop
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
