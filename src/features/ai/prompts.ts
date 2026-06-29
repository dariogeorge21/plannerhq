import { AIAction } from "@/types/ai";

// ─── System Prompt ─────────────────────────────────────────────────────────────
export const SYSTEM_PROMPT = `You are a professional writing assistant embedded in PlannerHQ, a collaborative workspace application.
Your purpose is to help users write, edit, and improve their documents.
- Be concise and precise. Respond only with the requested content — no preamble, no apologies, no meta-commentary.
- Match the user's tone and style when rewriting.
- Preserve the meaning when summarizing or translating.
- Output clean, readable prose suitable for direct insertion into a document.
- Do not include titles, headers, or labels unless explicitly asked.`;

// ─── Prompt Builders ───────────────────────────────────────────────────────────

export function buildGeneratePrompt(prompt: string): string {
  return `Generate high-quality content based on the following request:

"${prompt}"

Write the content directly. Do not include any introduction or closing remarks.`;
}

export function buildRewritePrompt(content: string, instruction: string): string {
  return `Rewrite the following text according to this instruction: "${instruction}"

Original text:
"""
${content}
"""

Provide only the rewritten text. Preserve the general structure unless asked otherwise.`;
}

export function buildSummarizePrompt(content: string): string {
  return `Summarize the following text into a concise, clear summary that captures the key points:

"""
${content}
"""

Write a clear, informative summary. Keep it proportional to the original length but significantly shorter.`;
}

export function buildTranslatePrompt(content: string, targetLanguage: string): string {
  return `Translate the following text into ${targetLanguage}. Preserve formatting, tone, and meaning as closely as possible.

Text to translate:
"""
${content}
"""

Provide only the translation.`;
}

// ─── Prompt Factory ────────────────────────────────────────────────────────────

export function buildPrompt(
  action: AIAction,
  options: {
    content?: string;
    instruction?: string;
    prompt?: string;
    targetLanguage?: string;
  }
): string {
  switch (action) {
    case "generate":
      if (!options.prompt) throw new Error("Prompt is required for generate action");
      return buildGeneratePrompt(options.prompt);

    case "rewrite":
      if (!options.content) throw new Error("Content is required for rewrite action");
      if (!options.instruction) throw new Error("Instruction is required for rewrite action");
      return buildRewritePrompt(options.content, options.instruction);

    case "summarize":
      if (!options.content) throw new Error("Content is required for summarize action");
      return buildSummarizePrompt(options.content);

    case "translate":
      if (!options.content) throw new Error("Content is required for translate action");
      if (!options.targetLanguage) throw new Error("Target language is required for translate action");
      return buildTranslatePrompt(options.content, options.targetLanguage);

    default:
      throw new Error(`Unknown AI action: ${action}`);
  }
}

// ─── Token Estimation ──────────────────────────────────────────────────────────

/** Rough estimation: ~4 chars per token for English text */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ─── Content Sanitization ─────────────────────────────────────────────────────

export const MAX_CONTENT_LENGTH = 5000;

export function sanitizeContent(content: string): string {
  return content.slice(0, MAX_CONTENT_LENGTH).trim();
}
