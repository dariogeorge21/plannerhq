"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function InviteUserToWorkspaceByHqid(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const hqid = formData.get('hqid') as string;
    const workspaceId = formData.get('workspaceId') as string;
    const inviteType = formData.get('inviteType') as string; // 'admin' | 'member' | 'viewer'

    // Get current user (the inviter)
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
        return { success: false, message: "Not authenticated" };
    }

    // Resolve the invitee user details by HQID
    const { data: userResult, error: userError } = await supabase.rpc('get_user_by_hqid', {
        p_hqid: hqid
    });
    const users = userResult as any[];
    if (userError || !users || users.length === 0) {
        return { success: false, message: "User not found with this HQID" };
    }
    
    // Call invite function with correct RPC name and parameters
    const { error: workspaceError } = await supabase.rpc('invite_user_to_workspace_by_hqid', {
        p_workspace_id: workspaceId,
        p_inviter_id: currentUser.id,
        p_invitee_hqid: hqid,
        p_role: inviteType
    });

    if (workspaceError) {
        return { success: false, message: "Failed to invite user (possibly already invited/member)" };
    }
    revalidatePath(`/${workspaceId}`);
    revalidatePath(`/${workspaceId}/settings`);
    return { success: true, message: "User invited successfully" };
}

export async function InviteUserToWorkspaceByEmail(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const workspaceId = formData.get('workspaceId') as string;
    const inviteType = formData.get('inviteType') as string; // 'admin' | 'member' | 'viewer'

    // Get current user (the inviter)
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
        return { success: false, message: "Not authenticated" };
    }

    // Resolve the invitee user details by email
    const { data: userResult, error: userError } = await supabase.rpc('get_user_by_email', { 
        p_email: email
    });
    const users = userResult as any[];
    if (userError || !users || users.length === 0) {
        return { success: false, message: "User not found with this email" };
    }
    
    // Call invite function with correct RPC name and parameters
    const { error: workspaceError } = await supabase.rpc('invite_user_to_workspace_by_email', {
        p_workspace_id: workspaceId,
        p_inviter_id: currentUser.id,
        p_invitee_email: email,
        p_role: inviteType
    });

    if (workspaceError) {
        return { success: false, message: "Failed to invite user (possibly already invited/member)" };
    }
    revalidatePath(`/${workspaceId}`);
    revalidatePath(`/${workspaceId}/settings`);
    return { success: true, message: "User invited successfully" };
}

export async function RemoveUserFromWorkspace(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const workspaceId = formData.get('workspaceId') as string;
    const userId = formData.get('userId') as string;
    
    const { error: workspaceError } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);
        
    if (workspaceError) {
        return { success: false, message: "Failed to remove user" };
    }
    revalidatePath(`/${workspaceId}`);
    revalidatePath(`/${workspaceId}/members`);
    return { success: true, message: "User removed successfully" };
}

export async function ListInvitationsForUser(): Promise<{ success: boolean, message: string, data?: any }> {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const { data: invitations, error: invitationError } = await supabase.rpc('list_invitations_for_user', {
        p_invitee_id: user.id
    });
    if (invitationError) {
        return { success: false, message: "Failed to list invitations" };
    }
    return { success: true, message: "Invitations listed successfully", data: invitations };
}

export async function ListInvitationsForWorkspace(workspaceId: string): Promise<{ success: boolean, message: string, data?: any[] }> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from('workspace_invites')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('status', 'pending');

    if (error) {
        return { success: false, message: "Failed to list workspace invites" };
    }
    return { success: true, message: "Workspace invites listed successfully", data };
}

export async function AcceptInvitation(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const invitationId = formData.get('invitationId') as string;
    
    const { error: invitationError } = await supabase.rpc('accept_invitation', {
        p_invitation_id: invitationId
    });
    if (invitationError) {
        return { success: false, message: "Failed to accept invitation" };
    }
    revalidatePath('/dashboard');
    return { success: true, message: "Invitation accepted successfully" };
}

export async function DeclineInvitation(formData: FormData): Promise<{ success: boolean, message: string }> {
    const supabase = await createClient();
    const invitationId = formData.get('invitationId') as string;
    
    const { error: invitationError } = await supabase.rpc('decline_invitation', {
        p_invitation_id: invitationId
    });
    if (invitationError) {
        return { success: false, message: "Failed to decline invitation" };
    }
    revalidatePath('/dashboard');
    return { success: true, message: "Invitation declined successfully" };
}