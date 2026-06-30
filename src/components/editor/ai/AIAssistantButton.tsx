"use client";

import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  FileText,
  Languages,
  ChevronDown,
  Zap,
  CrownIcon,
  Bot,
  BrainCircuit
} from "lucide-react";
import { AIAction } from "@/types/ai";
import { useAIUsage } from "@/features/ai/hooks";

interface AIAssistantButtonProps {
  editor: Editor | null;
  onAction: (action: AIAction, selectedText: string) => void;
}

const AI_ACTIONS: {
  id: AIAction;
  label: string;
  description: string;
  icon: React.ElementType;
  requiresSelection?: boolean;
  color: string;
}[] = [
    {
      id: "generate",
      label: "Generate",
      description: "Create new content from a prompt",
      icon: Sparkles,
      color: "text-violet-500",
    },
    {
      id: "rewrite",
      label: "Rewrite",
      description: "Improve selected text",
      icon: Wand2,
      requiresSelection: true,
      color: "text-indigo-500",
    },
    {
      id: "summarize",
      label: "Summarize",
      description: "Condense selected text",
      icon: FileText,
      requiresSelection: true,
      color: "text-sky-500",
    },
    {
      id: "translate",
      label: "Translate",
      description: "Translate selected text",
      icon: Languages,
      requiresSelection: true,
      color: "text-emerald-500",
    },
  ];

export default function AIAssistantButton({ editor, onAction }: AIAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { usage } = useAIUsage();

  const hasSelection = editor
    ? !editor.state.selection.empty
    : false;

  const isExhausted = usage ? usage.percentage >= 100 : false;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleAction = (action: AIAction) => {
    setIsOpen(false);
    const selectedText = editor?.state.doc
      .textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        "\n"
      ) ?? "";
    onAction(action, selectedText);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        disabled={isExhausted}
        title={isExhausted ? "AI quota exhausted. Upgrade your plan." : "AI Writing Assistant"}
        aria-label="AI Writing Assistant"
        aria-expanded={isOpen}
        id="ai-assistant-trigger-btn"
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
          transition-all duration-150 outline-none
          focus-visible:ring-2 focus-visible:ring-violet-400/60
          ${isExhausted
            ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
            : "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 border border-violet-500/20"
          }
        `}
      >
        <Bot className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">AI</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="
              absolute top-full left-0 mt-1.5 z-50
              w-56 rounded-2xl border border-border bg-popover
              shadow-2xl shadow-black/15 overflow-hidden
            "
          >
            {/* Header */}
            <div className="px-3 py-2.5 border-b border-border bg-muted/30 flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-violet-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                AI Assistant
              </span>
              {usage && (
                <span className="ml-auto text-[9px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                  {usage.remaining.toLocaleString()} left
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="p-1.5 space-y-0.5">
              {AI_ACTIONS.map((action) => {
                const Icon = action.icon;
                const disabled = action.requiresSelection && !hasSelection;

                return (
                  <button
                    key={action.id}
                    onClick={() => !disabled && handleAction(action.id)}
                    disabled={disabled}
                    title={disabled ? "Select text first" : action.description}
                    aria-label={action.label}
                    id={`ai-action-${action.id}-btn`}
                    className={`
                      w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left
                      transition-all duration-100
                      ${disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-accent cursor-pointer"
                      }
                    `}
                  >
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg bg-muted border border-border ${action.color} shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-foreground leading-none mb-0.5">
                        {action.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {action.requiresSelection && !hasSelection
                          ? "Select text first"
                          : action.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            {usage && usage.percentage >= 80 && (
              <div className="px-3 py-2.5 border-t border-border bg-amber-500/5">
                <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 shrink-0" />
                  {usage.percentage >= 100
                    ? "Quota exhausted — upgrade for more AI"
                    : `${100 - usage.percentage}% remaining — upgrade for unlimited`}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
