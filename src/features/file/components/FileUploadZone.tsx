"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X, Loader2 } from "lucide-react";
import { useUploadFile } from "@/features/file/hooks";
import { FileEntityType } from "@/features/file/types";
import { ALLOWED_MIME_TYPES } from "@/features/file/services";
import { Progress } from "@/components/ui/progress";

interface FileUploadZoneProps {
  workspaceId: string;
  entityType: FileEntityType;
  entityId: string;
  multiple?: boolean;
  onUploadComplete?: () => void;
  className?: string;
}

export default function FileUploadZone({
  workspaceId,
  entityType,
  entityId,
  multiple = true,
  onUploadComplete,
  className = "",
}: FileUploadZoneProps) {
  const uploadFile = useUploadFile(workspaceId);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; name: string; progress: number }[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const filesToUpload = multiple ? acceptedFiles : [acceptedFiles[0]];
      
      for (const file of filesToUpload) {
        if (!file) continue;
        
        const tempId = crypto.randomUUID();
        setUploadingFiles((prev) => [...prev, { id: tempId, name: file.name, progress: 10 }]);

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("workspaceId", workspaceId);
          formData.append("entityType", entityType);
          formData.append("entityId", entityId);

          // Simulate progress for UI feedback since fetch/server actions don't have native progress easily exposed
          const progressInterval = setInterval(() => {
            setUploadingFiles((prev) =>
              prev.map((f) => {
                if (f.id === tempId && f.progress < 90) {
                  return { ...f, progress: f.progress + 15 };
                }
                return f;
              })
            );
          }, 300);

          await uploadFile.mutateAsync(formData);
          
          clearInterval(progressInterval);
          setUploadingFiles((prev) => prev.filter((f) => f.id !== tempId));
        } catch (error) {
          console.error("Upload failed", error);
          setUploadingFiles((prev) => prev.filter((f) => f.id !== tempId));
        }
      }

      if (onUploadComplete) {
        onUploadComplete();
      }
    },
    [workspaceId, entityType, entityId, multiple, uploadFile, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple,
    accept: ALLOWED_MIME_TYPES.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxSize: 52428800, // 50MB soft limit here, real limit checked on server
  });

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed p-10 
          flex flex-col items-center justify-center text-center cursor-pointer
          transition-all duration-300 ease-in-out group bg-white
          ${isDragActive && !isDragReject ? "border-violet-500 bg-violet-50/50 scale-[1.02]" : "border-neutral-200 hover:border-violet-300 hover:bg-neutral-50"}
          ${isDragReject ? "border-red-500 bg-red-50/50" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className={`
          p-4 rounded-full mb-4 transition-colors duration-300
          ${isDragActive ? "bg-violet-100 text-violet-600" : "bg-neutral-100 text-neutral-500 group-hover:bg-violet-50 group-hover:text-violet-500"}
        `}>
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800 tracking-tight mb-1">
          {isDragActive ? "Drop files here" : "Click or drag to upload"}
        </h3>
        <p className="text-sm text-neutral-500 max-w-sm">
          {multiple ? "Upload multiple files." : "Upload a single file."} Max 50MB per file.
        </p>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          {uploadingFiles.map((file) => (
            <div key={file.id} className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 bg-violet-100 text-violet-600 rounded-lg shrink-0">
                    <FileIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700 truncate">{file.name}</span>
                </div>
                <Loader2 className="w-4 h-4 text-violet-500 animate-spin shrink-0" />
              </div>
              <Progress value={file.progress} className="h-2 bg-neutral-100" indicatorClassName="bg-violet-500 transition-all duration-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
