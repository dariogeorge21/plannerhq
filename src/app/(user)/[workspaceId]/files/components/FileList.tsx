"use client";

import React, { useState, useMemo } from "react";
import { FileUpload } from "@/features/file/types";
import { useDeleteFile } from "@/features/file/hooks";
import {
  FileIcon,
  Trash2,
  Image,
  FileText,
  FileSpreadsheet,
  Loader2,
  FileQuestion,
  Search,
  ArrowUpDown,
  SlidersHorizontal
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import FilePreviewModal from "./modals/FilePreviewModal";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FileListProps {
  files: FileUpload[];
  workspaceId: string;
}

type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "size-desc" | "size-asc";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } }
};

export default function FileList({ files, workspaceId }: FileListProps) {
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

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

  // Process sorting and searching metrics efficiently using useMemo
  const filteredAndSortedFiles = useMemo(() => {
    if (!files) return [];

    return files
      .filter((file) =>
        file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "date-asc":
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case "name-asc":
            return a.file_name.localeCompare(b.file_name);
          case "name-desc":
            return b.file_name.localeCompare(a.file_name);
          case "size-desc":
            return b.file_size - a.file_size;
          case "size-asc":
            return a.file_size - b.file_size;
          case "date-desc":
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [files, searchQuery, sortBy]);

  const getSortLabel = (option: SortOption) => {
    const labels: Record<SortOption, string> = {
      "date-desc": "Newest Uploaded",
      "date-asc": "Oldest Uploaded",
      "name-asc": "Alphabetical (A-Z)",
      "name-desc": "Alphabetical (Z-A)",
      "size-desc": "Size (Largest)",
      "size-asc": "Size (Smallest)",
    };
    return labels[option];
  };

  // Base Empty State (No files exist in workspace context)
  if (!files || files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full py-20 flex flex-col items-center justify-center text-center bg-card border border-border border-dashed rounded-2xl shadow-sm"
      >
        <div className="w-20 h-20 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-5 ring-8 ring-background">
          <FileIcon className="w-10 h-10 opacity-70" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No files uploaded yet</h3>
        <p className="text-muted-foreground max-w-sm text-sm">
          Keep your workspace organized. Upload documents, images, and spreadsheets to share them with your team.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        {/* INTERACTIVE CONTROLS BAR */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full bg-card border border-border p-3 rounded-2xl shadow-xs">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search files by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-background/50 border-border rounded-xl text-sm focus-visible:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 flex gap-2 border-border font-semibold text-xs text-muted-foreground hover:text-foreground">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort: {getSortLabel(sortBy)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-border bg-card">
                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">Sort Criteria</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)} className="p-1">
                  <DropdownMenuRadioItem value="date-desc" className="rounded-lg text-sm cursor-pointer font-medium">Newest Uploaded</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="date-asc" className="rounded-lg text-sm cursor-pointer font-medium">Oldest Uploaded</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-asc" className="rounded-lg text-sm cursor-pointer font-medium">Alphabetical (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-desc" className="rounded-lg text-sm cursor-pointer font-medium">Alphabetical (Z-A)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="size-desc" className="rounded-lg text-sm cursor-pointer font-medium">Size (Largest)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="size-asc" className="rounded-lg text-sm cursor-pointer font-medium">Size (Smallest)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* LIST ENGINE */}
        <AnimatePresence mode="wait">
          {filteredAndSortedFiles.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key="file-list-grid"
              className="w-full flex flex-col gap-2.5"
            >
              {filteredAndSortedFiles.map((file) => (
                <motion.div
                  variants={itemVariants}
                  layoutId={`file-card-${file.id}`}
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className="group flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all cursor-pointer hover:-translate-y-[1px]"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      {getFileIcon(file.mime_type)}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {file.file_name}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium mt-0.5">
                        {formatBytes(file.file_size)} • {formatDistanceToNow(new Date(file.created_at))} ago
                      </span>
                    </div>
                  </div>

                  <div className="pl-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      onClick={(e) => handleDelete(e, file.id)}
                      disabled={deletingId === file.id}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                      title="Delete File"
                    >
                      {deletingId === file.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Search Filtering Yielded 0 Matches State */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key="search-empty-state"
              className="w-full py-16 flex flex-col items-center justify-center text-center bg-card border border-border border-dashed rounded-2xl"
            >
              <div className="w-14 h-14 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4">
                <FileQuestion className="w-6 h-6 opacity-60" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">No matching results found</h3>
              <p className="text-muted-foreground text-xs max-w-xs mb-4">
                We couldn't find anything matching "{searchQuery}". Try modifying your query parameter.
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                variant="ghost"
                size="sm"
                className="text-xs text-primary font-bold hover:bg-primary/10 rounded-xl px-4"
              >
                Clear Search Filter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FilePreviewModal
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </>
  );
}