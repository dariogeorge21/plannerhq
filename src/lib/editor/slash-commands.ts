import { Editor, Range } from "@tiptap/core";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Minus,
  Type,
  AlignLeft,
  Table2,
  Image,
  Paperclip,
  Sparkles,
  Wand2,
  FileText,
  Languages,
} from "lucide-react";

export interface CommandItem {
  title: string;
  description: string;
  icon: React.ElementType;
  keywords?: string[];
  group: "text" | "lists" | "advanced" | "ai";
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export const COMMAND_GROUPS: { key: CommandItem["group"]; label: string }[] = [
  { key: "ai", label: "AI" },
  { key: "text", label: "Text" },
  { key: "lists", label: "Lists" },
  { key: "advanced", label: "Advanced" },
];

// ─── AI Command Event Dispatcher ──────────────────────────────────────────────
function dispatchAICommand(action: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-ai-modal", { detail: { action } }));
  }
}

const ALL_ITEMS: CommandItem[] = [
  // ── AI Commands ─────────────────────────────────────────────────────────────
  {
    title: "AI Generate",
    description: "Generate new content with AI",
    icon: Sparkles,
    keywords: ["ai", "generate", "write", "create", "gpt", "llm"],
    group: "ai",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      dispatchAICommand("generate");
    },
  },
  {
    title: "AI Rewrite",
    description: "Rewrite selected text with AI",
    icon: Wand2,
    keywords: ["ai", "rewrite", "improve", "edit", "rephrase"],
    group: "ai",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      dispatchAICommand("rewrite");
    },
  },
  {
    title: "AI Summarize",
    description: "Summarize selected text with AI",
    icon: FileText,
    keywords: ["ai", "summarize", "condense", "shorten", "brief"],
    group: "ai",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      dispatchAICommand("summarize");
    },
  },
  {
    title: "AI Translate",
    description: "Translate selected text with AI",
    icon: Languages,
    keywords: ["ai", "translate", "language", "convert"],
    group: "ai",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      dispatchAICommand("translate");
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    icon: Heading1,
    keywords: ["h1", "heading", "title", "big"],
    group: "text",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    icon: Heading2,
    keywords: ["h2", "heading", "subtitle", "medium"],
    group: "text",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    icon: Heading3,
    keywords: ["h3", "heading", "small"],
    group: "text",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "Paragraph",
    description: "Plain text block.",
    icon: AlignLeft,
    keywords: ["p", "text", "paragraph", "plain"],
    group: "text",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("paragraph").run();
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with checkboxes.",
    icon: CheckSquare,
    keywords: ["todo", "check", "task", "checkbox"],
    group: "lists",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bulleted list.",
    icon: List,
    keywords: ["bullet", "list", "unordered", "ul"],
    group: "lists",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list.",
    icon: ListOrdered,
    keywords: ["numbered", "ordered", "ol", "list"],
    group: "lists",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Code Block",
    description: "Capture a code snippet.",
    icon: Code,
    keywords: ["code", "snippet", "pre", "block"],
    group: "advanced",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "Quote",
    description: "Highlight a quote or callout.",
    icon: Quote,
    keywords: ["quote", "blockquote", "callout"],
    group: "advanced",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Divider",
    description: "Visually divide sections.",
    icon: Minus,
    keywords: ["divider", "rule", "separator", "hr"],
    group: "advanced",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: "Upload file",
    description: "Upload and link a file.",
    icon: Paperclip,
    keywords: ["upload", "file", "attachment", "pdf"],
    group: "advanced",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-editor-file-upload'));
      }
    },
  },
];

export const getSuggestionItems = ({ query }: { query: string }): CommandItem[] => {
  if (!query) return ALL_ITEMS;

  const q = query.toLowerCase().trim();
  return ALL_ITEMS.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(q);
    const matchesKeywords = item.keywords?.some((kw) => kw.startsWith(q));
    return matchesTitle || matchesKeywords;
  });
};

export { ALL_ITEMS };
