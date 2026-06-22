"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSignedUrl } from "@/features/file/hooks";
import { FileUpload } from "@/features/file/types";
import { Loader2, Download, AlertCircle, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewModalProps {
  file: FileUpload | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilePreviewModal({ file, isOpen, onClose }: FilePreviewModalProps) {
  // Query only enabled when file is selected
  const { data: signedUrl, isLoading, isError } = useSignedUrl(file?.storage_path || "");

  if (!file) return null;

  const isImage = file.mime_type.startsWith("image/");
  const isPdf = file.mime_type === "application/pdf";
  const isText = file.mime_type.startsWith("text/");
  const canPreview = isImage || isPdf || isText;

  const handleDownload = async () => {
    if (signedUrl) {
      window.open(signedUrl, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-neutral-200/60 shadow-2xl rounded-3xl">
        <DialogHeader className="p-6 border-b border-neutral-100 bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900 truncate pr-8">
              {file.file_name}
            </DialogTitle>
            {signedUrl && (
              <Button onClick={handleDownload} variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Download className="w-4 h-4" /> Download
              </Button>
            )}
          </div>
          <DialogDescription className="text-neutral-500 text-sm">
            {(file.file_size / 1024 / 1024).toFixed(2)} MB • {file.mime_type}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-neutral-50/50 min-h-[500px] max-h-[70vh] flex flex-col items-center justify-center p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-neutral-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="font-medium">Loading preview...</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-4 text-red-500">
              <AlertCircle className="w-12 h-12" />
              <p className="font-medium text-center">Failed to load preview.<br />The file may no longer exist.</p>
            </div>
          )}

          {!isLoading && !isError && signedUrl && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              {canPreview ? (
                <>
                  {isImage && (
                    <img
                      src={signedUrl}
                      alt={file.file_name}
                      className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm border border-neutral-200/60"
                    />
                  )}
                  {isPdf && (
                    <iframe
                      src={`${signedUrl}#view=FitH`}
                      className="w-full h-[60vh] rounded-lg border border-neutral-200/60 shadow-sm bg-white"
                      title={file.file_name}
                    />
                  )}
                  {isText && (
                    <iframe
                      src={signedUrl}
                      className="w-full h-[60vh] rounded-lg border border-neutral-200/60 shadow-sm bg-white p-4 font-mono text-sm"
                      title={file.file_name}
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center text-center gap-6 max-w-sm">
                  <div className="w-24 h-24 bg-violet-100 text-violet-600 rounded-3xl flex items-center justify-center shadow-inner">
                    <FileIcon className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Preview not available</h3>
                    <p className="text-neutral-500 mb-6 leading-relaxed">
                      This file format cannot be previewed in the browser. You can download the file to view it locally.
                    </p>
                    <Button onClick={handleDownload} className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-md">
                      <Download className="w-4 h-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
