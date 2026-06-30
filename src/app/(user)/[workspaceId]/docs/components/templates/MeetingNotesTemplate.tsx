"use client";

import React from "react";
import { Clock } from "lucide-react";

interface MeetingNotesTemplateProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function MeetingNotesTemplate({
  onClick,
  disabled = false,
}: MeetingNotesTemplateProps) {
  return (
    <button
      id="template-meeting-notes"
      onClick={onClick}
      disabled={disabled}
      className="
        group relative bg-card hover:bg-accent/50 border border-border
        hover:border-amber-500/40 rounded-2xl p-5 transition-all
        hover:shadow-lg hover:shadow-amber-500/10 flex items-center gap-4 text-left
        disabled:opacity-50 disabled:pointer-events-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50
        active:scale-[0.98]
      "
      aria-label="Create Meeting Notes template"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-200">
        <Clock className="w-6 h-6" />
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-amber-500 transition-colors">
          Meeting Notes
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Header, date &amp; bullet points
        </p>
      </div>

      {/* Arrow indicator */}
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-amber-500 shrink-0">
        →
      </div>
    </button>
  );
}
