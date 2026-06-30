import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { SlashCommandExtension } from "./slash-extension";
import { getFileMentionExtension } from "@/app/(user)/[workspaceId]/files/components/editor/FileMentionExtension";
import { EditorFileUploadPlugin } from "@/app/(user)/[workspaceId]/files/components/editor/EditorFileUploadPlugin";
import Link from "@tiptap/extension-link";
import { Markdown } from "@tiptap/markdown";

const lowlight = createLowlight();

export const getEditorExtensions = (ydoc: any, awareness: any, workspaceId?: string, documentId?: string) => {
  return [
    StarterKit.configure({
      undoRedo: false, // Required for Collaboration
      heading: {
        levels: [1, 2, 3],
      },
      codeBlock: false,
      // @ts-ignore - Some versions of StarterKit might not have link
      link: false,
    }),
    Markdown,
    Placeholder.configure({
      placeholder: "Press '/' for commands, or start writing...",
      emptyEditorClass: 'is-editor-empty',
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
    CodeBlockLowlight.configure({ lowlight }),
    SlashCommandExtension,
    Collaboration.configure({
      document: ydoc,
    }),
    ...(workspaceId ? [getFileMentionExtension(workspaceId)] : []),
    ...(workspaceId && documentId ? [EditorFileUploadPlugin.configure({ workspaceId, documentId })] : []),
    Link.configure({ openOnClick: false }),
  ];
};
