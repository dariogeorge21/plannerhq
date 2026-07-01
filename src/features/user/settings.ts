import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface ProfileData {
    name: string;
    email: string;
    hqid: string;
    avatar_url: string | null;
    theme: string;
    notification_preferences: {
        email: boolean;
        push: boolean;
        inApp: boolean;
    };
    role: string | null;
}

export async function profileSettings(): Promise<{ profile: ProfileData } | { error: string }> {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user?.user) {
        redirect('/signin');
    }

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("display_name, email, hqid, avatar_url, theme, notification_preferences, role")
        .eq("id", user.user.id)
        .maybeSingle();

    console.log(profile)

    if (error || !profile) {
        return { error: "Profile not found" };
    }

    const defaultPrefs = { email: false, push: false, inApp: true };
    const savedPrefs = profile.notification_preferences as any;

    return {
        profile: {
            name: profile.display_name,
            email: profile.email,
            hqid: profile.hqid,
            avatar_url: profile.avatar_url,
            theme: profile.theme || 'light',
            notification_preferences: {
                email: typeof savedPrefs?.email === 'boolean' ? savedPrefs.email : defaultPrefs.email,
                push: typeof savedPrefs?.push === 'boolean' ? savedPrefs.push : defaultPrefs.push,
                inApp: typeof savedPrefs?.inApp === 'boolean' ? savedPrefs.inApp : defaultPrefs.inApp,
            },
            role: profile.role
        }
    };
}

// User can change switch theme(default light)
export async function updateTheme(theme: string): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
        return { error: "User not found" };
    }

    if (!['light', 'dark', 'system'].includes(theme)) {
        return { error: "Invalid theme option selected" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ theme })
        .eq("id", user.user.id);

    if (error) {
        return { error: "Failed to update theme" };
    }
    revalidatePath("/settings");
    return { success: true };
}

export async function updateHqid(newHqid: string): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
        return { error: "User not found" };
    }

    const cleanedHqid = newHqid.trim().toLowerCase();
    const hqidRegex = /^[a-z0-9_-]+$/;

    if (cleanedHqid.length < 3 || cleanedHqid.length > 30) {
        return { error: "HQID must be between 3 and 30 characters long" };
    }

    if (!hqidRegex.test(cleanedHqid)) {
        return { error: "HQID can only contain letters, numbers, hyphens, and underscores" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ hqid: cleanedHqid })
        .eq("id", user.user.id);

    if (error) {
        if (error.code === '23505') {
            return { error: "This HQID is already taken" };
        }
        return { error: "Failed to update HQID" };
    }
    revalidatePath("/settings");
    return { success: true };
}

export async function updateUserName(name: string): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
        return { error: "User not found" };
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
        return { error: "Display name cannot be empty" };
    }

    if (trimmedName.length > 50) {
        return { error: "Display name cannot exceed 50 characters" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ display_name: trimmedName })
        .eq("id", user.user.id);

    if (error) {
        return { error: "Failed to update name" };
    }
    revalidatePath("/settings");
    return { success: true };
}

export async function updateAvatar(avatar: string): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
        return { error: "User not found" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: avatar })
        .eq("id", user.user.id);

    if (error) {
        return { error: "Failed to update avatar" };
    }
    revalidatePath("/settings");
    return { success: true };
}

export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    inApp: boolean;
}

export async function updateNotificationPreferences(notificationPreferences: NotificationPreferences): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
        return { error: "User not found" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: notificationPreferences })
        .eq("id", user.user.id);

    if (error) {
        return { error: "Failed to update notification preferences" };
    }
    revalidatePath("/settings");
    return { success: true };
}

// Unified update function for settings page saving
export async function updateProfileSettings(updates: {
    name?: string;
    hqid?: string;
    theme?: string;
    avatar_url?: string;
    notification_preferences?: NotificationPreferences;
    role?: string;
}): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
        return { error: "User not found" };
    }

    const dbUpdates: any = {};

    if (updates.name !== undefined) {
        const trimmedName = updates.name.trim();
        if (trimmedName.length === 0) return { error: "Display name cannot be empty" };
        if (trimmedName.length > 50) return { error: "Display name cannot exceed 50 characters" };
        dbUpdates.display_name = trimmedName;
    }

    if (updates.hqid !== undefined) {
        const cleanedHqid = updates.hqid.trim().toLowerCase();
        const hqidRegex = /^[a-z0-9_-]+$/;
        if (cleanedHqid.length < 3 || cleanedHqid.length > 30) {
            return { error: "HQID must be between 3 and 30 characters long" };
        }
        if (!hqidRegex.test(cleanedHqid)) {
            return { error: "HQID can only contain letters, numbers, hyphens, and underscores" };
        }
        dbUpdates.hqid = cleanedHqid;
    }

    if (updates.theme !== undefined) {
        if (!['light', 'dark', 'system'].includes(updates.theme)) {
            return { error: "Invalid theme selection" };
        }
        dbUpdates.theme = updates.theme;
    }

    if (updates.avatar_url !== undefined) {
        dbUpdates.avatar_url = updates.avatar_url;
    }

    if (updates.notification_preferences !== undefined) {
        dbUpdates.notification_preferences = updates.notification_preferences;
    }

    if (updates.role !== undefined) {
        dbUpdates.role = updates.role.trim();
    }

    if (Object.keys(dbUpdates).length === 0) {
        return { error: "No fields to update" };
    }

    const { error } = await supabase
        .from("profiles")
        .update(dbUpdates)
        .eq("id", user.user.id);

    if (error) {
        if (error.code === '23505') {
            return { error: "This HQID is already taken" };
        }
        return { error: error.message || "Failed to update profile settings" };
    }

    revalidatePath("/settings");
    return { success: true };
}