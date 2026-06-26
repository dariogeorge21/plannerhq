import {
    ListInvitationsForUser,
    AcceptInvitation,
    DeclineInvitation
} from "@/features/workspace/invites";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest):Promise<NextResponse>{
    const {success,message} = await ListInvitationsForUser();
    if(success){
        return NextResponse.json({success,message});
    }
    return NextResponse.json({success,message}, {status:400});
}

export async function PUT(request:NextRequest):Promise<NextResponse>{
    const data = await request.formData();
    const {success,message} = await AcceptInvitation(data);
    if(success){
        return NextResponse.json({success,message});
    }
    return NextResponse.json({success,message}, {status:400});
}

export async function DELETE(request:NextRequest):Promise<NextResponse>{
    const data = await request.formData();
    const {success,message} = await DeclineInvitation(data);
    if(success){
        return NextResponse.json({success,message});
    }
    return NextResponse.json({success,message}, {status:400});
}