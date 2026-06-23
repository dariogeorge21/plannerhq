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
    const { plan } = await getUserSubscription(userId);
    const usage = await getUserUsage(userId);
    
    if (!usage) return { allowed: false, limit: plan.maxWorkspaces, current: 0 };
    
    return { 
        allowed: usage.workspaces_count < plan.maxWorkspaces,
        limit: plan.maxWorkspaces,
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
    const { plan } = await getUserSubscription(ownerId);
    
    // Count distinct active collaborators in the workspace
    const { count } = await supabase
        .from("workspace_members")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId);
        
    const current = count || 0;
    
    return {
        allowed: current < plan.maxCollaborators,
        limit: plan.maxCollaborators,
        current
    };
}

export async function checkStorageLimit(userId: string, fileSize: number): Promise<{ allowed: boolean, limit: number, current: number }> {
    const { plan } = await getUserSubscription(userId);
    const usage = await getUserUsage(userId);
    
    if (!usage) return { allowed: false, limit: plan.maxStorageBytes, current: 0 };
    
    return {
        allowed: (usage.storage_used_bytes + fileSize) <= plan.maxStorageBytes,
        limit: plan.maxStorageBytes,
        current: usage.storage_used_bytes
    };
}

export async function checkAITokenLimit(userId: string, requestedTokens: number): Promise<{ allowed: boolean, limit: number, current: number }> {
    const { plan } = await getUserSubscription(userId);
    const usage = await getUserUsage(userId);
    
    if (!usage) return { allowed: false, limit: plan.maxAiTokens, current: 0 };
    
    return {
        allowed: (usage.ai_tokens_used + requestedTokens) <= plan.maxAiTokens,
        limit: plan.maxAiTokens,
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
