"use client";

import React from "react";
import Link from "next/link";
import { FolderPlus, FileText, FileImage, FileVideo, FileAudio, FileArchive, File as FileIcon, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFiles } from "@/features/file/hooks";

export function FilesWidgetSkeleton() {
   return (
      <Card className="h-full flex flex-col border-neutral-200/60 dark:border-neutral-800 shadow-sm relative overflow-hidden animate-pulse">
         <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg">
               <Skeleton className="w-5 h-5 rounded-full" />
               <Skeleton className="w-32 h-6 rounded-md" />
            </CardTitle>
         </CardHeader>
         <CardContent className="p-0 flex-1 flex flex-col pt-2">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                     <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                     <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/3" />
                     </div>
                  </div>
               ))}
            </div>
            <div className="mt-auto p-4 border-t border-neutral-100 dark:border-neutral-800/50 bg-background">
               <Skeleton className="h-10 w-full rounded-xl" />
            </div>
         </CardContent>
      </Card>
   );
}

const formatSize = (bytes: number) => {
   if (!bytes) return "0 B";
   const k = 1024;
   const sizes = ["B", "KB", "MB", "GB", "TB"];
   const i = Math.floor(Math.log(bytes) / Math.log(k));
   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (mimeType: string = "") => {
   const type = mimeType.toLowerCase();
   if (type.startsWith("image/")) return <FileImage className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
   if (type.startsWith("video/")) return <FileVideo className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
   if (type.startsWith("audio/")) return <FileAudio className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
   if (type.includes("zip") || type.includes("tar") || type.includes("rar") || type.includes("archive")) return <FileArchive className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
   if (type.includes("pdf") || type.includes("text") || type.includes("document") || type.includes("msword")) return <FileText className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
   return <FileIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />;
};

export function FilesWidget({ workspaceId }: { workspaceId: string }) {
   const { data: files, isLoading } = useFiles(workspaceId);

   if (isLoading) {
      return <FilesWidgetSkeleton />;
   }

   const hasFiles = files && files.length > 0;
   const recentFiles = files ? [...files].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4) : [];

   return (
      <Card className={`h-full flex flex-col shadow-sm relative overflow-hidden group ${!hasFiles ? 'border-dashed border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors' : 'border-neutral-200/60 dark:border-neutral-800'}`}>
         {hasFiles ? (
            <>
               <CardHeader className="border-b border-neutral-100 dark:border-neutral-800/50 pb-4 bg-muted/20">
                  <CardTitle className="flex items-center gap-2 text-lg">
                     <FolderPlus className="w-5 h-5 text-indigo-500" />
                     Recent Files
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                     {recentFiles.map((file: any) => (
                        <Link href={`/${workspaceId}/files`} key={file.id} className="p-4 hover:bg-accent/50 transition-colors flex items-center gap-3 group/item cursor-pointer block">
                           <div className="w-10 h-10 rounded-xl bg-background border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0 shadow-sm group-hover/item:scale-105 transition-transform">
                              {getFileIcon(file.mime_type)}
                           </div>
                           <div className="overflow-hidden flex-1">
                              <div className="text-sm font-bold truncate group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">{file.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center mt-1 font-medium">
                                 <span className="bg-muted px-1.5 py-0.5 rounded mr-2">{formatSize(file.size)}</span>
                                 <Clock className="w-3 h-3 mr-1" /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(file.created_at))}
                              </div>
                           </div>
                           <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                        </Link>
                     ))}
                  </div>
                  <div className="p-4 bg-background border-t border-neutral-100 dark:border-neutral-800/50 mt-auto">
                     <Button className="w-full shadow-sm rounded-xl font-bold border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" variant="outline" asChild>
                        <Link href={`/${workspaceId}/files`}>
                           <FolderPlus className="w-4 h-4 mr-2" />
                           Add more files
                        </Link>
                     </Button>
                  </div>
               </CardContent>
            </>
         ) : (
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-neutral-900 shadow-sm border border-neutral-100 dark:border-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-md">
                  <FolderPlus className="w-10 h-10 text-indigo-400 dark:text-indigo-600" />
               </div>
               <h3 className="font-black text-xl mb-2 text-foreground">Workspace Files</h3>
               <p className="text-sm font-medium text-muted-foreground mb-8 max-w-[250px] leading-relaxed">Add the first workspace file to keep resources organized.</p>
               <Button className="w-full flex flex-col items-center justify-center py-7 h-auto rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all border-none" asChild>
                  <Link href={`/${workspaceId}/files`}>
                     <span className="text-base font-black tracking-wide block">Upload First File</span>
                     <span className="text-xs font-medium opacity-80 mt-1 block">Start organizing your resources</span>
                  </Link>
               </Button>
            </CardContent>
         )}
      </Card>
   );
}
