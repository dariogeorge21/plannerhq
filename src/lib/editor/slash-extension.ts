import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import { getSuggestionItems } from "./slash-commands";
import { SlashCommandMenu } from "@/components/editor/SlashCommandMenu";

export const SlashCommandExtension = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        allowSpaces: false,
        items: getSuggestionItems,
        render: () => {
          let component: ReactRenderer<{ onKeyDown: (props: { event: KeyboardEvent }) => boolean }>;
          let popup: TippyInstance[];

          return {
            onStart(props: Record<string, unknown>) {
              component = new ReactRenderer(SlashCommandMenu, {
                props,
                editor: props.editor as Parameters<typeof ReactRenderer>[1]["editor"],
              });

              if (!props.clientRect) return;

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

            onUpdate(props: Record<string, unknown>) {
              component.updateProps(props);

              if (!props.clientRect) return;

              popup[0]?.setProps({
                getReferenceClientRect: props.clientRect as () => DOMRect,
              });
            },

            onKeyDown(props: { event: KeyboardEvent }) {
              if (props.event.key === "Escape") {
                popup[0]?.hide();
                return true;
              }
              return component.ref?.onKeyDown(props) ?? false;
            },

            onExit() {
              popup?.[0]?.destroy();
              component?.destroy();
            },
          };
        },
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Parameters<typeof ReactRenderer>[1]["editor"];
          range: { from: number; to: number };
          props: { command: (args: { editor: Parameters<typeof ReactRenderer>[1]["editor"]; range: { from: number; to: number } }) => void };
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
