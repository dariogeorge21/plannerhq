"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { debounce } from "lodash";

import { useDocument, useUpdateDocument } from "@/features/document/hooks";
import { Loader2, FileText } from "lucide-react";

import { useCollaborationProvider } from "@/features/collaboration/provider";
import OfflineBanner from "./OfflineBanner";
import PresenceAvatars from "./PresenceAvatars";
import VersionHistoryPanel from "./VersionHistoryPanel";
import EditorToolbar from "./EditorToolbar";
import { getEditorExtensions } from "@/lib/editor/extensions";

export default function DocumentEditor({
  workspaceId,
  documentId,
}: {
  workspaceId: string;
  documentId: string;
}) {
  const { data: doc, isLoading: isDocLoading } = useDocument(documentId);
  const updateDocument = useUpdateDocument(workspaceId);

  const {
    provider,
    doc: ydoc,
    isConnected,
    isOffline,
    activeUsers,
  } = useCollaborationProvider(documentId, workspaceId);

  const [title, setTitle] = useState("");

  useEffect(() => {
    if (doc) setTitle(doc.title);
  }, [doc]);

  const debouncedUpdateTitle = useCallback(
    debounce((newTitle: string) => {
      updateDocument.mutate({ documentId, title: newTitle });
    }, 1000),
    [documentId, updateDocument]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    debouncedUpdateTitle(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const editor = useEditor({
    extensions: getEditorExtensions(ydoc, provider),
    editorProps: {
      attributes: {
        class: [
          "prose prose-neutral max-w-none focus:outline-none",
          "min-h-[500px]",
          // Headings
          "prose-headings:font-bold prose-headings:tracking-tight",
          "prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8",
          "prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6",
          "prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-5",
          // Paragraphs
          "prose-p:leading-[1.8] prose-p:text-neutral-700",
          // Code
          "prose-pre:bg-neutral-900 prose-pre:text-neutral-50 prose-pre:rounded-xl prose-pre:shadow-lg",
          "prose-code:bg-neutral-100 prose-code:text-violet-700 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.875em] prose-code:font-mono",
          // Links
          "prose-a:text-violet-600 hover:prose-a:text-violet-800 prose-a:underline",
          // Blockquote
          "prose-blockquote:border-l-violet-400 prose-blockquote:text-neutral-600 prose-blockquote:not-italic",
          // Lists
          "prose-ul:marker:text-neutral-400 prose-ol:marker:text-neutral-400",
          // HR
          "prose-hr:border-neutral-200",
        ].join(" "),
      },
    },
  });

  // ── Loading state ────────────────────────────────────────────────────────────
  if (isDocLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
          <p className="text-sm text-neutral-400 font-medium">Loading document…</p>
        </div>
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────────
  if (!doc) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-3">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
          <FileText className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-neutral-500 font-medium">Document not found</p>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <OfflineBanner isOffline={isOffline} />

      {/* ── Top-right presence strip ─────────────────────────────────────────── */}
      <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mr-2">
          {!isConnected && !isOffline && (
            <span className="flex items-center gap-1 text-amber-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs">Connecting…</span>
            </span>
          )}
          {isConnected && (
            <span
              className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium"
              title="Connected to Realtime"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse" />
              Live
            </span>
          )}
        </div>
        <PresenceAvatars users={activeUsers} />
        <VersionHistoryPanel documentId={documentId} />
      </div>

      {/* ── Scrollable document area ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* Document inner container */}
        <div className="max-w-[800px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pb-32">
          {/* Document title */}
          <div className="pt-16 pb-6">
            <textarea
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled"
              rows={1}
              disabled={isOffline}
              className="
                w-full bg-transparent border-none outline-none resize-none overflow-hidden
                text-[2.6rem] sm:text-[3rem] font-black tracking-tight leading-tight
                text-neutral-900 placeholder-neutral-300
                transition-colors duration-200
                disabled:opacity-50
              "
              style={{ minHeight: "64px" }}
            />
          </div>

          {/* Formatting toolbar */}
          <EditorToolbar editor={editor} />

          {/* Editor content */}
          <div
            className={`transition-opacity duration-300 ${
              isOffline ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
