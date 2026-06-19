"use client";

import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Minus,
  AlignLeft,
  Undo2,
  Redo2,
  Type,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function ToolbarBtn({
  isActive = false,
  onClick,
  icon,
  label,
  disabled = false,
}: {
  isActive?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      className={`
        relative flex items-center justify-center w-7 h-7 rounded-md text-sm
        transition-all duration-100 outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          isActive
            ? "bg-violet-100 text-violet-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
            : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/80"
        }
      `}
    >
      {icon}
    </button>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────
function Separator() {
  return <div className="w-px h-5 bg-neutral-200/80 mx-0.5 shrink-0" />;
}

// ─── Heading Selector ─────────────────────────────────────────────────────────
function HeadingSelect({ editor }: { editor: Editor }) {
  const getLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Paragraph";
  };

  return (
    <div className="relative">
      <select
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
            ? "h2"
            : editor.isActive("heading", { level: 3 })
            ? "h3"
            : "p"
        }
        onChange={(e) => {
          const val = e.target.value;
          if (val === "h1") editor.chain().focus().setHeading({ level: 1 }).run();
          else if (val === "h2") editor.chain().focus().setHeading({ level: 2 }).run();
          else if (val === "h3") editor.chain().focus().setHeading({ level: 3 }).run();
          else editor.chain().focus().setParagraph().run();
        }}
        className="
          appearance-none text-xs font-medium text-neutral-600 
          bg-neutral-100/80 hover:bg-neutral-200/70 
          border border-transparent hover:border-neutral-200
          rounded-md px-2.5 py-1.5 pr-6 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-violet-400/50
          transition-all duration-100
          min-w-[100px]
        "
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
        }}
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
    </div>
  );
}

// ─── Main Toolbar ─────────────────────────────────────────────────────────────
export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const handleLinkToggle = useCallback(() => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt("Enter URL:");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  }, [editor]);

  return (
    <>
      {/* ── Sticky Top Bar ─────────────────────────────────────────────────── */}
      <div
        className="
          sticky top-0 z-40 w-full
          flex items-center gap-1 flex-wrap
          px-3 py-1.5
          bg-white/90 backdrop-blur-md
          border-b border-neutral-200/70
          shadow-sm shadow-neutral-900/[0.04]
          mb-4
        "
      >
        {/* Undo / Redo */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          icon={<Undo2 className="w-3.5 h-3.5" />}
          label="Undo"
          disabled={!editor.can().undo()}
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          icon={<Redo2 className="w-3.5 h-3.5" />}
          label="Redo"
          disabled={!editor.can().redo()}
        />

        <Separator />

        {/* Heading select */}
        <HeadingSelect editor={editor} />

        <Separator />

        {/* Text formatting */}
        <ToolbarBtn
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold className="w-3.5 h-3.5" />}
          label="Bold (⌘B)"
        />
        <ToolbarBtn
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic className="w-3.5 h-3.5" />}
          label="Italic (⌘I)"
        />
        <ToolbarBtn
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<Strikethrough className="w-3.5 h-3.5" />}
          label="Strikethrough"
        />
        <ToolbarBtn
          isActive={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={<Code className="w-3.5 h-3.5" />}
          label="Inline code"
        />

        <Separator />

        {/* Lists */}
        <ToolbarBtn
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<List className="w-3.5 h-3.5" />}
          label="Bullet list"
        />
        <ToolbarBtn
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<ListOrdered className="w-3.5 h-3.5" />}
          label="Numbered list"
        />
        <ToolbarBtn
          isActive={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          icon={<CheckSquare className="w-3.5 h-3.5" />}
          label="To-do list"
        />

        <Separator />

        {/* Blocks */}
        <ToolbarBtn
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={<Quote className="w-3.5 h-3.5" />}
          label="Quote"
        />
        <ToolbarBtn
          isActive={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          icon={<Code2 className="w-3.5 h-3.5" />}
          label="Code block"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<Minus className="w-3.5 h-3.5" />}
          label="Divider"
        />
      </div>

      {/* ── Bubble Menu (on text selection) ─────────────────────────────────── */}
      <BubbleMenu
        editor={editor}
        className="
          flex items-center gap-0.5 p-1
          rounded-xl border border-neutral-200/80
          bg-white/95 backdrop-blur-xl
          shadow-2xl shadow-neutral-900/15
        "
      >
        <ToolbarBtn
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold className="w-3.5 h-3.5" />}
          label="Bold"
        />
        <ToolbarBtn
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic className="w-3.5 h-3.5" />}
          label="Italic"
        />
        <ToolbarBtn
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<Strikethrough className="w-3.5 h-3.5" />}
          label="Strikethrough"
        />
        <ToolbarBtn
          isActive={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={<Code className="w-3.5 h-3.5" />}
          label="Inline code"
        />

        <Separator />

        {/* Quick heading toggles in bubble */}
        <ToolbarBtn
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          icon={<Heading1 className="w-3.5 h-3.5" />}
          label="H1"
        />
        <ToolbarBtn
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={<Heading2 className="w-3.5 h-3.5" />}
          label="H2"
        />
        <ToolbarBtn
          isActive={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          icon={<Heading3 className="w-3.5 h-3.5" />}
          label="H3"
        />

        <Separator />

        <ToolbarBtn
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={<Quote className="w-3.5 h-3.5" />}
          label="Quote"
        />
      </BubbleMenu>
    </>
  );
}
