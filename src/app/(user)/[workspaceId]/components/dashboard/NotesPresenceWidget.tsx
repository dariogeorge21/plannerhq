"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GetWorkspaceMembers } from "@/features/workspace/workspace";
import { FileText, Bold, Italic, Underline, Heading1 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export function NotesPresenceWidgetSkeleton() {
  return (
    <Card className="h-full flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm relative overflow-hidden animate-pulse">
      <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20 z-10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-md" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col z-10">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-neutral-200/60 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 shadow-sm w-fit mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-7 h-7 rounded-lg" />
          ))}
        </div>
        <div className="mt-auto mb-6 h-8 flex items-center">
          <Skeleton className="h-8 w-48 rounded-full" />
        </div>
        <Skeleton className="w-full h-[88px] rounded-2xl" />
      </CardContent>
    </Card>
  );
}

export function NotesPresenceWidget({ workspaceId }: { workspaceId: string }) {
  const [activeWriter, setActiveWriter] = useState<string | null>(null);
  
  const { data: membersRes, isLoading } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => GetWorkspaceMembers(workspaceId)
  });

  const members = membersRes?.data || [];

  useEffect(() => {
     if (members.length > 1) {
       const timer = setTimeout(() => {
          const others = members.filter((m: any) => m.role !== 'owner'); 
          if (others.length) setActiveWriter(others[Math.floor(Math.random() * others.length)].display_name);
       }, 2500);
       return () => clearTimeout(timer);
     }
  }, [members]);

  if (isLoading) {
    return <NotesPresenceWidgetSkeleton />;
  }

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
