"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { AIAction, AIState, AIUsageData } from "@/types/ai";
import { executeAIAction, fetchAIUsage } from "./services";

// ─── useAI — Core AI execution hook ───────────────────────────────────────────

export function useAI() {
  const [state, setState] = useState<AIState>({
    isLoading: false,
    result: null,
    tokensUsed: 0,
    error: null,
  });

  const execute = useCallback(
    async (
      action: AIAction,
      options: {
        content?: string;
        instruction?: string;
        prompt?: string;
        targetLanguage?: string;
      }
    ) => {
      setState({ isLoading: true, result: null, tokensUsed: 0, error: null });

      try {
        const response = await executeAIAction(action, options);

        if (response.success && response.data) {
          setState({
            isLoading: false,
            result: response.data.result,
            tokensUsed: response.data.tokensUsed,
            error: null,
          });
          return response.data.result;
        } else {
          const message = response.message ?? "Something went wrong. Please try again.";
          setState({ isLoading: false, result: null, tokensUsed: 0, error: message });
          return null;
        }
      } catch (err: unknown) {
        const error = err as Error;
        setState({
          isLoading: false,
          result: null,
          tokensUsed: 0,
          error: error.message || "Unexpected error",
        });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, result: null, tokensUsed: 0, error: null });
  }, []);

  return { ...state, execute, reset };
}

// ─── useAIUsage — Quota fetching hook ─────────────────────────────────────────

export function useAIUsage() {
  const {
    data: usage,
    isLoading,
    refetch,
  } = useQuery<AIUsageData | null>({
    queryKey: ["ai-usage"],
    queryFn: fetchAIUsage,
    staleTime: 60_000,       // Cache for 1 minute
    refetchOnWindowFocus: false,
  });

  return { usage, isLoading, refetch };
}
