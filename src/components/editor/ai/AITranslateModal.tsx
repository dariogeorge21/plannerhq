"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, X, Loader2, ChevronDown } from "lucide-react";
import { useAI } from "@/features/ai/hooks";
import AIResultDisplay from "./AIResultDisplay";

// ─── Supported Languages ───────────────────────────────────────────────────────

const LANGUAGES = [
  { value: "Spanish", label: "🇪🇸 Spanish" },
  { value: "French", label: "🇫🇷 French" },
  { value: "German", label: "🇩🇪 German" },
  { value: "Portuguese", label: "🇧🇷 Portuguese" },
  { value: "Italian", label: "🇮🇹 Italian" },
  { value: "Dutch", label: "🇳🇱 Dutch" },
  { value: "Japanese", label: "🇯🇵 Japanese" },
  { value: "Korean", label: "🇰🇷 Korean" },
  { value: "Chinese (Simplified)", label: "🇨🇳 Chinese (Simplified)" },
  { value: "Chinese (Traditional)", label: "🇹🇼 Chinese (Traditional)" },
  { value: "Arabic", label: "🇸🇦 Arabic" },
  { value: "Hindi", label: "🇮🇳 Hindi" },
  { value: "Russian", label: "🇷🇺 Russian" },
  { value: "Polish", label: "🇵🇱 Polish" },
  { value: "Turkish", label: "🇹🇷 Turkish" },
  { value: "Swedish", label: "🇸🇪 Swedish" },
  { value: "Norwegian", label: "🇳🇴 Norwegian" },
  { value: "Danish", label: "🇩🇰 Danish" },
  { value: "Finnish", label: "🇫🇮 Finnish" },
  { value: "Indonesian", label: "🇮🇩 Indonesian" },
];

interface AITranslateModalProps {
  isOpen: boolean;
  selectedText: string;
  onClose: () => void;
  onInsert: (content: string) => void;
  onReplace: (content: string) => void;
}

export default function AITranslateModal({
  isOpen,
  selectedText,
  onClose,
  onInsert,
  onReplace,
}: AITranslateModalProps) {
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const { isLoading, result, error, execute, reset } = useAI();

  useEffect(() => {
    if (isOpen) {
      reset();
      setTargetLanguage("Spanish");
    }
  }, [isOpen]);

  const handleTranslate = async () => {
    if (!selectedText || !targetLanguage) return;
    await execute("translate", { content: selectedText, targetLanguage });
  };

  const handleInsert = (content: string) => {
    onInsert(content);
    onClose();
  };

  const handleReplace = (content: string) => {
    onReplace(content);
    onClose();
  };

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
              overflow-hidden
            "
            role="dialog"
            aria-modal="true"
            aria-label="Translate text"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
                <Languages className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Translate Text</h2>
                <p className="text-[11px] text-muted-foreground">Powered by OpenAI</p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Selected text preview */}
              {selectedText && (
                <div className="rounded-xl bg-muted/60 border border-border p-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Text to translate
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">
                    {selectedText}
                  </p>
                </div>
              )}

              {/* Language selector */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Target language
                </label>
                <div className="relative">
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    disabled={isLoading}
                    className="
                      w-full appearance-none rounded-xl border border-border bg-background
                      px-3.5 py-2.5 pr-9 text-sm text-foreground
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-transparent
                      transition-all duration-150 disabled:opacity-60 cursor-pointer
                    "
                    id="ai-translate-language-select"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Result display */}
              <AIResultDisplay
                result={result}
                isLoading={isLoading}
                error={error}
                onInsert={handleInsert}
                onReplace={handleReplace}
                onDiscard={reset}
                label={`Translated to ${targetLanguage}`}
              />

              {/* Buttons */}
              {!result && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTranslate}
                    disabled={!selectedText || isLoading}
                    className="
                      flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white
                      bg-emerald-500 hover:bg-emerald-600
                      shadow-sm transition-all duration-150 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                    "
                    id="ai-translate-submit-btn"
                  >
                    {isLoading ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Translating…</>
                    ) : (
                      <><Languages className="w-3.5 h-3.5" /> Translate</>
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
