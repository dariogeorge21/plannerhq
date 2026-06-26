import {
    InviteUserToWorkspaceByEmail,
    InviteUserToWorkspaceByHqid,
    RemoveUserFromWorkspace,
    
} from "@/features/workspace/invites";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest):Promise<NextResponse>{
    const data = await request.formData();
    const inviteType = data.get('inviteType') as string;
    if(inviteType === "hqid"){
        const {success,message} = await InviteUserToWorkspaceByHqid(data);
        if(success){
            return NextResponse.json({success,message});
        }
        return NextResponse.json({success,message}, {status:400});
    }else{
        const {success,message} = await InviteUserToWorkspaceByEmail(data);
        if(success){
            return NextResponse.json({success,message});
        }
        return NextResponse.json({success,message}, {status:400});
    }
}

export async function DELETE(request:NextRequest):Promise<NextResponse>{
    const data = await request.formData();
    const {success,message} = await RemoveUserFromWorkspace(data);
    if(success){
        return NextResponse.json({success,message});
    }
    return NextResponse.json({success,message}, {status:400});
}