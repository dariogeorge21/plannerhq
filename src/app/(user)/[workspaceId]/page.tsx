"use client";

import React, { use, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetWorkspace, GetWorkspaceMembers } from "@/features/workspace/workspace";
import { GetUserProfileOverview } from "@/features/dashboard/services";
import { useTasks } from "@/features/task/hooks";
import { useCalendarEvents } from "@/features/calendar/hooks";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquareIcon,
  SquareKanban,
  CalendarDays,
  FolderOpen,
  Users,
  Settings,
  FolderPlus,
  Bold,
  Italic,
  Underline,
  Heading1,
  Sparkles,
  Inbox,
  Clock,
  CheckCircle2,
  CircleDashed,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Configuration
const navLinks = [
  { name: "Overview", href: "", icon: LayoutDashboard, exact: true },
  { name: "Notes", href: "/docs", icon: FileText, exact: false },
  { name: "Chat", href: "/chat", icon: MessageSquareIcon, exact: false },
  { name: "Tasks", href: "/tasks", icon: SquareKanban, exact: false },
  { name: "Calendar", href: "/calendar", icon: CalendarDays, exact: false },
  { name: "Files", href: "/files", icon: FolderOpen, exact: false },
  { name: "Members", href: "/members", icon: Users, exact: false },
  { name: "Settings", href: "/settings", icon: Settings, exact: false },
];

import { LoadingScreen } from "@/components/ui/loading-screen";

function DashboardSkeleton() {
  return (
    <LoadingScreen messages={["Loading your workspace...", "Fetching tasks...", "Preparing calendar..."]}>
      <div className="max-w-7xl mx-auto p-6 xl:p-8 space-y-8 animate-pulse">
        <Skeleton className="h-48 w-full rounded-[2rem]" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8 flex flex-col">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                <Skeleton className="h-80 w-full rounded-2xl" />
                <Skeleton className="h-80 w-full rounded-2xl" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
             </div>
          </div>
          <div className="lg:col-span-4 space-y-8 flex flex-col">
             <Skeleton className="h-full min-h-[400px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </LoadingScreen>
  );
}

function WelcomeHero({ workspace, members, profile }: { workspace: any, members: any[], profile: any }) {
  const nonOwnerMembers = members.filter(m => m.role !== 'owner');
  const adminCount = nonOwnerMembers.filter(m => m.role === 'admin').length;
  const memberCount = nonOwnerMembers.filter(m => m.role === 'member').length;
  const createdByMember = members.find(m => m.user_id === workspace.created_by);
  const createdByName = createdByMember ? createdByMember.display_name : "Unknown";

  return (
    <motion.section 
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[2rem] bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 p-8 md:p-12 shadow-xl shadow-indigo-500/5 dark:shadow-none"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full -z-10" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase border border-indigo-100 dark:border-indigo-800/50">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Welcome {profile.displayName} to {workspace.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Badge variant="outline" className="bg-white/60 dark:bg-black/60 shadow-sm border-neutral-200/60 dark:border-neutral-800 py-1">
              <Calendar className="w-3 h-3 mr-1.5 text-indigo-500" />
              Created {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(workspace.created_at))}
            </Badge>
            <Badge variant="outline" className="bg-white/60 dark:bg-black/60 shadow-sm border-neutral-200/60 dark:border-neutral-800 py-1">
              By <span className="font-semibold ml-1">{createdByName}</span>
            </Badge>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 py-1 border-indigo-200 dark:border-indigo-800">
              {adminCount} Admins, {memberCount} Members
            </Badge>
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white font-bold text-4xl md:text-5xl shadow-indigo-500/30">
          {workspace.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </motion.section>
  );
}

