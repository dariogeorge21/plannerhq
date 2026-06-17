"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { 
    ChevronLeft, 
    Loader2, 
    Sun, 
    Moon, 
    Laptop
} from "lucide-react";
import Link from "next/link";
import { SettingsCard } from "./components/ui/settings-card";
import { EditableField } from "./components/ui/editable-field";
import { AvatarPicker } from "./components/ui/avatar-picker";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProfileData } from "@/features/user/settings";

export default function SettingsPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/settings");
            const data = await res.json();
            if (res.ok && data.profile) {
                setProfile(data.profile);
            } else {
                toast.error(data.error || "Failed to load profile settings");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load profile settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveField = async (fieldName: string, value: any) => {
        try {
            const res = await fetch("/api/user/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [fieldName]: value })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success(`${fieldName === 'avatar' ? 'Avatar' : fieldName.toUpperCase()} updated!`);
                // Update local state
                setProfile(prev => prev ? {
                    ...prev,
                    [fieldName === "avatar" ? "avatar_url" : fieldName]: value
                } : null);
                return true;
            } else {
                toast.error(data.error || `Failed to update ${fieldName}`);
                return false;
            }
        } catch (err) {
            console.error(err);
            toast.error(`Error updating ${fieldName}`);
            return false;
        }
    };

    const handleNotificationToggle = async (key: "email" | "push" | "inApp", checked: boolean) => {
        if (!profile) return;
        const newPrefs = {
            ...profile.notification_preferences,
            [key]: checked
        };
        
        // Optimistic update
        setProfile(prev => prev ? {
            ...prev,
            notification_preferences: newPrefs
        } : null);

        try {
            const res = await fetch("/api/user/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationPreferences: newPrefs })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                // Revert
                setProfile(prev => prev ? {
                    ...prev,
                    notification_preferences: profile.notification_preferences
                } : null);
                toast.error(data.error || "Failed to update notification settings");
            } else {
                toast.success("Notification preferences updated");
            }
        } catch (err) {
            console.error(err);
            // Revert
            setProfile(prev => prev ? {
                ...prev,
                notification_preferences: profile.notification_preferences
            } : null);
            toast.error("Failed to update notification settings");
        }
    };

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme);
        await handleSaveField("theme", newTheme);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50/30 dark:bg-neutral-950/20 text-neutral-900 dark:text-white font-sans flex flex-col">
                <header className="h-20 border-b border-neutral-200/50 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md flex items-center justify-between px-8">
                    <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-lg" />
                </header>
                <main className="flex-1 max-w-3xl w-full mx-auto p-6 sm:p-8 space-y-8">
                    <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-xl" />
                    <div className="h-64 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-3xl" />
                    <div className="h-48 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-3xl" />
                </main>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-neutral-50/30 dark:bg-neutral-950/20 text-neutral-900 dark:text-white font-sans flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center">
                    <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">Profile not found</h3>
                    <p className="text-sm text-neutral-500 mt-2 mb-6 font-medium">
                        We couldn't retrieve your settings. Please sign in again.
                    </p>
                    <Link href="/signin" className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 py-3 text-sm font-semibold transition-all">
                        Go to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/30 dark:bg-neutral-950/20 text-neutral-900 dark:text-white font-sans flex flex-col selection:bg-indigo-500/30 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-neutral-200/50 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-2xs transition-colors">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
                            Profile Settings
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 space-y-8 relative">
                {/* Decorative background glows */}
                <div className="absolute top-0 right-0 -translate-y-24 translate-x-24 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-40 left-0 translate-y-24 -translate-x-24 w-80 h-80 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

                {/* Page Title */}
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white flex items-center gap-2">
                        Settings
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1 font-medium text-sm">
                        Manage your profile representation, system preferences, and notification channels.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="relative z-10">
                    <SettingsCard 
                        title="Public Profile" 
                        description="How other members see you within PlannerHQ workspaces."
                    >
                        {/* Avatar Picker */}
                        <AvatarPicker
                            value={profile.avatar_url}
                            onChange={(url) => handleSaveField("avatar", url)}
                            displayName={profile.name}
                        />

                        <hr className="border-neutral-100 dark:border-neutral-800/60" />

                        {/* Name Field */}
                        <EditableField
                            label="Full Name"
                            value={profile.name}
                            placeholder="Your full name"
                            onSave={(val) => handleSaveField("name", val)}
                            validator={(val) => val.trim().length === 0 ? "Name cannot be empty" : null}
                        />

                        {/* HQID Field */}
                        <EditableField
                            label="HQID (Unique Handle)"
                            value={profile.hqid}
                            placeholder="your-unique-handle"
                            isMono
                            onSave={(val) => handleSaveField("hqid", val)}
                            validator={(val) => {
                                if (val.trim().length < 3) return "HQID must be at least 3 characters";
                                if (val.trim().length > 30) return "HQID cannot exceed 30 characters";
                                const hqidRegex = /^[a-z0-9_-]+$/;
                                if (!hqidRegex.test(val.trim().toLowerCase())) {
                                    return "HQID can only contain letters, numbers, hyphens, and underscores";
                                }
                                return null;
                            }}
                        />

                        {/* Email Field (Disabled) */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                                Email Address (Read-only)
                            </label>
                            <div className="py-2.5 px-3 bg-neutral-50 dark:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400 rounded-xl border border-neutral-100 dark:border-neutral-800/60 text-sm font-semibold select-none">
                                {profile.email}
                            </div>
                        </div>
                    </SettingsCard>
                </div>

                {/* System Settings Card */}
                <div className="relative z-10">
                    <SettingsCard 
                        title="Interface Preferences" 
                        description="Tailor your visual experience across light, dark, and system default environments."
                    >
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 block">
                                Theme Selection
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { name: "Light", value: "light", icon: Sun, desc: "Classic bright mode" },
                                    { name: "Dark", value: "dark", icon: Moon, desc: "Soft dark colors" },
                                    { name: "System", value: "system", icon: Laptop, desc: "Follow system setting" },
                                ].map((themeItem) => {
                                    const Icon = themeItem.icon;
                                    const isSelected = theme === themeItem.value;
                                    return (
                                        <button
                                            key={themeItem.value}
                                            type="button"
                                            onClick={() => handleThemeChange(themeItem.value)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                                                isSelected 
                                                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/10" 
                                                    : "border-neutral-200/80 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/10 text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                                            )}
                                        >
                                            <Icon className="w-5 h-5 mb-2" />
                                            <span className="text-xs font-extrabold block">{themeItem.name}</span>
                                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium block mt-0.5">{themeItem.desc}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </SettingsCard>
                </div>

                {/* Notification Settings Card */}
                <div className="relative z-10">
                    <SettingsCard 
                        title="Notification Preferences" 
                        description="Decide which alert triggers push notify, email, or badge indicators."
                    >
                        <div className="space-y-4">
                            {[
                                { 
                                    key: "inApp" as const, 
                                    label: "In-App Notifications", 
                                    desc: "Show badges, highlights, and sidebar alerts while navigating the application." 
                                },
                                { 
                                    key: "email" as const, 
                                    label: "Email Summaries", 
                                    desc: "Receive automated alerts, digest updates, and workspace invitations directly in your inbox." 
                                },
                                { 
                                    key: "push" as const, 
                                    label: "Browser Push Alerts", 
                                    desc: "Receive device-level alerts even when PlannerHQ is running in the background." 
                                },
                            ].map((pref) => (
                                <div key={pref.key} className="flex items-center justify-between p-4 border border-neutral-100 dark:border-neutral-800/60 rounded-2xl bg-white/40 dark:bg-neutral-900/10 hover:bg-neutral-50/40 dark:hover:bg-neutral-900/20 transition-colors">
                                    <div className="space-y-0.5 pr-4">
                                        <Label className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">{pref.label}</Label>
                                        <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium leading-relaxed">{pref.desc}</p>
                                    </div>
                                    <Switch 
                                        checked={profile.notification_preferences[pref.key]}
                                        onCheckedChange={(checked) => handleNotificationToggle(pref.key, checked)}
                                        className="cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </SettingsCard>
                </div>
            </main>
        </div>
    );
}
