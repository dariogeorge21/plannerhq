import { NextRequest, NextResponse } from "next/server";
import {
    updateProfileSettings,
    profileSettings
} from "@/features/user/settings";

export async function GET(request: NextRequest) {
    try {
        const result = await profileSettings();
        if ("error" in result) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
        return NextResponse.json({ profile: result.profile });
    } catch (error) {
        console.error("Error fetching profile settings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        // Extract fields
        const { hqid, theme, name, avatar, notificationPreferences } = body;
        // Build unified updates object
        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (hqid !== undefined) updates.hqid = hqid;
        if (theme !== undefined) updates.theme = theme;
        if (avatar !== undefined) updates.avatar_url = avatar;
        if (notificationPreferences !== undefined) {
            updates.notification_preferences = notificationPreferences;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No update data provided" }, { status: 400 });
        }

        const result = await updateProfileSettings(updates);
        if ("error" in result) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating profile settings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
