"use client";

import React from "react";
import { Zap } from "lucide-react";

interface ProductSpecTemplateProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function ProductSpecTemplate({
  onClick,
  disabled = false,
}: ProductSpecTemplateProps) {
  return (
    <button
      id="template-product-spec"
      onClick={onClick}
      disabled={disabled}
      className="
        group relative bg-card hover:bg-accent/50 border border-border
        hover:border-indigo-500/40 rounded-2xl p-5 transition-all
        hover:shadow-lg hover:shadow-indigo-500/10 flex items-center gap-4 text-left
        disabled:opacity-50 disabled:pointer-events-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50
        active:scale-[0.98]
      "
      aria-label="Create Product Specifications template"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-200">
        <Zap className="w-6 h-6" />
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-indigo-500 transition-colors">
          Product Spec
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Structured spec with numbered list
        </p>
      </div>

      {/* Arrow indicator */}
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-indigo-500 shrink-0">
        →
      </div>
    </button>
  );
}