function NavigationMatrix({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
      {navLinks.map((link) => {
        const fullHref = `/${workspaceId}${link.href}`;
        const isActive = link.exact ? pathname === fullHref : pathname.startsWith(fullHref);
        
        return (
          <Link key={link.name} href={fullHref} className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-card border hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-md transition-all duration-300 group ${isActive ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-background border-transparent' : 'border-neutral-200/60 dark:border-neutral-800'}`}>
             <link.icon className={`w-6 h-6 mb-2 transition-colors ${isActive ? 'text-indigo-500' : 'text-muted-foreground group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`} />
             <span className={`text-xs font-bold tracking-wide transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground group-hover:text-foreground'}`}>{link.name}</span>
          </Link>
        )
      })}
    </div>
  );
}

function MembersWidget({ members, workspaceId }: { members: any[], workspaceId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedMembers = isExpanded ? members : members.slice(0, 5);
  const hasMore = members.length > 5;

  return (
    <Card className="h-full flex flex-col relative overflow-hidden border-neutral-200/60 dark:border-neutral-800 shadow-sm">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-indigo-500" />
          Workspace Members
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative flex flex-col">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
          {displayedMembers.map(m => (
            <div key={m.hqid} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-neutral-200 dark:border-neutral-700">
                   <AvatarImage src={m.avatar_url} />
                   <AvatarFallback className="font-bold text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                     {m.display_name.charAt(0).toUpperCase()}
                   </AvatarFallback>
                </Avatar>
                <div>
                   <div className="text-sm font-bold leading-none mb-1">{m.display_name}</div>
                   <div className="text-xs text-muted-foreground font-medium">{m.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400" asChild onClick={(e) => e.stopPropagation()}>
                    <Link href={`/${workspaceId}/chat/${m.hqid}`}>
                       <MessageSquareIcon className="w-4 h-4" />
                    </Link>
                 </Button>
                 
                 <Dialog>
                   <DialogTrigger asChild>
                     <Button variant="outline" size="sm" className="hidden sm:flex h-8 text-xs font-semibold rounded-full border-neutral-200 dark:border-neutral-700">Profile</Button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-md rounded-3xl">
                     <DialogHeader>
                       <DialogTitle className="text-center text-xl font-black">Member Profile</DialogTitle>
                     </DialogHeader>
                     <div className="flex flex-col items-center justify-center p-6 space-y-5">
                        <Avatar className="w-28 h-28 border-4 border-indigo-50 dark:border-indigo-950 shadow-xl">
                           <AvatarImage src={m.avatar_url} />
                           <AvatarFallback className="text-4xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                             {m.display_name.charAt(0).toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                        <div className="text-center space-y-1">
                           <h3 className="text-2xl font-black text-foreground">{m.display_name}</h3>
                           <p className="text-sm font-medium text-muted-foreground">{m.email}</p>
                           <p className="text-xs font-mono text-muted-foreground/70 bg-muted/50 px-2 py-1 rounded-md mt-2 inline-block">HQID: {m.hqid}</p>
                        </div>
                        <Badge variant="secondary" className={`uppercase tracking-widest px-4 py-1 text-xs font-bold rounded-full ${m.role === 'owner' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                          {m.role}
                        </Badge>
                     </div>
                   </DialogContent>
                 </Dialog>
              </div>
            </div>
          ))}
        </div>
        {!isExpanded && hasMore && (
           <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </CardContent>
      {!isExpanded && hasMore && (
         <div className="p-3 border-t border-neutral-100 dark:border-neutral-800/50 bg-background/80 backdrop-blur-sm z-10 flex justify-center mt-auto">
            <Button variant="ghost" className="w-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl font-bold" onClick={() => setIsExpanded(true)}>View More Members</Button>
         </div>
      )}
    </Card>
  );
}

function TasksWidget({ workspaceId }: { workspaceId: string }) {
  const { data: tasks, isLoading } = useTasks(workspaceId);

  return (
    <Card className="h-full relative overflow-hidden flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm">
       <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
             <SquareKanban className="w-5 h-5 text-indigo-500" />
             Active Tasks
          </CardTitle>
       </CardHeader>
       <CardContent className="p-0 flex-1">
          {isLoading ? (
            <div className="p-4 space-y-3">
               {[1,2,3,4].map(i => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}
            </div>
          ) : tasks && tasks.length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
               {tasks.slice(0, 4).map((task: any) => (
                  <div key={task.id} className="p-4 hover:bg-accent/50 transition-colors flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                        {task.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <CircleDashed className="w-5 h-5 text-neutral-300 dark:text-neutral-600 group-hover:text-indigo-400 transition-colors" />}
                        <div>
                           <div className="text-sm font-bold leading-none mb-1">{task.title}</div>
                           {task.due_date && <div className="text-xs font-medium text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(task.due_date))}</div>}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          ) : (
             <div className="py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shadow-inner">
                   <Inbox className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
                </div>
                <p className="text-muted-foreground font-semibold">No tasks, Create Now</p>
             </div>
          )}
       </CardContent>
       <div className="p-4 bg-background border-t border-neutral-100 dark:border-neutral-800/50 mt-auto">
          <Button className="w-full shadow-sm rounded-xl font-bold" variant={tasks?.length ? "outline" : "default"} asChild>
             <Link href={`/${workspaceId}/tasks`}>{tasks?.length ? "View Tasks in the workspace" : "Create Task"}</Link>
          </Button>
       </div>
    </Card>
  );
}

function NotesPresenceWidget({ members, workspaceId }: { members: any[], workspaceId: string }) {
  const [activeWriter, setActiveWriter] = useState<string | null>(null);
  
  useEffect(() => {
     if (members.length > 1) {
       const timer = setTimeout(() => {
          const others = members.filter(m => m.role !== 'owner'); 
          if (others.length) setActiveWriter(others[Math.floor(Math.random() * others.length)].display_name);
       }, 2500);
       return () => clearTimeout(timer);
     }
  }, [members]);

  return (
    <Card className="h-full flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
       <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
       <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20 z-10">
          <CardTitle className="flex items-center gap-2 text-lg">
             <FileText className="w-5 h-5 text-indigo-500" />
             Write Notes
          </CardTitle>
       </CardHeader>
       <CardContent className="p-6 flex-1 flex flex-col z-10">
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-neutral-200/60 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 shadow-sm w-fit mb-6">
             <div className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"><Bold className="w-4 h-4" /></div>
             <div className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"><Italic className="w-4 h-4" /></div>
             <div className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"><Underline className="w-4 h-4" /></div>
             <div className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"><Heading1 className="w-4 h-4" /></div>
          </div>
          
          <div className="mt-auto mb-6 h-8">
             <AnimatePresence mode="wait">
               {activeWriter && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 w-fit px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"/>
                     {activeWriter} is writing something...
                  </motion.div>
               )}
             </AnimatePresence>
          </div>

          <Button className="w-full flex flex-col items-start py-7 px-5 h-auto rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20" asChild>
             <Link href={`/${workspaceId}/docs`}>
               <span className="text-base font-black tracking-wide">Go and write</span>
               <span className="text-xs font-medium opacity-80 mt-1">Create study material or notes</span>
             </Link>
          </Button>
       </CardContent>
    </Card>
  );
}

function CalendarWidget({ workspaceId }: { workspaceId: string }) {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const { data: events, isLoading } = useCalendarEvents(workspaceId, { 
    start: today.toISOString(), 
    end: nextWeek.toISOString() 
  });

  return (
    <Card className="h-full flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm">
       <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
             <CalendarDays className="w-5 h-5 text-indigo-500" />
             Upcoming Schedule
          </CardTitle>
       </CardHeader>
       <CardContent className="p-0 flex-1 flex flex-col">
          {isLoading ? (
            <div className="p-4 space-y-3">
               {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
            </div>
          ) : events && events.length > 0 ? (
             <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50 flex-1">
               {events.slice(0, 4).map((event: any) => {
                 const start = new Date(event.start_at);
                 return (
                  <Link key={event.id} href={`/${workspaceId}/calendar?eventId=${event.id}`} className="flex items-center p-5 hover:bg-accent/50 transition-colors group">
                     <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center mr-5 border border-indigo-100 dark:border-indigo-900/50 group-hover:bg-indigo-500 group-hover:text-white transition-colors shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest">{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(start)}</span>
                        <span className="text-xl font-black leading-none mt-0.5">{start.getDate()}</span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{event.title}</div>
                        <div className="text-xs font-semibold text-muted-foreground mt-1 flex items-center"><Clock className="w-3 h-3 mr-1 opacity-70"/> {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(start)}</div>
                     </div>
                  </Link>
               )})}
             </div>
          ) : (
             <div className="py-16 flex flex-col items-center justify-center gap-4 px-6 text-center flex-1">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shadow-inner mb-2">
                  <CalendarDays className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
                </div>
                <p className="text-sm text-muted-foreground font-semibold max-w-[200px]">Schedule meetings and Create Events alternatively</p>
             </div>
          )}
       </CardContent>
       <div className="p-4 bg-background border-t border-neutral-100 dark:border-neutral-800/50 mt-auto">
          <Button className="w-full rounded-xl font-bold shadow-sm" variant="outline" asChild>
             <Link href={`/${workspaceId}/calendar`}>Checkout Calendar</Link>
          </Button>
       </div>
    </Card>
  );
}

function FilesWidget({ workspaceId }: { workspaceId: string }) {
  return (
    <Card className="h-full flex flex-col border-dashed border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 group hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
       <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-neutral-900 shadow-sm border border-neutral-100 dark:border-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-md">
             <FolderPlus className="w-10 h-10 text-indigo-400 dark:text-indigo-600" />
          </div>
          <h3 className="font-black text-xl mb-2 text-foreground">Workspace Files</h3>
          <p className="text-sm font-medium text-muted-foreground mb-8 max-w-[250px] leading-relaxed">Add the first workspace file to keep resources organized.</p>
          <Button className="rounded-xl font-bold px-8 shadow-sm" variant="secondary" asChild>
             <Link href={`/${workspaceId}/files`}>Upload more files</Link>
          </Button>
       </CardContent>
    </Card>
  );
}

export default function WorkspacePage({
  params: paramsPromise,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const params = use(paramsPromise);
  const workspaceId = params.workspaceId;

  const { data: wsRes, isLoading: wsLoading } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => GetWorkspace(workspaceId)
  });
  const workspace = wsRes?.data;

  const { data: membersRes, isLoading: memLoading } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => GetWorkspaceMembers(workspaceId)
  });
  const members = membersRes?.data || [];

  const { data: profileRes, isLoading: profLoading } = useQuery({
    queryKey: ["userProfileOverview"],
    queryFn: () => GetUserProfileOverview()
  });
  const profile = profileRes?.data;

  const isLoading = wsLoading || memLoading || profLoading || !workspace || !profile;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 xl:p-8 space-y-8 min-h-screen pb-20">
      <WelcomeHero workspace={workspace} members={members} profile={profile} />
      
      <NavigationMatrix workspaceId={workspaceId} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8 flex flex-col">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              <TasksWidget workspaceId={workspaceId} />
              <MembersWidget members={members} workspaceId={workspaceId} />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <NotesPresenceWidget members={members} workspaceId={workspaceId} />
              <FilesWidget workspaceId={workspaceId} />
           </div>
        </div>
        <div className="lg:col-span-4 space-y-8 flex flex-col">
           <div className="flex-1">
             <CalendarWidget workspaceId={workspaceId} />
           </div>
        </div>
      </div>
    </div>
  );
}