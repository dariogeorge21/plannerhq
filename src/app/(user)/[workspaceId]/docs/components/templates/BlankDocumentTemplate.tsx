"use client";

import React from "react";
import { FileText } from "lucide-react";

interface BlankDocumentTemplateProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function BlankDocumentTemplate({
  onClick,
  disabled = false,
}: BlankDocumentTemplateProps) {
  return (
    <button
      id="template-blank-document"
      onClick={onClick}
      disabled={disabled}
      className="
        group relative bg-card hover:bg-accent/50 border border-border
        hover:border-primary/40 rounded-2xl p-5 transition-all
        hover:shadow-lg hover:shadow-primary/10 flex items-center gap-4 text-left
        disabled:opacity-50 disabled:pointer-events-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        active:scale-[0.98]
      "
      aria-label="Create Blank Document"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
        <FileText className="w-6 h-6" />
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          Blank Document
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Start with a clean, empty page
        </p>
      </div>

      {/* Arrow indicator */}
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-primary shrink-0">
        →
      </div>
    </button>
  );
}
