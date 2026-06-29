"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Copy, Check, Replace, X, Sparkles, AlertCircle } from "lucide-react";

interface AIResultDisplayProps {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  onInsert: (content: string) => void;
  onReplace: (content: string) => void;
  onDiscard: () => void;
  label?: string;
}

export default function AIResultDisplay({
  result,
  isLoading,
  error,
  onInsert,
  onReplace,
  onDiscard,
  label = "AI Response",
}: AIResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (!isLoading && !result && !error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="
          rounded-2xl border border-border bg-card
          shadow-2xl shadow-black/10
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              {label}
            </span>
          </div>
          <button
            onClick={onDiscard}
            className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Discard result"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 min-h-[80px]">
          {isLoading && (
            <div className="flex items-center gap-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-violet-500 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 rounded-full bg-muted animate-pulse w-3/4" />
                <div className="h-2.5 rounded-full bg-muted animate-pulse w-1/2" />
                <div className="h-2.5 rounded-full bg-muted animate-pulse w-2/3" />
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/8 border border-destructive/20">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive leading-relaxed">{error}</p>
            </div>
          )}

          {result && !isLoading && (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{result}</p>
          )}
        </div>

        {/* Action buttons */}
        {result && !isLoading && (
          <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-muted/20">
            <button
              onClick={() => onInsert(result)}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-violet-500 text-white hover:bg-violet-600
                shadow-sm transition-all duration-150 active:scale-95
              "
              id="ai-result-insert-btn"
            >
              Insert below
            </button>
            <button
              onClick={() => onReplace(result)}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                border border-border bg-background hover:bg-accent text-foreground
                shadow-sm transition-all duration-150 active:scale-95
              "
              id="ai-result-replace-btn"
            >
              <Replace className="w-3 h-3" />
              Replace selection
            </button>
            <button
              onClick={handleCopy}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                border border-border bg-background hover:bg-accent text-foreground
                shadow-sm transition-all duration-150 active:scale-95 ml-auto
              "
              id="ai-result-copy-btn"
            >
              {copied ? (
                <><Check className="w-3 h-3 text-green-500" /> Copied</>
              ) : (
                <><Copy className="w-3 h-3" /> Copy</>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
