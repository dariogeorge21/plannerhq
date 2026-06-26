"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, Loader2 } from "lucide-react";
import { useUploadFile } from "@/features/file/hooks";
import { FileEntityType } from "@/features/file/types";
import { ALLOWED_MIME_TYPES } from "@/features/file/services";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

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

      if (onUploadComplete) onUploadComplete();
    },
    [workspaceId, entityType, entityId, multiple, uploadFile, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple,
    accept: ALLOWED_MIME_TYPES.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxSize: 52428800,
  });

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed p-10 
          flex flex-col items-center justify-center text-center cursor-pointer
          transition-all duration-300 ease-in-out group bg-card
          ${isDragActive && !isDragReject ? "border-primary bg-primary/5 ring-4 ring-primary/20 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/50"}
          ${isDragReject ? "border-destructive bg-destructive/10 ring-4 ring-destructive/20" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className={`
          p-4 rounded-full mb-4 transition-colors duration-300 shadow-sm
          ${isDragActive ? "bg-primary/20 text-primary scale-110" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}
        `}>
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
          {isDragActive ? "Drop files to upload" : "Click or drag files here"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {multiple ? "Upload multiple files." : "Upload a single file."} Max 50MB per file.
        </p>
      </div>

      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-3 mt-2"
          >
            {uploadingFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                      <FileIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-foreground truncate">{file.name}</span>
                  </div>
                  <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                </div>
                <Progress value={file.progress} className="h-2 bg-muted" indicatorClassName="bg-primary transition-all duration-300" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}