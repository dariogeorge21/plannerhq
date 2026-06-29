"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { debounce } from "lodash";

import { useDocument, useUpdateDocument, useSaveDocumentContent } from "@/features/document/hooks";
import { Loader2, FileText } from "lucide-react";

import { useCollaborationProvider } from "@/features/collaboration/provider";
import OfflineBanner from "./OfflineBanner";
import PresenceAvatars from "./PresenceAvatars";
import VersionHistoryPanel from "./VersionHistoryPanel";
import SaveVersionCTA from "./SaveVersionCTA";
import FloatingBubbleMenu from "./FloatingBubbleMenu";
import { getEditorExtensions } from "@/lib/editor/extensions";
import { useUploadFile } from "@/features/file/hooks";
import { getSignedUrlAction } from "@/features/file/actions";
import { toast } from "sonner";

// AI imports
import AIAssistantButton from "./ai/AIAssistantButton";
import AIPromptModal from "./ai/AIPromptModal";
import AITranslateModal from "./ai/AITranslateModal";
import AIUsageBadge from "./ai/AIUsageBadge";
import { AIAction } from "@/types/ai";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AIModalState {
  open: boolean;
  action: AIAction;
  selectedText: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

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
    awareness,
  } = useCollaborationProvider(documentId, workspaceId);

  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useUploadFile(workspaceId);
  const saveContent = useSaveDocumentContent(workspaceId);

  // ── AI State ───────────────────────────────────────────────────────────────
  const [aiModal, setAIModal] = useState<AIModalState>({
    open: false,
    action: "generate",
    selectedText: "",
  });
  const [translateModalOpen, setTranslateModalOpen] = useState(false);
  const [translateSelectedText, setTranslateSelectedText] = useState("");

  useEffect(() => {
    if (doc) setTitle(doc.title);
  }, [doc]);

  const debouncedUpdateTitle = useCallback(
    debounce((newTitle: string) => {
      updateDocument.mutate({ documentId, title: newTitle });
    }, 1000),
    [documentId, updateDocument]
  );

  const debouncedSaveContent = useCallback(
    debounce((content: any) => {
      saveContent.mutate({ documentId, content });
    }, 1500),
    [documentId, saveContent]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    debouncedUpdateTitle(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const editor = useEditor({
    extensions: getEditorExtensions(ydoc, awareness, workspaceId, documentId),
    onUpdate: ({ editor }) => {
      debouncedSaveContent(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor focus:outline-none min-h-[500px]",
      },
    },
  });

  // ── File Upload Event Listener ─────────────────────────────────────────────
  useEffect(() => {
    const handleOpenUpload = () => {
      fileInputRef.current?.click();
    };

    window.addEventListener('open-editor-file-upload', handleOpenUpload);
    return () => window.removeEventListener('open-editor-file-upload', handleOpenUpload);
  }, []);

  // ── AI Event Bus (from slash commands + bubble menu) ─────────────────────
  useEffect(() => {
    const handleAIModal = (e: CustomEvent<{ action: string }>) => {
      const action = e.detail?.action as AIAction;
      if (!action || !editor) return;

      // Get currently selected text from editor
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        "\n"
      );

      if (action === "translate") {
        setTranslateSelectedText(selectedText);
        setTranslateModalOpen(true);
      } else {
        setAIModal({ open: true, action, selectedText });
      }
    };

    window.addEventListener("open-ai-modal", handleAIModal as EventListener);
    return () => window.removeEventListener("open-ai-modal", handleAIModal as EventListener);
  }, [editor]);

  // ── AI Toolbar Button Handler ─────────────────────────────────────────────
  const handleAIAction = useCallback(
    (action: AIAction, selectedText: string) => {
      if (action === "translate") {
        setTranslateSelectedText(selectedText);
        setTranslateModalOpen(true);
      } else {
        setAIModal({ open: true, action, selectedText });
      }
    },
    []
  );

  // ── AI Content Insertion ─────────────────────────────────────────────────

  const handleAIInsert = useCallback(
    (content: string) => {
      if (!editor) return;
      editor.chain().focus().insertContent(content).run();
    },
    [editor]
  );

  const handleAIReplace = useCallback(
    (content: string) => {
      if (!editor) return;
      const { from, to } = editor.state.selection;
      if (from === to) {
        // No selection — just insert at cursor
        editor.chain().focus().insertContent(content).run();
      } else {
        // Replace selected text
        editor.chain().focus().deleteRange({ from, to }).insertContent(content).run();
      }
    },
    [editor]
  );

  // ── File Select Handler ───────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      toast.loading(`Uploading ${file.name}...`, { id: `upload-${file.name}` });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("workspaceId", workspaceId);
      formData.append("entityType", "document");
      formData.append("entityId", documentId);

      const result = await uploadFile.mutateAsync(formData);
      if (!result?.storage_path) {
        throw new Error("Upload did not return file path");
      }
      toast.success(`Uploaded ${file.name}`, { id: `upload-${file.name}` });

      const urlResult = await getSignedUrlAction(result.storage_path);
      const fileUrl = urlResult.success ? urlResult.data : "#";

      editor.chain().focus().insertContent([
        {
          type: 'text',
          marks: [{ type: 'link', attrs: { href: fileUrl, target: '_blank' } }],
          text: file.name,
        },
        { type: 'text', text: ' ' }
      ]).run();
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`, { id: `upload-${file.name}` });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isDocLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Loading document…</p>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!doc) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-3">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
          <FileText className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">Document not found</p>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <OfflineBanner isOffline={isOffline} />

      {/* ── Top-right presence strip ──────────────────────────────────────── */}
      <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
        {/* AI Usage Badge */}
        <AIUsageBadge />

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
        <div className="flex items-center gap-2">
          <VersionHistoryPanel documentId={documentId} />
          <SaveVersionCTA documentId={documentId} />
        </div>
      </div>

      {/* ── Scrollable document area ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-border">
        {doc?.cover && (
          <div className="w-full h-48 sm:h-64 object-cover">
            <img src={doc.cover} alt="Cover" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Document inner container */}
        <div className="max-w-[800px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pb-32">

          {/* Document title */}
          <div className={`pt-16 pb-6 ${doc?.cover ? '-mt-16 relative z-10' : ''}`}>

            {doc?.icon && (
              <div className="text-6xl sm:text-7xl mb-4 leading-none">
                {doc.icon}
              </div>
            )}

            <textarea
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled Document"
              rows={1}
              disabled={isOffline}
              className="
                w-full bg-transparent border-none outline-none resize-none overflow-hidden
                text-[2.6rem] sm:text-[3rem] font-black tracking-tight leading-tight
                text-foreground placeholder-muted-foreground/50
                transition-colors duration-200
                disabled:opacity-50
              "
              style={{ minHeight: "64px" }}
            />
          </div>

          {/* AI Assistant Toolbar strip */}
          <div className="flex items-center gap-2 mb-4">
            <AIAssistantButton editor={editor} onAction={handleAIAction} />
          </div>

          {/* Floating bubble menu (shown on text selection) */}
          <FloatingBubbleMenu editor={editor} />

          {/* Editor content */}
          <div
            className={`transition-opacity duration-300 ${isOffline ? "opacity-40 pointer-events-none" : "opacity-100"
              }`}
          >
            <EditorContent editor={editor} />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* ── AI Modals ─────────────────────────────────────────────────────── */}
      <AIPromptModal
        isOpen={aiModal.open && aiModal.action !== "translate"}
        action={aiModal.action}
        initialContent={aiModal.selectedText}
        onClose={() => setAIModal((prev) => ({ ...prev, open: false }))}
        onInsert={handleAIInsert}
        onReplace={handleAIReplace}
      />

      <AITranslateModal
        isOpen={translateModalOpen}
        selectedText={translateSelectedText}
        onClose={() => setTranslateModalOpen(false)}
        onInsert={handleAIInsert}
        onReplace={handleAIReplace}
      />
    </div>
  );
}
