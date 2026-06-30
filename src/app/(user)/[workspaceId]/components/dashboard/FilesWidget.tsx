"use client";

import React from "react";
import Link from "next/link";
import { FolderPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FilesWidget({ workspaceId }: { workspaceId: string }) {
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
