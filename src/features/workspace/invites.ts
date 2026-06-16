"use server";

import { createClient } from "@/lib/supabase/server";
import type { WorkspaceRole, InviteStatus } from "@/types/workspace";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InviteResult = { success: boolean; message: string };

export type UserInvitation = {
    id: string;
    role: string;
    created_at: string;
    workspace_name: string;
    workspace_description: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve a profile's UUID from their HQID.
 * Returns null if not found.
 */
async function resolveProfileByHqid(
    supabase: Awaited<ReturnType<typeof createClient>>,
    hqid: string
): Promise<string | null> {
    const { data, error } = await supabase
        .rpc('get_user_by_hqid', { p_hqid: hqid });
    if (error || !data || (data as { id: string }[]).length === 0) return null;
    return (data as { id: string }[])[0].id;
}

/**
 * Resolve a profile's UUID from their email.
 * Returns null if not found.
 */
async function resolveProfileByEmail(
    supabase: Awaited<ReturnType<typeof createClient>>,
    email: string
): Promise<string | null> {
    const { data, error } = await supabase
        .rpc('get_user_by_email', { p_email: email });
    if (error || !data || (data as { id: string }[]).length === 0) return null;
    return (data as { id: string }[])[0].id;
}

/**
 * Check whether a pending invite already exists for (workspaceId, inviteeId).
 * Returns true if a duplicate would occur.
 */
async function hasPendingInvite(
    supabase: Awaited<ReturnType<typeof createClient>>,
    workspaceId: string,
    inviteeId: string
): Promise<boolean> {
    const { count } = await supabase
        .from('workspace_invites')
        .select('id', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .eq('invitee_id', inviteeId)
        .eq('status', 'pending');
    return (count ?? 0) > 0;
}

/**
 * Check whether the invitee is already a member of the workspace.
 */
async function isAlreadyMember(
    supabase: Awaited<ReturnType<typeof createClient>>,
    workspaceId: string,
    inviteeId: string
): Promise<boolean> {
    const { count } = await supabase
        .from('workspace_members')
        .select('user_id', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .eq('user_id', inviteeId);
    return (count ?? 0) > 0;
}

// ─── Invite by HQID ──────────────────────────────────────────────────────────

export async function InviteUserToWorkspaceByHqid(formData: FormData): Promise<InviteResult> {
    const supabase = await createClient();
    const hqid = formData.get('hqid') as string;
    const workspaceId = formData.get('workspaceId') as string;
    const role = formData.get('inviteType') as string;

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return { success: false, message: "Not authenticated" };

    // Resolve the target profile
    const inviteeId = await resolveProfileByHqid(supabase, hqid);
    if (!inviteeId) return { success: false, message: "User not found with this HQ ID" };

    // Prevent inviting yourself
    if (inviteeId === currentUser.id) {
        return { success: false, message: "You cannot invite yourself" };
    }

    // Already a member?
    if (await isAlreadyMember(supabase, workspaceId, inviteeId)) {
        return { success: false, message: "This user is already a member of the workspace" };
    }

    // Already has a pending invite (regardless of whether it was sent by email or hqid)?
    if (await hasPendingInvite(supabase, workspaceId, inviteeId)) {
        return { success: false, message: "An invitation has already been sent to this user" };
    }

    const { error } = await supabase.rpc('invite_user_to_workspace_by_hqid', {
        p_workspace_id: workspaceId,
        p_inviter_id: currentUser.id,
        p_invitee_hqid: hqid,
        p_role: role
    });

    if (error) {
        // Unique index violation — race condition or concurrent invite
        if (error.code === '23505') {
            return { success: false, message: "An invitation has already been sent to this user" };
        }
        return { success: false, message: "Failed to send invitation" };
    }

    revalidatePath(`/${workspaceId}`);
    revalidatePath(`/${workspaceId}/settings`);
    return { success: true, message: "Invitation sent successfully" };
}

// ─── Invite by Email ──────────────────────────────────────────────────────────

export async function InviteUserToWorkspaceByEmail(formData: FormData): Promise<InviteResult> {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const workspaceId = formData.get('workspaceId') as string;
    const role = formData.get('inviteType') as string;

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return { success: false, message: "Not authenticated" };

    // Resolve the target profile
    const inviteeId = await resolveProfileByEmail(supabase, email);
    if (!inviteeId) return { success: false, message: "User not found with this email" };

    // Prevent inviting yourself
    if (inviteeId === currentUser.id) {
        return { success: false, message: "You cannot invite yourself" };
    }

    // Already a member?
    if (await isAlreadyMember(supabase, workspaceId, inviteeId)) {
        return { success: false, message: "This user is already a member of the workspace" };
    }

    // Already has a pending invite (regardless of whether sent via email or hqid)?
    if (await hasPendingInvite(supabase, workspaceId, inviteeId)) {
        return { success: false, message: "An invitation has already been sent to this user" };
    }

    const { error } = await supabase.rpc('invite_user_to_workspace_by_email', {
        p_workspace_id: workspaceId,
        p_inviter_id: currentUser.id,
        p_invitee_email: email,
        p_role: role
    });

    if (error) {
        if (error.code === '23505') {
            return { success: false, message: "An invitation has already been sent to this user" };
        }
        return { success: false, message: "Failed to send invitation" };
    }

    revalidatePath(`/${workspaceId}`);
    revalidatePath(`/${workspaceId}/settings`);
    return { success: true, message: "Invitation sent successfully" };
}

// ─── Remove Member ────────────────────────────────────────────────────────────

export async function RemoveUserFromWorkspace(formData: FormData): Promise<InviteResult> {
    const supabase = await createClient();
    const workspaceId = formData.get('workspaceId') as string;
    const userId = formData.get('userId') as string;

    const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);

    if (error) return { success: false, message: "Failed to remove user" };

    revalidatePath(`/${workspaceId}`);
    revalidatePath(`/${workspaceId}/members`);
    return { success: true, message: "User removed successfully" };
}

// ─── List Invitations for the logged-in user ──────────────────────────────────

export async function ListInvitationsForUser(): Promise<{
    success: boolean;
    message: string;
    data?: UserInvitation[];
}> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "User not found" };

    const { data, error } = await supabase
        .from('workspace_invites')
        .select('id, role, created_at, workspaces(name, description)')
        .eq('invitee_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("ListInvitationsForUser error:", error.message);
        return { success: false, message: "Failed to list invitations" };
    }

    type RawInviteRow = {
        id: string;
        role: string;
        created_at: string;
        workspaces: { name: string; description: string | null } | null;
    };

    const mapped: UserInvitation[] = (data as unknown as RawInviteRow[])
        .filter(item => item.workspaces !== null)
        .map(item => ({
            id: item.id,
            role: item.role,
            created_at: item.created_at,
            workspace_name: item.workspaces!.name,
            workspace_description: item.workspaces!.description
        }));
    return { success: true, message: "Invitations listed successfully", data: mapped };
}

