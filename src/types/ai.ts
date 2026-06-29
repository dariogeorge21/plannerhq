// ─── AI Action Types ───────────────────────────────────────────────────────────

export type AIAction = "generate" | "rewrite" | "summarize" | "translate";

export interface AIRequestPayload {
  action: AIAction;
  content?: string;         // Selected text or existing content
  instruction?: string;     // User instruction for rewrite
  prompt?: string;          // User prompt for generate
  targetLanguage?: string;  // Target language for translate
}

export interface AIResponsePayload {
  success: boolean;
  data?: {
    result: string;
    tokensUsed: number;
    remaining: number;
  };
  message?: string;
}

// ─── AI Usage Types ────────────────────────────────────────────────────────────

export interface AIUsageData {
  used: number;
  max: number;
  remaining: number;
  percentage: number;
}

// ─── AI Hook State ─────────────────────────────────────────────────────────────

export interface AIState {
  isLoading: boolean;
  result: string | null;
  tokensUsed: number;
  error: string | null;
}

// ─── AI Modal Context (event bus for slash commands) ──────────────────────────

export interface AIModalEvent {
  action: AIAction;
  selectedText?: string;
  onInsert?: (content: string) => void;
  onReplace?: (content: string) => void;
}
