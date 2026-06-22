"use client";

import React, { useState } from "react";
import { FileUpload } from "@/features/file/types";
import { useDeleteFile } from "@/features/file/hooks";
import { FileIcon, Trash2, Image, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import FilePreviewModal from "./modals/FilePreviewModal";

interface FileListProps {
  files: FileUpload[];
  workspaceId: string;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return <Image className="w-5 h-5" />;
  if (mimeType.startsWith("text/")) return <FileText className="w-5 h-5" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType === "text/csv") return <FileSpreadsheet className="w-5 h-5" />;
  return <FileIcon className="w-5 h-5" />;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function FileList({ files, workspaceId }: FileListProps) {
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteFile = useDeleteFile(workspaceId);

  const handleDelete = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
      setDeletingId(fileId);
      try {
        await deleteFile.mutateAsync(fileId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-neutral-200 border-dashed">
        <div className="w-16 h-16 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mb-4">
          <FileIcon className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-neutral-800 mb-1">No files yet</h3>
        <p className="text-neutral-500 max-w-sm">
          Upload files to share them with your workspace members.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => setSelectedFile(file)}
            className="group flex items-center justify-between p-4 bg-white border border-neutral-200/60 rounded-2xl hover:border-violet-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 shadow-inner">
                {getFileIcon(file.mime_type)}
              </div>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-neutral-900 truncate">
                  {file.file_name}
                </span>
                <span className="text-xs text-neutral-500 font-medium mt-0.5">
                  {formatBytes(file.file_size)} • Uploaded {formatDistanceToNow(new Date(file.created_at))} ago
                </span>
              </div>
            </div>

            <div className="pl-4 shrink-0">
              <button
                onClick={(e) => handleDelete(e, file.id)}
                disabled={deletingId === file.id}
                className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {deletingId === file.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <FilePreviewModal
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </>
  );
}
