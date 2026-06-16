import { NextRequest, NextResponse } from "next/server";

import {
    ListWorkspace,
    CreateWorkspace,
    ArchieveWorkspace,
    UpdateWorkspace,
} from "@/features/workspace/workspace"

export async function GET(): Promise<NextResponse> {
    const { success, message, data } = await ListWorkspace();
    if (success) {
        return NextResponse.json({ success, message, data });
    }
    return NextResponse.json({ success, message }, { status: 400 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const data = await request.formData();
    const { success, message } = await CreateWorkspace(data);
    if (success) {
        return NextResponse.json({ success, message });
    }
    return NextResponse.json({ success, message }, { status: 400 });
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const data = await request.formData();
    const { success, message } = await UpdateWorkspace(data);
    if (success) {
        return NextResponse.json({ success, message });
    }
    return NextResponse.json({ success, message }, { status: 400 });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const data = await request.formData();
    const { success, message } = await ArchieveWorkspace(data);
    if (success) {
        return NextResponse.json({ success, message });
    }
    return NextResponse.json({ success, message }, { status: 400 });
}