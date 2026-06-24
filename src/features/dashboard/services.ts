"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileOverviewData {
    /** Profile identity */
    displayName: string;
    avatarUrl: string | null;
    hqid: string;
    email: string;

    /**
     * Derived role: the most-prominent role across all the user's workspaces.
     * "owner" > "admin" > "member". Falls back to "member" if no memberships found.
     */
    primaryRole: "owner" | "admin" | "member";

    /** Workspace breakdown */
    ownedCount: number;      // workspaces where role = 'owner'
    joinedCount: number;     // workspaces where role = 'admin' | 'member'

    /**
     * Total unique member user_ids across all the user's workspaces,
     * excluding the user themselves.
     * e.g. 7 workspaces × 3 members each (excluding self) = 21
     */
    connectedMembersCount: number;

    /** Sum of workspace_members.time_spent_seconds for this user */
    totalTimeSeconds: number;
}

// ─── Server Function ──────────────────────────────────────────────────────────

export async function GetUserProfileOverview(): Promise<{
    success: boolean;
    message: string;
    data?: ProfileOverviewData;
}> {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, message: "User not authenticated" };
    }

    // 1. Fetch profile
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, hqid, email")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        return { success: false, message: "Profile not found" };
    }

    // 2. Fetch the user's workspace memberships (role + time)
    const { data: memberships, error: membershipError } = await supabase
        .from("workspace_members")
        .select("workspace_id, role, time_spent_seconds")
        .eq("user_id", user.id);

    if (membershipError || !memberships) {
        // Return profile only with zero stats
        return {
            success: true,
            message: "Profile fetched; workspace stats unavailable",
            data: {
                displayName: profile.display_name || "",
                avatarUrl: profile.avatar_url,
                hqid: profile.hqid || "",
                email: profile.email || "",
                primaryRole: "member",
                ownedCount: 0,
                joinedCount: 0,
                connectedMembersCount: 0,
                totalTimeSeconds: 0,
            },
        };
    }

    const ownedCount = memberships.filter((m) => m.role === "owner").length;
    const joinedCount = memberships.filter(
        (m) => m.role === "admin" || m.role === "member"
    ).length;
    const totalTimeSeconds = memberships.reduce(
        (acc, m) => acc + (m.time_spent_seconds || 0),
        0
    );

    // Derive primary role: owner > admin > member
    let primaryRole: "owner" | "admin" | "member" = "member";
    if (memberships.some((m) => m.role === "owner")) {
        primaryRole = "owner";
    } else if (memberships.some((m) => m.role === "admin")) {
        primaryRole = "admin";
    }

    // 3. Fetch all member user_ids across the user's workspaces (excluding self)
    let connectedMembersCount = 0;

    const workspaceIds = memberships.map((m) => m.workspace_id);

    if (workspaceIds.length > 0) {
        const { data: allMembers, error: allMembersError } = await supabase
            .from("workspace_members")
            .select("user_id")
            .in("workspace_id", workspaceIds)
            .neq("user_id", user.id);

        if (!allMembersError && allMembers) {
            // Count all members rows (one per workspace-member pair), not unique users.
            // Logic: 7 workspaces × 3 members each (excl. self) = 21 total entries.
            connectedMembersCount = allMembers.length;
        }
    }

    return {
        success: true,
        message: "Profile overview fetched successfully",
        data: {
            displayName: profile.display_name || "",
            avatarUrl: profile.avatar_url,
            hqid: profile.hqid || "",
            email: profile.email || "",
            primaryRole,
            ownedCount,
            joinedCount,
            connectedMembersCount,
            totalTimeSeconds,
        },
    };
}
