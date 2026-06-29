import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { format } from "date-fns";
import { X, Clock } from "lucide-react";

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
  
  // Try to use content_json. If it's missing or empty, try parsing the binary content as JSON
  // because in older versions or erroneous saves, it might be stored as hex string JSON in `content`.
  let displayContent = version?.content_json;
  
  if (!displayContent || Object.keys(displayContent).length === 0) {
    if (typeof version?.content === 'string' && version.content.startsWith('\\x')) {
      try {
        const hex = version.content.slice(2);
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
          bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        const decoded = new TextDecoder().decode(bytes);
        if (decoded.startsWith('{')) {
           displayContent = JSON.parse(decoded);
        }
      } catch (e) {
        console.error("Failed to parse fallback content", e);
      }
    }
  }

  // Use a simple Tiptap instance for read-only viewing
  const editor = useEditor({
    editable: false,
    content: displayContent || {},
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
  }, [version?.id, displayContent]); // Re-init when version or parsed content changes

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!version) return null;

  const versionDate = format(new Date(version.created_at), "MMM d, yyyy 'at' h:mm a");
  const versionTitle = version.label || `Version ${version.version_number}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={() => !isRestoring && onOpenChange(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[5vh] left-1/2 -translate-x-1/2 z-[9999] w-[95vw] max-w-7xl h-[90vh] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {versionTitle}
                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      v{version.version_number}
                    </span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Saved on {versionDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)} 
                  disabled={isRestoring}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={onRestore} 
                  disabled={isRestoring}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isRestoring ? "Restoring..." : "Restore Version"}
                </Button>
                <button
                  onClick={() => !isRestoring && onOpenChange(false)}
                  disabled={isRestoring}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Document Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-background scrollbar-thin scrollbar-thumb-border">
              <div className="max-w-4xl mx-auto opacity-95">
                <EditorContent editor={editor} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
