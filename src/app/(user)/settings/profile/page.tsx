"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";
import { SettingsCard } from "../../profile/components/ui/settings-card";
import { EditableField } from "../../profile/components/ui/editable-field";
import { AvatarPicker } from "../../profile/components/ui/avatar-picker";
import { ProfileData } from "@/features/user/settings";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Progress } from "@/components/ui/progress";

export default function ProfileSettingsPage() {
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

    if (loading) {
        return (
            <LoadingScreen fullScreen={false} messages={["Loading profile details...", "Fetching user data..."]}>
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-72" />
                        </div>
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                </div>
            </LoadingScreen>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="p-4 bg-muted/50 rounded-full text-muted-foreground">
                    <User className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Profile not found</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                    We couldn't retrieve your profile data. Please try reloading the page.
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

    // Calculate profile completeness
    const completeness = [
        !!profile.name,
        !!profile.hqid,
        !!profile.avatar_url,
    ].filter(Boolean).length;
    const completenessPercentage = (completeness / 3) * 100;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <div className="relative">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-sm">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Public Profile
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm max-w-xl">
                            How other members see you within PlannerHQ workspaces.
                        </p>
                    </div>
                </div>
            </div>

            {completenessPercentage < 100 && (
                <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 space-y-1 w-full">
                        <p className="text-sm font-semibold text-foreground">
                            Profile Completeness ({Math.round(completenessPercentage)}%)
                        </p>
                        <Progress value={completenessPercentage} className="h-2" />
                    </div>
                    <div className="text-sm text-primary font-medium shrink-0">
                        {!profile.avatar_url ? "Add an avatar" : !profile.name ? "Add your name" : "Complete your profile"}
                    </div>
                </div>
            )}

            <SettingsCard
                title="Profile Details"
                description="Manage your personal information and identity."
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
                        label="Professional Role"
                        value={profile.role || ""}
                        placeholder="e.g. Product Manager, Senior Developer"
                        onSave={(val) => handleSaveField("role", val)}
                        validator={(val) =>
                            val.trim().length > 50 ? "Role cannot exceed 50 characters" : null
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
        </div>
    );
}
