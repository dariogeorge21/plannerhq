import { createClient } from "@/lib/supabase/client";
import { AIAction, AIRequestPayload, AIResponsePayload, AIUsageData } from "@/types/ai";

// ─── Get Access Token ──────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

// ─── Base AI Fetch ─────────────────────────────────────────────────────────────

async function callAIRoute(payload: AIRequestPayload): Promise<AIResponsePayload> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, message: "Not authenticated. Please sign in." };
  }

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data: AIResponsePayload = await response.json();
    return data;
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Network error. Please try again." };
  }
}

// ─── AI Service Functions ──────────────────────────────────────────────────────

export async function generateContent(prompt: string): Promise<AIResponsePayload> {
  return callAIRoute({ action: "generate", prompt });
}

export async function rewriteContent(
  content: string,
  instruction: string
): Promise<AIResponsePayload> {
  return callAIRoute({ action: "rewrite", content, instruction });
}

export async function summarizeContent(content: string): Promise<AIResponsePayload> {
  return callAIRoute({ action: "summarize", content });
}

export async function translateContent(
  content: string,
  targetLanguage: string
): Promise<AIResponsePayload> {
  return callAIRoute({ action: "translate", content, targetLanguage });
}

// ─── Usage Fetch ───────────────────────────────────────────────────────────────

export async function fetchAIUsage(): Promise<AIUsageData | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch("/api/ai", {
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.success && data.data) {
      return data.data as AIUsageData;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Action Dispatcher ─────────────────────────────────────────────────────────

export async function executeAIAction(
  action: AIAction,
  options: {
    content?: string;
    instruction?: string;
    prompt?: string;
    targetLanguage?: string;
  }
): Promise<AIResponsePayload> {
  switch (action) {
    case "generate":
      return generateContent(options.prompt ?? "");
    case "rewrite":
      return rewriteContent(options.content ?? "", options.instruction ?? "");
    case "summarize":
      return summarizeContent(options.content ?? "");
    case "translate":
      return translateContent(options.content ?? "", options.targetLanguage ?? "");
    default:
      return { success: false, message: "Unknown action" };
  }
}
