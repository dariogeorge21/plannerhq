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
} from "lucide-react";

export interface CommandItem {
  title: string;
  description: string;
  icon: React.ElementType;
  keywords?: string[];
  group: "text" | "lists" | "advanced";
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export const COMMAND_GROUPS: { key: CommandItem["group"]; label: string }[] = [
  { key: "text", label: "Text" },
  { key: "lists", label: "Lists" },
  { key: "advanced", label: "Advanced" },
];

const ALL_ITEMS: CommandItem[] = [
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
