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
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-background/80 backdrop-blur-2xl border-border shadow-2xl rounded-3xl">
        <DialogHeader className="p-6 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground truncate pr-8">
              {file.file_name}
            </DialogTitle>
            {signedUrl && (
              <Button onClick={handleDownload} variant="secondary" size="sm" className="hidden sm:flex gap-2 mt-6 font-semibold shadow-sm hover:scale-105 transition-transform">
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
          <DialogDescription className="text-muted-foreground font-medium text-sm">
            {(file.file_size / 1024 / 1024).toFixed(2)} MB • {file.mime_type}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/30 min-h-[500px] max-h-[70vh] flex flex-col items-center justify-center p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-semibold tracking-tight">Generating secure preview...</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-4 text-destructive">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertCircle className="w-12 h-12" />
              </div>
              <p className="font-semibold text-center text-foreground">Failed to load preview.<br /><span className="text-muted-foreground font-normal">The file may have been moved or no longer exists.</span></p>
            </div>
          )}

          {!isLoading && !isError && signedUrl && (
            <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
              {canPreview ? (
                <>
                  {isImage && (
                    <img
                      src={signedUrl}
                      alt={file.file_name}
                      className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg border border-border bg-card"
                    />
                  )}
                  {isPdf && (
                    <iframe
                      src={`${signedUrl}#view=FitH`}
                      className="w-full h-[60vh] rounded-xl border border-border shadow-lg bg-card"
                      title={file.file_name}
                    />
                  )}
                  {isText && (
                    <iframe
                      src={signedUrl}
                      className="w-full h-[60vh] rounded-xl border border-border shadow-lg bg-card p-6 font-mono text-sm text-foreground"
                      title={file.file_name}
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center text-center gap-6 max-w-sm">
                  <div className="w-28 h-28 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center shadow-inner ring-8 ring-background">
                    <FileIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Preview not available</h3>
                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                      This file format cannot be previewed natively in the browser. Download the file to view it locally.
                    </p>
                    <Button onClick={handleDownload} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 font-bold h-12 rounded-xl">
                      <Download className="w-5 h-5 mr-2" />
                      Download Securely
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