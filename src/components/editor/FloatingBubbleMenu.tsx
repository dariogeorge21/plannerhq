"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Wand2,
  FileText,
  Languages,
  Sparkles,
} from "lucide-react";

interface FloatingBubbleMenuProps {
  editor: Editor | null;
}

function ToolbarBtn({
  isActive = false,
  onClick,
  icon,
  label,
  disabled = false,
  variant = "default",
}: {
  isActive?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  variant?: "default" | "ai";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      className={`
        relative flex items-center justify-center w-8 h-8 rounded-lg text-sm
        transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/60
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variant === "ai"
          ? isActive
            ? "bg-violet-500/20 text-violet-600 dark:text-violet-400"
            : "text-violet-500 hover:text-violet-600 hover:bg-violet-500/10"
          : isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }
      `}
    >
      {icon}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-5 bg-border mx-0.5 shrink-0" />;
}

function dispatchAIModal(action: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-ai-modal", { detail: { action } }));
  }
}

export default function FloatingBubbleMenu({ editor }: FloatingBubbleMenuProps) {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      className="
        flex items-center gap-0.5 p-1.5
        rounded-2xl border border-border
        bg-card/95 backdrop-blur-xl
        shadow-2xl shadow-black/10
      "
    >
      {/* Heading toggles */}
      <ToolbarBtn
        isActive={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        icon={<Heading1 className="w-4 h-4" />}
        label="Heading 1"
      />
      <ToolbarBtn
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        icon={<Heading2 className="w-4 h-4" />}
        label="Heading 2"
      />
      <ToolbarBtn
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        icon={<Heading3 className="w-4 h-4" />}
        label="Heading 3"
      />
      <Separator />

      {/* Inline formatting */}
      <ToolbarBtn
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={<Bold className="w-4 h-4" />}
        label="Bold"
      />
      <ToolbarBtn
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={<Italic className="w-4 h-4" />}
        label="Italic"
      />
      <ToolbarBtn
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={<Strikethrough className="w-4 h-4" />}
        label="Strikethrough"
      />
      <Separator />

      {/* Block types */}
      <ToolbarBtn
        isActive={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        icon={<Code className="w-4 h-4" />}
        label="Code"
      />
      <ToolbarBtn
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon={<Quote className="w-4 h-4" />}
        label="Quote"
      />
      <Separator />

      {/* AI Actions */}
      <ToolbarBtn
        onClick={() => dispatchAIModal("rewrite")}
        icon={<Wand2 className="w-4 h-4" />}
        label="AI Rewrite"
        variant="ai"
      />
      <ToolbarBtn
        onClick={() => dispatchAIModal("summarize")}
        icon={<FileText className="w-4 h-4" />}
        label="AI Summarize"
        variant="ai"
      />
      <ToolbarBtn
        onClick={() => dispatchAIModal("translate")}
        icon={<Languages className="w-4 h-4" />}
        label="AI Translate"
        variant="ai"
      />
    </BubbleMenu>
  );
}

