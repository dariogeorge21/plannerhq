"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { debounce } from "lodash";

import { useDocument, useUpdateDocument } from "@/features/document/hooks";
import { Loader2, Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Code, Quote, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { useCollaborationProvider } from "@/features/collaboration/provider";
import OfflineBanner from "./OfflineBanner";
import PresenceAvatars from "./PresenceAvatars";
import VersionHistoryPanel from "./VersionHistoryPanel";

const lowlight = createLowlight();

export default function DocumentEditor({ workspaceId, documentId }: { workspaceId: string; documentId: string }) {
  const { data: doc, isLoading: isDocLoading } = useDocument(documentId);
  const updateDocument = useUpdateDocument(workspaceId);
  
  const { provider, doc: ydoc, isConnected, isOffline, activeUsers } = useCollaborationProvider(documentId, workspaceId);

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedUpdateTitle(e.target.value);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Required for Collaboration
      }),
      Placeholder.configure({ placeholder: "Press '/' for commands, or start writing..." }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      Collaboration.configure({
        document: ydoc,
      }),
      ...(provider ? [CollaborationCaret.configure({
        provider: provider.awareness ? provider : null, // Pass provider if it has awareness
      })] : []),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none text-neutral-800",
      },
    },
  });

  // Since editor and provider might initialize at different times, 
  // we might need to recreate extensions if provider becomes available,
  // or just pass provider as early as possible.
  useEffect(() => {
    if (editor && provider && !editor.extensionManager.extensions.find(e => e.name === "collaborationCaret")) {
      // Not cleanly possible to add dynamically in react, but provider is set after mount.
      // Actually @tiptap/extension-collaboration-caret can update provider.
    }
  }, [editor, provider]);

  if (isDocLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-2">
        <p className="text-neutral-500">Document not found</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col max-w-4xl mx-auto py-8 px-8 md:px-12">
      <OfflineBanner isOffline={isOffline} />
      
      {/* Document Header */}
      <div className="mb-4 mt-4 flex items-start justify-between gap-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled Document"
          className="flex-1 text-4xl md:text-5xl font-bold bg-transparent border-none outline-none text-neutral-900 placeholder-neutral-300 focus:placeholder-transparent resize-none overflow-hidden"
          disabled={isOffline}
        />
        
        {/* Presence and Version History */}
        <div className="flex items-center gap-3">
          <PresenceAvatars users={activeUsers} />
          <VersionHistoryPanel documentId={documentId} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 text-xs text-neutral-400">
        {!isConnected && !isOffline && (
          <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Connecting...</span>
        )}
        {isConnected && <span>Connected to Realtime</span>}
      </div>

      {/* Toolbar (Sticky) */}
      {editor && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 bg-white/90 backdrop-blur-md p-2 rounded-xl border border-neutral-200/60 shadow-sm mb-6">
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("bold") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleBold().run()} disabled={isOffline}>
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("italic") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleItalic().run()} disabled={isOffline}>
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("strike") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleStrike().run()} disabled={isOffline}>
            <Strikethrough className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("heading", { level: 1 }) ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} disabled={isOffline}>
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("heading", { level: 2 }) ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} disabled={isOffline}>
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("heading", { level: 3 }) ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} disabled={isOffline}>
            <Heading3 className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("bulletList") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={isOffline}>
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("orderedList") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={isOffline}>
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("taskList") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleTaskList().run()} disabled={isOffline}>
            <CheckSquare className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("codeBlock") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleCodeBlock().run()} disabled={isOffline}>
            <Code className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("blockquote") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleBlockquote().run()} disabled={isOffline}>
            <Quote className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className={`flex-1 pb-32 ${isOffline ? 'opacity-60 pointer-events-none' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
