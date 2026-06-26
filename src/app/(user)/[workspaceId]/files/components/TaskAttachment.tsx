"use client";

import React, { useState } from "react";
import { useFiles, useDeleteFile } from "@/features/file/hooks";
import FileUploadZone from "./FileUploadZone";
import FilePreviewModal from "./modals/FilePreviewModal";
import { FileUpload } from "@/features/file/types";
import { Paperclip, Trash2, Image, FileText, FileSpreadsheet, FileIcon, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface TaskAttachmentProps {
  taskId: string;
  workspaceId: string;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return <Image className="w-4 h-4" />;
  if (mimeType.startsWith("text/")) return <FileText className="w-4 h-4" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType === "text/csv") return <FileSpreadsheet className="w-4 h-4" />;
  return <FileIcon className="w-4 h-4" />;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function TaskAttachment({ taskId, workspaceId }: TaskAttachmentProps) {
  const { data: files, isLoading } = useFiles(workspaceId, { entity_type: "task", entity_id: taskId });
  const deleteFile = useDeleteFile(workspaceId);

  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (confirm("Remove this attachment?")) {
      setDeletingId(fileId);
      try {
        await deleteFile.mutateAsync(fileId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
        <Paperclip className="w-4 h-4 text-muted-foreground" />
        Attachments
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8 bg-card border border-border border-dashed rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
        </div>
      ) : files && files.length > 0 ? (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {files.map(file => (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {getFileIcon(file.mime_type)}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{file.file_name}</span>
                    <span className="text-xs text-muted-foreground font-medium">{formatBytes(file.file_size)} • {formatDistanceToNow(new Date(file.created_at))} ago</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, file.id)}
                  disabled={deletingId === file.id}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0 disabled:opacity-50 opacity-0 group-hover:opacity-100"
                >
                  {deletingId === file.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="mt-2">
            <FileUploadZone
              workspaceId={workspaceId}
              entityType="task"
              entityId={taskId}
              multiple={true}
              className="!p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
            />
          </div>
        </div>
      ) : (
        <FileUploadZone
          workspaceId={workspaceId}
          entityType="task"
          entityId={taskId}
          multiple={true}
        />
      )}

      <FilePreviewModal
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </div>
  );
}