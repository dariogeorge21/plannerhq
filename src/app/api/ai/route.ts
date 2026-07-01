import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AIAction, AIRequestPayload, AIResponsePayload } from "@/types/ai";
import { buildPrompt, SYSTEM_PROMPT, sanitizeContent, estimateTokens, MAX_CONTENT_LENGTH } from "@/features/ai/prompts";
import { getUserSubscription } from "@/features/billing/service";

// ─── GROQ API Config ───────────────────────────────────────────────────────────

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 2048;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: () => undefined,
        set: () => { },
        remove: () => { },
      },
    }
  );
}

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set(name, value, options); },
        remove(name: string, options: CookieOptions) { cookieStore.set(name, "", { ...options, maxAge: 0 }); },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

async function checkQuota(
  userId: string,
  estimatedTokens: number
): Promise<{ allowed: boolean; limit: number; current: number; remaining: number }> {
  const { dbPlan } = await getUserSubscription(userId);
  const serviceClient = createServiceClient();

  const { data: usage } = await serviceClient
    .from("subscription_usage")
    .select("ai_tokens_used")
    .eq("user_id", userId)
    .maybeSingle();

  const current = usage?.ai_tokens_used ?? 0;
  const limit = dbPlan.max_ai_tokens;
  const remaining = Math.max(0, limit - current);
  const allowed = (current + estimatedTokens) <= limit;

  return { allowed, limit, current, remaining };
}

async function recordUsage(userId: string, tokensUsed: number): Promise<void> {
  const serviceClient = createServiceClient();

  // Upsert usage — increment ai_tokens_used atomically via RPC if possible,
  // otherwise fall back to read-modify-write
  const { data: usage } = await serviceClient
    .from("subscription_usage")
    .select("id, ai_tokens_used")
    .eq("user_id", userId)
    .maybeSingle();

  if (usage) {
    await serviceClient
      .from("subscription_usage")
      .update({ ai_tokens_used: (usage.ai_tokens_used ?? 0) + tokensUsed })
      .eq("id", usage.id);
  }

  // Also insert a detailed record into ai_usage_tracking if the table exists
  await serviceClient
    .from("ai_usage_tracking")
    .insert({
      user_id: userId,
      tokens_used: tokensUsed,
      created_at: new Date().toISOString(),
    })
    .then(() => { }); // Non-fatal if table doesn't exist yet
}

async function callGroq(
  userMessage: string
): Promise<{ content: string; tokensUsed: number }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    if (response.status === 429) {
      throw new Error("GROQ rate limit exceeded. Please try again in a moment.");
    }
    throw new Error(`GROQ API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";
  const tokensUsed: number = data.usage?.total_tokens ?? estimateTokens(content);

  return { content, tokensUsed };
}

// ─── Validate Payload ──────────────────────────────────────────────────────────

function validatePayload(body: unknown): body is AIRequestPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  const validActions: AIAction[] = ["generate", "rewrite", "summarize", "translate"];
  return typeof b.action === "string" && validActions.includes(b.action as AIAction);
}

// ─── POST Handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<AIResponsePayload>> {
  try {
    // 1. Authenticate
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in to use AI features." },
        { status: 401 }
      );
    }

    // 2. Parse & validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    if (!validatePayload(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload. Required: action (generate|rewrite|summarize|translate)." },
        { status: 400 }
      );
    }

    const payload = body as AIRequestPayload;

    // 3. Sanitize input lengths
    const sanitizedPayload: AIRequestPayload = {
      action: payload.action,
      content: payload.content ? sanitizeContent(payload.content) : undefined,
      instruction: payload.instruction ? payload.instruction.slice(0, 500) : undefined,
      prompt: payload.prompt ? payload.prompt.slice(0, 1000) : undefined,
      targetLanguage: payload.targetLanguage ? payload.targetLanguage.slice(0, 50) : undefined,
    };

    // 4. Build user prompt (validates required fields per action)
    let userMessage: string;
    try {
      userMessage = buildPrompt(sanitizedPayload.action, {
        content: sanitizedPayload.content,
        instruction: sanitizedPayload.instruction,
        prompt: sanitizedPayload.prompt,
        targetLanguage: sanitizedPayload.targetLanguage,
      });
    } catch (e: unknown) {
      const err = e as Error;
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }

    // 5. Quota pre-check (estimate tokens)
    const estimatedTokens = estimateTokens(userMessage) + MAX_TOKENS;
    const quota = await checkQuota(user.id, estimatedTokens);

    if (!quota.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `AI quota exhausted. You have used ${quota.current.toLocaleString()} of ${quota.limit.toLocaleString()} tokens. Upgrade your plan for more.`,
          data: { result: "", tokensUsed: 0, remaining: quota.remaining },
        },
        { status: 429 }
      );
    }

    // 6. Call GROQ
    const { content: result, tokensUsed } = await callGroq(userMessage);

    // 7. Record usage (non-blocking path — don't fail the request if this fails)
    recordUsage(user.id, tokensUsed).catch((err) => {
      console.error("[ai/route] Failed to record AI usage:", err);
    });

    // 8. Return result
    const remaining = Math.max(0, quota.remaining - tokensUsed);

    return NextResponse.json({
      success: true,
      data: { result, tokensUsed, remaining },
      message: "Success",
    });

  } catch (err: unknown) {
    const error = err as Error;
    console.error("[ai/route] Unhandled error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// ─── GET Handler (usage check) ─────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { dbPlan } = await getUserSubscription(user.id);
    const serviceClient = createServiceClient();

    const { data: usage } = await serviceClient
      .from("subscription_usage")
      .select("ai_tokens_used")
      .eq("user_id", user.id)
      .maybeSingle();

    const used = usage?.ai_tokens_used ?? 0;
    const max = dbPlan.max_ai_tokens;
    const remaining = Math.max(0, max - used);

    return NextResponse.json({
      success: true,
      data: {
        used,
        max,
        remaining,
        percentage: max > 0 ? Math.round((used / max) * 100) : 0,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