// ─── List Invitations for a workspace (admin view) ────────────────────────────

export async function ListInvitationsForWorkspace(workspaceId: string): Promise<{
    success: boolean;
    message: string;
    data?: {
        id: string;
        invitee_hqid: string;
        invitee_email: string | null;
        role: WorkspaceRole;
        status: InviteStatus;
        created_at: string;
        expires_at: string;
    }[];
}> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('workspace_invites')
        .select('id, invitee_hqid, invitee_email, role, status, created_at, expires_at')
        .eq('workspace_id', workspaceId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) return { success: false, message: "Failed to list workspace invites" };
    return {
        success: true,
        message: "Workspace invites listed successfully",
        data: data as unknown as {
            id: string;
            invitee_hqid: string;
            invitee_email: string | null;
            role: WorkspaceRole;
            status: InviteStatus;
            created_at: string;
            expires_at: string;
        }[],
    };
}

// ─── Accept Invitation ────────────────────────────────────────────────────────

export async function AcceptInvitation(formData: FormData): Promise<InviteResult> {
    const supabase = await createClient();
    const invitationId = formData.get('invitationId') as string;

    const { error } = await supabase.rpc('accept_invitation', {
        p_invitation_id: invitationId
    });

    if (error) {
        console.error("AcceptInvitation error:", error.message);
        return { success: false, message: "Failed to accept invitation" };
    }

    revalidatePath('/dashboard');
    return { success: true, message: "Invitation accepted successfully" };
}

// ─── Decline Invitation ───────────────────────────────────────────────────────

export async function DeclineInvitation(formData: FormData): Promise<InviteResult> {
    const supabase = await createClient();
    const invitationId = formData.get('invitationId') as string;

    const { error } = await supabase.rpc('decline_invitation', {
        p_invitation_id: invitationId
    });

    if (error) {
        console.error("DeclineInvitation error:", error.message);
        return { success: false, message: "Failed to decline invitation" };
    }
    revalidatePath('/dashboard');
    return { success: true, message: "Invitation declined successfully" };
}
