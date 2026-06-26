"use client";

import React, { use } from "react";
import { useFiles, useWorkspaceQuota } from "@/features/file/hooks";
import FileUploadZone from "./components/FileUploadZone";
import FileList from "./components/FileList";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, Loader2, HardDrive } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkspaceFilesPage({ params: paramsPromise }: { params: Promise<{ workspaceId: string }> }) {
  const params = use(paramsPromise);
  const workspaceId = params.workspaceId;

  const { data: files, isLoading: filesLoading } = useFiles(workspaceId);
  const { data: quota, isLoading: quotaLoading } = useWorkspaceQuota(workspaceId);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStoragePercentage = () => {
    if (!quota) return 0;
    return Math.min(100, Math.round((quota.currentStorageBytes / quota.maxStorageBytes) * 100));
  };

  const percentage = getStoragePercentage();
  const isNearLimit = percentage > 90;

  return (
    <div className="flex flex-col h-full bg-background selection:bg-primary/20">
      <header className="flex items-center justify-between px-8 py-6 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Files</h1>
            <p className="text-sm font-medium text-muted-foreground">Manage your workspace attachments and documents.</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto flex flex-col gap-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Upload New File</h2>
              <FileUploadZone
                workspaceId={workspaceId}
                entityType="workspace"
                entityId={workspaceId}
                multiple={true}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Storage Quota</h2>
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 h-full">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground mb-2">
                  <HardDrive className="w-6 h-6" />
                </div>

                {quotaLoading ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">Calculating storage...</span>
                  </div>
                ) : quota ? (
                  <>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-foreground">{formatBytes(quota.currentStorageBytes)} Used</span>
                        <span className="text-muted-foreground">of {formatBytes(quota.maxStorageBytes)}</span>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2.5 bg-muted"
                        indicatorClassName={`transition-all duration-500 ${isNearLimit ? "bg-destructive" : "bg-primary"}`}
                      />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground mt-auto pt-4 border-t border-border">
                      Maximum file size: {formatBytes(quota.maxFileUploadBytes)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Unable to load quota information.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <h2 className="text-lg font-bold text-foreground tracking-tight">All Workspace Files</h2>
            {filesLoading ? (
              <div className="w-full py-20 flex flex-col items-center justify-center bg-card rounded-2xl border border-border shadow-sm">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Retrieving files...</p>
              </div>
            ) : (
              <FileList files={files || []} workspaceId={workspaceId} />
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}