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
    Laptop,
    User,
    Bell,
    Palette,
    Shield,
    Sparkles,
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
                body: JSON.stringify({ [fieldName]: value }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success(
                    `${fieldName === "avatar" ? "Avatar" : fieldName.toUpperCase()} updated!`
                );
                setProfile((prev) =>
                    prev
                        ? {
                            ...prev,
                            [fieldName === "avatar" ? "avatar_url" : fieldName]: value,
                        }
                        : null
                );
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

    const handleNotificationToggle = async (
        key: "email" | "push" | "inApp",
        checked: boolean
    ) => {
        if (!profile) return;
        const newPrefs = {
            ...profile.notification_preferences,
            [key]: checked,
        };

        setProfile((prev) =>
            prev
                ? {
                    ...prev,
                    notification_preferences: newPrefs,
                }
                : null
        );

        try {
            const res = await fetch("/api/user/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationPreferences: newPrefs }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setProfile((prev) =>
                    prev
                        ? {
                            ...prev,
                            notification_preferences: profile.notification_preferences,
                        }
                        : null
                );
                toast.error(data.error || "Failed to update notification settings");
            } else {
                toast.success("Notification preferences updated");
            }
        } catch (err) {
            console.error(err);
            setProfile((prev) =>
                prev
                    ? {
                        ...prev,
                        notification_preferences: profile.notification_preferences,
                    }
                    : null
            );
            toast.error("Failed to update notification settings");
        }
    };

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme);
        await handleSaveField("theme", newTheme);
    };

    if (loading) {
        return (
            <div className="max-w-9xl mx-auto bg-neutral-50/30 dark:bg-neutral-950/20 text-neutral-900 dark:text-white font-sans flex flex-col">
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
            <div className="max-w-9xl mx-auto bg-neutral-50/30 dark:bg-neutral-950/20 text-neutral-900 dark:text-white font-sans flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 text-center shadow-xl flex flex-col items-center">
                    <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                        Profile not found
                    </h3>
                    <p className="text-sm text-neutral-500 mt-2 mb-6 font-medium">
                        We couldn't retrieve your settings. Please sign in again.
                    </p>
                    <Link
                        href="/signin"
                        className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 py-3 text-sm font-semibold transition-all"
                    >
                        Go to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/30 dark:bg-neutral-950/20 text-neutral-900 dark:text-white font-sans flex flex-col selection:bg-primary/20 transition-colors">
            {/* Decorative background elements */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-xs transition-colors">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                            Settings
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                        <span className="text-xs font-medium text-muted-foreground/80">
                            {profile.name}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 space-y-10 relative">
                {/* Page Title */}
                <div className="relative">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-sm">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                                Settings
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm max-w-xl">
                                Manage your profile, interface preferences, and notification
                                channels.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <section>
                    <SettingsCard
                        title="Public Profile"
                        description="How other members see you within PlannerHQ workspaces."
                        className="shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <AvatarPicker
                            value={profile.avatar_url}
                            onChange={(url) => handleSaveField("avatar", url)}
                            displayName={profile.name}
                        />

                        <div className="border-t border-border/60 my-6" />

                        <div className="grid gap-6">
                            <EditableField
                                label="Full Name"
                                value={profile.name}
                                placeholder="Your full name"
                                onSave={(val) => handleSaveField("name", val)}
                                validator={(val) =>
                                    val.trim().length === 0 ? "Name cannot be empty" : null
                                }
                            />

                            <EditableField
                                label="HQID (Unique Handle)"
                                value={profile.hqid}
                                placeholder="your-unique-handle"
                                isMono
                                onSave={(val) => handleSaveField("hqid", val)}
                                validator={(val) => {
                                    if (val.trim().length < 3)
                                        return "HQID must be at least 3 characters";
                                    if (val.trim().length > 30)
                                        return "HQID cannot exceed 30 characters";
                                    const hqidRegex = /^[a-z0-9_-]+$/;
                                    if (!hqidRegex.test(val.trim().toLowerCase())) {
                                        return "HQID can only contain letters, numbers, hyphens, and underscores";
                                    }
                                    return null;
                                }}
                            />

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider block">
                                    Email Address (Read-only)
                                </label>
                                <div className="py-2.5 px-4 bg-muted/30 text-muted-foreground rounded-xl border border-border/60 text-sm font-medium select-none">
                                    {profile.email}
                                </div>
                            </div>
                        </div>
                    </SettingsCard>
                </section>

                {/* Interface Preferences */}
                <section>
                    <SettingsCard
                        title="Interface Preferences"
                        description="Tailor your visual experience across light, dark, and system default environments."
                        className="shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-foreground block">
                                Theme Selection
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    {
                                        name: "Light",
                                        value: "light",
                                        icon: Sun,
                                        desc: "Classic bright mode",
                                    },
                                    {
                                        name: "Dark",
                                        value: "dark",
                                        icon: Moon,
                                        desc: "Soft dark colors",
                                    },
                                    {
                                        name: "System",
                                        value: "system",
                                        icon: Laptop,
                                        desc: "Follow system setting",
                                    },
                                ].map((themeItem) => {
                                    const Icon = themeItem.icon;
                                    const isSelected = theme === themeItem.value;
                                    return (
                                        <button
                                            key={themeItem.value}
                                            type="button"
                                            onClick={() => handleThemeChange(themeItem.value)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] group",
                                                isSelected
                                                    ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                                                    : "border-border bg-background/50 text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                                            )}
                                        >
                                            <Icon className="w-5 h-5 mb-2 transition-transform group-hover:scale-110" />
                                            <span className="text-sm font-bold block">
                                                {themeItem.name}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground/60 font-medium block mt-0.5">
                                                {themeItem.desc}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </SettingsCard>
                </section>

                {/* Notification Preferences */}
                <section>
                    <SettingsCard
                        title="Notification Preferences"
                        description="Decide which alert triggers push notify, email, or badge indicators."
                        className="shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="space-y-4">
                            {[
                                {
                                    key: "inApp" as const,
                                    label: "In-App Notifications",
                                    desc: "Show badges, highlights, and sidebar alerts while navigating the application.",
                                    icon: Bell,
                                },
                                {
                                    key: "email" as const,
                                    label: "Email Summaries",
                                    desc: "Receive automated alerts, digest updates, and workspace invitations directly in your inbox.",
                                    icon: Sparkles,
                                },
                                {
                                    key: "push" as const,
                                    label: "Browser Push Alerts",
                                    desc: "Receive device-level alerts even when PlannerHQ is running in the background.",
                                    icon: Shield,
                                },
                            ].map((pref) => {
                                const Icon = pref.icon;
                                const isChecked = profile.notification_preferences[pref.key];
                                return (
                                    <div
                                        key={pref.key}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border transition-colors",
                                            isChecked
                                                ? "border-primary/20 bg-primary/5"
                                                : "border-border bg-background/40 hover:bg-muted/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={cn(
                                                    "p-2 rounded-xl transition-colors",
                                                    isChecked
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-muted/30 text-muted-foreground"
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="space-y-0.5 pr-4">
                                                <Label className="text-sm font-semibold text-foreground">
                                                    {pref.label}
                                                </Label>
                                                <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-sm">
                                                    {pref.desc}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={isChecked}
                                            onCheckedChange={(checked) =>
                                                handleNotificationToggle(pref.key, checked)
                                            }
                                            className="cursor-pointer shrink-0"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </SettingsCard>
                </section>

                {/* Footer subtle */}
                <div className="text-center text-xs text-muted-foreground/50 pt-4 border-t border-border/30">
                    PlannerHQ v2.0 — Your preferences are synced across all devices.
                </div>
            </main>
        </div>
    );
}