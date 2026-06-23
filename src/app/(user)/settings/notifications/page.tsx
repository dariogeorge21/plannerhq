"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, Sparkles, Shield } from "lucide-react";
import { SettingsCard } from "../../profile/components/ui/settings-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProfileData } from "@/features/user/settings";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function NotificationsSettingsPage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/settings");
            const data = await res.json();
            if (res.ok && data.profile) {
                setProfile(data.profile);
            } else {
                toast.error(data.error || "Failed to load notification settings");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load notification settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleNotificationToggle = async (
        key: "email" | "push" | "inApp",
        checked: boolean
    ) => {
        if (!profile) return;
        const newPrefs = {
            ...profile.notification_preferences,
            [key]: checked,
        };

        // Optimistic UI update
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
                // Revert on failure
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
            // Revert on failure
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

    if (loading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                </div>
                <Skeleton className="h-64 w-full rounded-3xl" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="p-4 bg-muted/50 rounded-full text-muted-foreground">
                    <Bell className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Settings not found</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                    We couldn't retrieve your notification preferences. Please try reloading the page.
                </p>
                <button
                    onClick={fetchProfile}
                    className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:bg-primary/90 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <div className="relative">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-sm">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Notifications
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm max-w-xl">
                            Decide how and when PlannerHQ alerts you.
                        </p>
                    </div>
                </div>
            </div>

            <SettingsCard
                title="Delivery Channels"
                description="Manage where you receive your alerts."
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
                                    "flex items-start sm:items-center justify-between p-5 rounded-2xl border transition-all duration-200",
                                    isChecked
                                        ? "border-primary/20 bg-primary/5 shadow-sm"
                                        : "border-border bg-background/40 hover:bg-muted/30"
                                )}
                            >
                                <div className="flex items-start sm:items-center gap-4">
                                    <div
                                        className={cn(
                                            "p-2.5 rounded-xl transition-colors shrink-0",
                                            isChecked
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted/50 text-muted-foreground"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1 pr-4">
                                        <Label className="text-sm font-semibold text-foreground cursor-pointer" onClick={() => handleNotificationToggle(pref.key, !isChecked)}>
                                            {pref.label}
                                        </Label>
                                        <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-sm">
                                            {pref.desc}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-1 sm:mt-0">
                                    <Switch
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                            handleNotificationToggle(pref.key, checked)
                                        }
                                        className="cursor-pointer shrink-0"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </SettingsCard>
        </div>
    );
}
