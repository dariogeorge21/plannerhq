"use client";

import React from "react";
import { CalendarEventPriority } from "../../types";
import { cn } from "@/lib/utils";

interface PrioritySelectorProps {
  value: CalendarEventPriority;
  onChange: (value: CalendarEventPriority) => void;
  disabled?: boolean;
}

export function PrioritySelector({ value, onChange, disabled }: PrioritySelectorProps) {
  const options: { value: CalendarEventPriority; label: string; colors: string }[] = [
    { 
      value: "low", 
      label: "Low", 
      colors: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200" 
    },
    { 
      value: "medium", 
      label: "Medium", 
      colors: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200" 
    },
    { 
      value: "high", 
      label: "High", 
      colors: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200" 
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
              isSelected 
                ? option.colors + " ring-2 ring-offset-1 ring-current shadow-sm" 
                : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
