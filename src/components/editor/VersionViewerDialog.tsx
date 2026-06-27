import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { format } from "date-fns";

const lowlight = createLowlight();

interface VersionViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: any;
  onRestore: () => void;
  isRestoring: boolean;
}

export default function VersionViewerDialog({
  open,
  onOpenChange,
  version,
  onRestore,
  isRestoring,
}: VersionViewerDialogProps) {
  
  // Use a simple Tiptap instance for read-only viewing
  const editor = useEditor({
    editable: false,
    content: version?.content || {},
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        // @ts-ignore
        link: false,
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: false }),
    ],
    editorProps: {
      attributes: {
        class: [
          "prose prose-neutral max-w-none focus:outline-none dark:prose-invert",
          "prose-headings:font-bold prose-headings:tracking-tight",
          "prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8",
          "prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6",
          "prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-5",
          "prose-p:leading-[1.8] text-foreground",
          "prose-pre:bg-neutral-900 prose-pre:text-neutral-50 prose-pre:rounded-xl prose-pre:shadow-lg dark:prose-pre:bg-neutral-950",
          "prose-code:bg-muted prose-code:text-primary prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.875em] prose-code:font-mono",
          "prose-a:text-primary prose-a:underline",
          "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:not-italic",
          "prose-ul:marker:text-muted-foreground prose-ol:marker:text-muted-foreground",
          "prose-hr:border-border",
        ].join(" "),
      },
    },
  }, [version?.id]); // Re-init when version changes

  if (!version) return null;

  const versionDate = format(new Date(version.created_at), "MMM d, yyyy 'at' h:mm a");
  const versionTitle = version.label || `Version ${version.version_number}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] w-full max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {versionTitle}
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  v{version.version_number}
                </span>
              </DialogTitle>
              <DialogDescription className="mt-1">
                Saved on {versionDate}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isRestoring}>
                Cancel
              </Button>
              <Button size="sm" onClick={onRestore} disabled={isRestoring}>
                {isRestoring ? "Restoring..." : "Restore Version"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 md:px-12 bg-background scrollbar-thin scrollbar-thumb-border">
          {/* We assume the title of the document isn't part of the Yjs/Tiptap content, 
              so we can optionally render a placeholder for the title if needed, 
              but the version content is the main focus here. */}
          <div className="opacity-90">
             <EditorContent editor={editor} />
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
