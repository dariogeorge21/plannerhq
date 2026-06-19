import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { SlashCommandExtension } from "./slash-extension";

const lowlight = createLowlight();

export const getEditorExtensions = (ydoc: any, provider: any) => {
  return [
    StarterKit.configure({
      history: false, // Required for Collaboration
      heading: {
        levels: [1, 2, 3],
      },
    }),
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
    ...(provider ? [CollaborationCaret.configure({
      provider: provider.awareness ? provider : null,
    })] : []),
  ];
};
