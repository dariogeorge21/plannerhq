import { createClient } from "@/lib/supabase/server";
import { getUserSubscription } from "./service";
import { UsageRecord } from "@/types/billing";

export async function getUserUsage(userId: string) {
    const supabase = await createClient();
    const { data: usage, error } = await supabase
        .from("subscription_usage")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    if (error || !usage) return null;
    return usage as UsageRecord;
}

export async function checkWorkspaceLimit(userId: string): Promise<{ allowed: boolean, limit: number, current: number }> {
    const { dbPlan } = await getUserSubscription(userId);
    const usage = await getUserUsage(userId);

    const maxWorkspaces = dbPlan?.max_workspaces ?? 3;

    if (!usage) return { allowed: false, limit: maxWorkspaces, current: 0 };

    return {
        allowed: usage.workspaces_count < maxWorkspaces,
        limit: maxWorkspaces,
        current: usage.workspaces_count
    };
}

export async function checkCollaboratorLimit(workspaceId: string, inviterId: string): Promise<{ allowed: boolean, limit: number, current: number }> {
    // Limits are based on the workspace owner's plan
    const supabase = await createClient();
    const { data: workspace } = await supabase
        .from("workspaces")
        .select("created_by")
        .eq("id", workspaceId)
        .single();

    if (!workspace) return { allowed: false, limit: 0, current: 0 };

    const ownerId = workspace.created_by;
    const { dbPlan } = await getUserSubscription(ownerId);
    const maxCollaborators = dbPlan?.max_collaborators ?? 2;

    // Count distinct active collaborators in the workspace
    const { count } = await supabase
        .from("workspace_members")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId);

    const current = count || 0;

    return {
        allowed: current < maxCollaborators,
        limit: maxCollaborators,
        current
    };
}

export async function checkStorageLimit(userId: string, fileSize: number): Promise<{ allowed: boolean, limit: number, current: number }> {
    const { dbPlan } = await getUserSubscription(userId);
    const usage = await getUserUsage(userId);

    const maxStorageBytes = dbPlan?.max_storage_bytes ?? 104857600;

    if (!usage) return { allowed: false, limit: maxStorageBytes, current: 0 };

    return {
        allowed: (usage.storage_used_bytes + fileSize) <= maxStorageBytes,
        limit: maxStorageBytes,
        current: usage.storage_used_bytes
    };
}

export async function checkAITokenLimit(userId: string, requestedTokens: number): Promise<{ allowed: boolean, limit: number, current: number }> {
    const { dbPlan } = await getUserSubscription(userId);
    const usage = await getUserUsage(userId);

    const maxAiTokens = dbPlan?.max_ai_tokens ?? 200000;

    if (!usage) return { allowed: false, limit: maxAiTokens, current: 0 };

    return {
        allowed: (usage.ai_tokens_used + requestedTokens) <= maxAiTokens,
        limit: maxAiTokens,
        current: usage.ai_tokens_used
    };
}

export async function incrementWorkspaceUsage(userId: string, increment: number = 1) {
    const supabase = await createClient();

    // We fetch current then update. In a real highly concurrent system, an RPC function should be used.
    // For now, doing simple read+write
    const usage = await getUserUsage(userId);
    if (!usage) return;

    await supabase
        .from("subscription_usage")
        .update({ workspaces_count: usage.workspaces_count + increment })
        .eq("id", usage.id);
}
