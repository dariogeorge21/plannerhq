import Mention from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import { FileMentionList } from "./FileMentionList";
import { createClient } from "@/lib/supabase/client";
import { createFileService } from "@/features/file/services";

export const getFileMentionExtension = (workspaceId: string) => {
  return Mention.extend({
    name: "fileMention",
  }).configure({
    HTMLAttributes: {
      class: "mention file-mention bg-violet-100 text-violet-800 rounded px-1.5 py-0.5 font-medium cursor-pointer hover:bg-violet-200 transition-colors inline-flex items-center gap-1",
    },
    suggestion: {
      char: "@",
      items: async ({ query }) => {
        if (!workspaceId) return [];
        
        try {
          const supabase = createClient();
          const service = createFileService(supabase);
          const files = await service.listFiles(workspaceId);
          
          if (!query) return files.slice(0, 5);
          
          return files
            .filter(item => item.file_name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
        } catch (error) {
          console.error("Failed to fetch file mentions", error);
          return [];
        }
      },
      render: () => {
        let component: ReactRenderer;
        let popup: TippyInstance[];

        return {
          onStart: (props) => {
            component = new ReactRenderer(FileMentionList, {
              props,
              editor: props.editor,
            });

            if (!props.clientRect) {
              return;
            }

            popup = tippy("body", {
              getReferenceClientRect: props.clientRect as () => DOMRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: "manual",
              placement: "bottom-start",
              animation: "shift-away",
              duration: [150, 100],
              offset: [0, 8],
            });
          },

          onUpdate(props) {
            component.updateProps(props);

            if (!props.clientRect) {
              return;
            }

            popup[0].setProps({
              getReferenceClientRect: props.clientRect as () => DOMRect,
            });
          },

          onKeyDown(props) {
            if (props.event.key === "Escape") {
              popup[0].hide();
              return true;
            }
            return (component.ref as any)?.onKeyDown(props);
          },

          onExit() {
            popup[0].destroy();
            component.destroy();
          },
        };
      },
    },
  });
};
