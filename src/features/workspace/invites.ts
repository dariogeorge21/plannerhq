import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function InviteUserToWorkspaceByHqid(formData:FormData):Promise<{success:boolean,message:string}>{
    // invite can be done either by hqid only
    const supabase = await createClient();
    const hqid = formData.get('hqid') as string;
    const workspaceId = formData.get('workspaceId') as string;
    const inviteType = formData.get('inviteType') as string;

    const {data: user, error: userError} = await supabase.rpc('get_user_by_hqid',{
        p_hqid : hqid
    });
    if(userError){
        return {success:false,message:"User not found"}
    }
    
    const {data:workspace,error:workspaceError} = await supabase.rpc('invite_user_to_workspace',{
        p_workspace_id:workspaceId,
        p_inviter_id:user.id,
        p_invitee_hqid:hqid,
        p_role:inviteType
    })
    if(workspaceError){
        return {success:false,message:"Failed to invite user"}
    }
    revalidatePath('/dashboard');
    return {success:true,message:"User invited successfully"}
}

export async function InviteUserToWorkspaceByEmail(formData:FormData):Promise<{success:boolean,message:string}>{
    // invite can be done either by email only. Invite type can be admin, user or viewer
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const workspaceId = formData.get('workspaceId') as string;
    const inviteType = formData.get('inviteType') as string;

    const {data: user, error: userError} = await supabase.rpc('get_user_by_email',{ 
        p_email : email
    });
    if(userError){
        return {success:false,message:"User not found"}
    }
    
    const {data:workspace,error:workspaceError} = await supabase.rpc('invite_user_to_workspace',{
        p_workspace_id:workspaceId,
        p_inviter_id:user.id,
        p_invitee_email:email,
        p_role:inviteType
    })
    if(workspaceError){
        return {success:false,message:"Failed to invite user"}
    }
    revalidatePath('/dashboard');
    return {success:true,message:"User invited successfully"}
}

export async function RemoveUserFromWorkspace(formData:FormData):Promise<{success:boolean, message:string}>{
    const supabase = await createClient();
    const workspaceId = formData.get('workspaceId') as string;
    const userId = formData.get('userId') as string;
    
    const {data:workspace,error:workspaceError} = await supabase
        .from('workspace_users')
        .delete()
        .eq('workspace_id',workspaceId)
        .eq('user_id',userId);
    if(workspaceError){
        return {success:false,message:"Failed to remove user"}
    }
    revalidatePath('/dashboard');
    return {success:true,message:"User removed successfully"}
}

export async function ListInvitationsForUser():Promise<{success:boolean, message:string, data?: any}>{
    const supabase = await createClient();
    const {data:invitations,error:invitationError} = await supabase.rpc('list_invitations_for_user');
    if(invitationError){
        return {success:false,message:"Failed to list invitations"}
    }
    return {success:true,message:"Invitations listed successfully",data:invitations}
}

export async function AcceptInvitation(formData:FormData):Promise<{success:boolean, message:string}>{
    const supabase = await createClient();
    const invitationId = formData.get('invitationId') as string;
    const {data:invitation,error:invitationError} = await supabase.rpc('accept_invitation',{p_invitation_id:invitationId});
    if(invitationError){
        return {success:false,message:"Failed to accept invitation"}
    }
    revalidatePath('/dashboard');
    return {success:true,message:"Invitation accepted successfully"}
}

export async function DeclineInvitation(formData:FormData):Promise<{success:boolean, message:string}>{
    const supabase = await createClient();
    const invitationId = formData.get('invitationId') as string;
    const {data:invitation,error:invitationError} = await supabase.rpc('decline_invitation',{p_invitation_id:invitationId});
    if(invitationError){
        return {success:false,message:"Failed to decline invitation"}
    }
    revalidatePath('/dashboard');
    return {success:true,message:"Invitation declined successfully"}
}