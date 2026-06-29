"use client";

import React from "react";
import { useAIUsage } from "@/features/ai/hooks";
import { Zap } from "lucide-react";

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export default function AIUsageBadge() {
  const { usage, isLoading } = useAIUsage();

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border animate-pulse">
        <Zap className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">Loading…</span>
      </div>
    );
  }

  if (!usage) return null;

  const { used, max, percentage } = usage;
  const isLow = percentage >= 80;
  const isExhausted = percentage >= 100;

  return (
    <div
      className={`
        flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium
        transition-colors duration-200
        ${isExhausted
          ? "bg-destructive/10 border-destructive/30 text-destructive"
          : isLow
          ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
          : "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400"
        }
      `}
      title={`AI Tokens: ${used.toLocaleString()} used of ${max.toLocaleString()} (${percentage}%)`}
    >
      <Zap className="w-3 h-3 shrink-0" />
      <span>
        {formatTokens(max - used)} tokens left
      </span>

      {/* Mini progress bar */}
      <div className="w-10 h-1 rounded-full bg-current/20 overflow-hidden ml-0.5">
        <div
          className="h-full rounded-full bg-current transition-all duration-500"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      {isExhausted && (
        <span className="ml-0.5 font-semibold">Upgrade</span>
      )}
    </div>
  );
}
