"use client";

import React, { use } from "react";
import { useFiles, useWorkspaceQuota } from "@/features/file/hooks";
import FileUploadZone from "@/features/file/components/FileUploadZone";
import FileList from "@/features/file/components/FileList";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, Loader2, HardDrive } from "lucide-react";

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

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-neutral-200/60 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shadow-inner">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Files</h1>
            <p className="text-sm font-medium text-neutral-500">Manage your workspace attachments and documents.</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Upload New File</h2>
              <FileUploadZone 
                workspaceId={workspaceId} 
                entityType="workspace" 
                entityId={workspaceId} 
                multiple={true} 
              />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Storage Quota</h2>
              <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 shadow-sm flex flex-col gap-4 h-full">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-500 mb-2">
                  <HardDrive className="w-6 h-6" />
                </div>
                {quotaLoading ? (
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Loading quota...</span>
                  </div>
                ) : quota ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-neutral-900">{formatBytes(quota.currentStorageBytes)} Used</span>
                        <span className="text-neutral-500">of {formatBytes(quota.maxStorageBytes)}</span>
                      </div>
                      <Progress 
                        value={getStoragePercentage()} 
                        className="h-2.5 bg-neutral-100" 
                        indicatorClassName={getStoragePercentage() > 90 ? "bg-red-500" : "bg-violet-500"} 
                      />
                    </div>
                    <p className="text-xs font-medium text-neutral-500 mt-auto pt-4 border-t border-neutral-100">
                      Maximum file size: {formatBytes(quota.maxFileUploadBytes)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-neutral-500">Unable to load quota.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">All Files</h2>
            {filesLoading ? (
              <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-neutral-200/60 shadow-sm">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-4" />
                <p className="text-neutral-500 font-medium">Loading files...</p>
              </div>
            ) : (
              <FileList files={files || []} workspaceId={workspaceId} />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
