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

import { useDocument, useDocumentContent, useUpdateDocument, useSaveDocumentContent } from "@/features/document/hooks";
import { Loader2, Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Code, Quote, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const lowlight = createLowlight();

export default function DocumentEditor({ workspaceId, documentId }: { workspaceId: string; documentId: string }) {
  const { data: doc, isLoading: isDocLoading } = useDocument(documentId);
  const { data: docContent, isLoading: isContentLoading } = useDocumentContent(documentId);
  const updateDocument = useUpdateDocument(workspaceId);
  const saveContent = useSaveDocumentContent(workspaceId);

  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const debouncedSaveContent = useCallback(
    debounce((content: any) => {
      setIsSaving(true);
      saveContent.mutate(
        { documentId, content },
        { onSettled: () => setIsSaving(false) }
      );
    }, 2000),
    [documentId, saveContent]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Press '/' for commands, or start writing..." }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: docContent?.content || "",
    onUpdate: ({ editor }) => {
      debouncedSaveContent(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none text-neutral-800",
      },
    },
  });

  useEffect(() => {
    if (editor && docContent && !editor.isFocused) {
      // Only set content if we just loaded it and editor is empty to prevent overwriting during collab
      if (editor.isEmpty && Object.keys(docContent.content).length > 0) {
        editor.commands.setContent(docContent.content);
      }
    }
  }, [editor, docContent]);

  if (isDocLoading || isContentLoading) {
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
      {/* Document Header */}
      <div className="mb-8 group">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled Document"
          className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none text-neutral-900 placeholder-neutral-300 focus:placeholder-transparent resize-none overflow-hidden"
        />
        <div className="flex items-center gap-2 mt-4 text-xs text-neutral-400">
          {isSaving ? (
            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</span>
          ) : (
            <span>Saved</span>
          )}
        </div>
      </div>

      {/* Toolbar (Sticky) */}
      {editor && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 bg-white/90 backdrop-blur-md p-2 rounded-xl border border-neutral-200/60 shadow-sm mb-6">
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("bold") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("italic") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("strike") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("heading", { level: 1 }) ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("heading", { level: 2 }) ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("heading", { level: 3 }) ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("bulletList") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("orderedList") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("taskList") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleTaskList().run()}>
            <CheckSquare className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("codeBlock") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${editor.isActive("blockquote") ? "bg-indigo-50 text-indigo-700" : ""}`} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 pb-32">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
