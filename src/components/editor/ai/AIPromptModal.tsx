"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, FileText, X, Loader2, ChevronDown } from "lucide-react";
import { useAI } from "@/features/ai/hooks";
import AIResultDisplay from "./AIResultDisplay";
import { AIAction } from "@/types/ai";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AIPromptModalProps {
  isOpen: boolean;
  action: AIAction;
  initialContent?: string;     // Pre-filled selected text
  onClose: () => void;
  onInsert: (content: string) => void;
  onReplace: (content: string) => void;
}

// ─── Config per action ─────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<
  AIAction,
  {
    icon: React.ElementType;
    color: string;
    title: string;
    promptLabel: string;
    promptPlaceholder: string;
    hasInstruction?: boolean;
    hasContentPreview?: boolean;
  }
> = {
  generate: {
    icon: Sparkles,
    color: "violet",
    title: "Generate Content",
    promptLabel: "What would you like to generate?",
    promptPlaceholder: "E.g. Write an introduction for a project proposal about AI...",
  },
  rewrite: {
    icon: Wand2,
    color: "indigo",
    title: "Rewrite Text",
    promptLabel: "How should it be rewritten?",
    promptPlaceholder: "E.g. Make it more formal, shorter, or use active voice...",
    hasInstruction: true,
    hasContentPreview: true,
  },
  summarize: {
    icon: FileText,
    color: "sky",
    title: "Summarize",
    promptLabel: "Selected text will be summarized",
    promptPlaceholder: "",
    hasContentPreview: true,
  },
  translate: {
    icon: Sparkles,
    color: "emerald",
    title: "Translate",
    promptLabel: "Selected text will be translated",
    promptPlaceholder: "",
    hasContentPreview: true,
  },
};

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string; btn: string }> = {
  violet: {
    bg: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    ring: "focus:ring-violet-500/30",
    btn: "bg-violet-500 hover:bg-violet-600",
  },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-400",
    ring: "focus:ring-indigo-500/30",
    btn: "bg-indigo-500 hover:bg-indigo-600",
  },
  sky: {
    bg: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    ring: "focus:ring-sky-500/30",
    btn: "bg-sky-500 hover:bg-sky-600",
  },
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "focus:ring-emerald-500/30",
    btn: "bg-emerald-500 hover:bg-emerald-600",
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AIPromptModal({
  isOpen,
  action,
  initialContent = "",
  onClose,
  onInsert,
  onReplace,
}: AIPromptModalProps) {
  const [promptText, setPromptText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isLoading, result, error, execute, reset } = useAI();

  const config = ACTION_CONFIG[action];
  const colors = COLOR_MAP[config.color];
  const Icon = config.icon;

  useEffect(() => {
    if (isOpen) {
      setPromptText("");
      reset();
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [isOpen, action]);

  const handleSubmit = async () => {
    if (action === "summarize") {
      await execute("summarize", { content: initialContent });
      return;
    }
    if (action === "rewrite") {
      if (!promptText.trim()) return;
      await execute("rewrite", { content: initialContent, instruction: promptText });
      return;
    }
    if (action === "generate") {
      if (!promptText.trim()) return;
      await execute("generate", { prompt: promptText });
      return;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleInsert = (content: string) => {
    onInsert(content);
    onClose();
  };

  const handleReplace = (content: string) => {
    onReplace(content);
    onClose();
  };

  const canSubmit =
    action === "summarize"
      ? !!initialContent
      : !!promptText.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="
              fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              z-[101] w-full max-w-lg
              rounded-2xl border border-border bg-card
              shadow-2xl shadow-black/20
              overflow-hidden flex flex-col max-h-[90vh]
            "
            role="dialog"
            aria-modal="true"
            aria-label={config.title}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30 shrink-0">
              <div className={`w-8 h-8 rounded-xl ${colors.bg} flex items-center justify-center shadow-sm`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">{config.title}</h2>
                <p className="text-[11px] text-muted-foreground">Powered by OpenAI</p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Content preview (for rewrite/summarize) */}
              {config.hasContentPreview && initialContent && (
                <div className="rounded-xl bg-muted/60 border border-border p-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Selected text
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">
                    {initialContent}
                  </p>
                </div>
              )}

              {/* Prompt input (for generate/rewrite) */}
              {action !== "summarize" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {config.promptLabel}
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={config.promptPlaceholder}
                    rows={3}
                    disabled={isLoading}
                    className={`
                      w-full resize-none rounded-xl border border-border bg-background
                      px-3.5 py-3 text-sm text-foreground placeholder-muted-foreground/60
                      focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent
                      transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed
                    `}
                    id="ai-prompt-input"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    ⌘+Enter to submit · Esc to close
                  </p>
                </div>
              )}

              {/* Result display */}
              <AIResultDisplay
                result={result}
                isLoading={isLoading}
                error={error}
                onInsert={handleInsert}
                onReplace={handleReplace}
                onDiscard={reset}
                label={config.title}
              />

              {/* Submit button */}
              {!result && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    id="ai-modal-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isLoading}
                    className={`
                      flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white
                      ${colors.btn}
                      shadow-sm transition-all duration-150 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                    `}
                    id="ai-modal-submit-btn"
                  >
                    {isLoading ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                    ) : (
                      <><Sparkles className="w-3.5 h-3.5" /> {config.title}</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
