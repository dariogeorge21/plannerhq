"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Sun, Moon, Laptop, Palette } from "lucide-react";
import { SettingsCard } from "../../profile/components/ui/settings-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function AppearanceSettingsPage() {
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/settings");
            if (res.ok) {
                // Done loading
            }
        } catch (err) {
            console.error(err);
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
            if (!res.ok || !data.success) {
                toast.error(data.error || `Failed to sync ${fieldName}`);
            }
        } catch (err) {
            console.error(err);
            toast.error(`Error syncing ${fieldName}`);
        }
    };

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme);
        await handleSaveField("theme", newTheme);
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
                <Skeleton className="h-48 w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <div className="relative">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-sm">
                        <Palette className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Appearance
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm max-w-xl">
                            Tailor your visual experience across light, dark, and system environments.
                        </p>
                    </div>
                </div>
            </div>

            <SettingsCard
                title="Theme Preference"
                description="Choose how PlannerHQ looks to you."
                className="shadow-sm hover:shadow-md transition-shadow duration-300"
            >
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
                                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-sm"
                                        : "border-border bg-background/50 text-muted-foreground hover:border-primary/30 hover:bg-muted/30 hover:text-foreground"
                                )}
                            >
                                <Icon className={cn(
                                    "w-6 h-6 mb-3 transition-transform group-hover:scale-110",
                                    isSelected ? "text-primary" : "text-muted-foreground"
                                )} />
                                <span className="text-sm font-bold block">
                                    {themeItem.name}
                                </span>
                                <span className="text-xs text-muted-foreground/60 font-medium block mt-1">
                                    {themeItem.desc}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </SettingsCard>
        </div>
    );
}
