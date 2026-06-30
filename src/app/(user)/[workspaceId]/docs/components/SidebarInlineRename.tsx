"use client";

import React, { useEffect, useRef, useState } from "react";

interface SidebarInlineRenameProps {
  /** The current name displayed in the sidebar */
  initialValue: string;
  /** Called with the trimmed new name when the user confirms */
  onCommit: (newName: string) => void;
  /** Called when the user cancels (Escape) */
  onCancel: () => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * A slim, inline input that replaces the label text during rename.
 *
 * Design:
 *  - Transparent background matching the sidebar palette
 *  - Subtle ring on focus using `primary` token
 *  - Auto-selects all text on mount so the user can immediately type
 *  - Commits on Enter or blur; cancels on Escape
 *  - Ignores empty commits (resets to initial value)
 */
export default function SidebarInlineRename({
  initialValue,
  onCommit,
  onCancel,
  placeholder = "Enter name…",
  ariaLabel = "Rename",
}: SidebarInlineRenameProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus and select all on mount
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    setTimeout(() => {
      el.focus();
      el.select();
    }, 10);
  }, []);

  const commit = () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === initialValue) {
      onCancel();
      return;
    }
    onCommit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={commit}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={[
        // Layout — matches the space the label text occupied
        "flex-1 min-w-0 w-full",
        // Typography — keep consistent with sidebar label
        "text-sm font-semibold text-foreground",
        // Add a clear visual border so the user understands they can edit it
        "bg-background rounded-md px-1.5 py-0.5",
        "border border-primary shadow-[0_0_0_2px_rgba(var(--primary),0.2)]",
        "outline-none",
        // Transition for subtle feel
        "transition-all duration-150",
        // Reset browser input styling
        "appearance-none",
      ].join(" ")}
      // Prevent click propagation so parent toggle-expand handler isn't triggered
      onClick={(e) => e.stopPropagation()}
    />
  );
}
