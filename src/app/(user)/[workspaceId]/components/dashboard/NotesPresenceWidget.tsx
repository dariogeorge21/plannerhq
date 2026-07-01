"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GetWorkspaceMembers } from "@/features/workspace/workspace";
import { useDocuments } from "@/features/document/hooks";
import { FileText, Bold, Italic, Underline, Heading1, Clock, ArrowRight } from "lucide-react";
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
  
  const { data: membersRes } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => GetWorkspaceMembers(workspaceId)
  });

  const { data: documents, isLoading } = useDocuments(workspaceId);

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

  const sortedDocuments = documents ? [...documents].sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) : [];

  return (
    <Card className="h-full flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
       <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
       <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20 z-10">
          <CardTitle className="flex items-center gap-2 text-lg">
             <FileText className="w-5 h-5 text-indigo-500" />
             {sortedDocuments.length > 0 ? 'Recent Notes' : 'Write Notes'}
          </CardTitle>
       </CardHeader>
       <CardContent className="p-0 flex-1 flex flex-col z-10">
          {sortedDocuments.length > 0 ? (
            <div className="flex-1 flex flex-col">
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                 {sortedDocuments.slice(0, 4).map((doc: any) => (
                    <Link href={`/${workspaceId}/docs/${doc.id}`} key={doc.id} className="p-4 hover:bg-accent/50 transition-colors flex items-center gap-3 group/item cursor-pointer block">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center shrink-0 shadow-sm group-hover/item:scale-105 transition-transform">
                           {doc.icon ? <span className="text-xl">{doc.icon}</span> : <FileText className="w-5 h-5 text-indigo-500" />}
                        </div>
                        <div className="overflow-hidden flex-1">
                           <div className="text-sm font-bold truncate group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">{doc.title || "Untitled Document"}</div>
                           {doc.updated_at && <div className="text-xs text-muted-foreground flex items-center mt-1 font-medium"><Clock className="w-3 h-3 mr-1" /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(doc.updated_at))}</div>}
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                    </Link>
                 ))}
              </div>
              <div className="p-4 bg-background border-t border-neutral-100 dark:border-neutral-800/50 mt-auto">
                <Button className="w-full shadow-sm rounded-xl font-bold border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" variant="outline" asChild>
                   <Link href={`/${workspaceId}/docs`}>View All Notes</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex-1 flex flex-col">
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

              <Button className="w-full flex flex-col items-start py-7 px-5 h-auto rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all border-none" asChild>
                 <Link href={`/${workspaceId}/docs`}>
                   <div className="flex items-center justify-between w-full">
                     <div className="text-left">
                       <span className="text-base font-black tracking-wide block">Create New Doc</span>
                       <span className="text-xs font-medium opacity-80 mt-1 block">Start writing study material or notes</span>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                       <ArrowRight className="w-4 h-4 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                     </div>
                   </div>
                 </Link>
              </Button>
            </div>
          )}
       </CardContent>
    </Card>
  );
}
