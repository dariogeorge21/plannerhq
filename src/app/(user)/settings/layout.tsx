"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Palette, Bell, Shield } from "lucide-react";
import { UserHeader } from "@/features/user/UserHeader";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
    {
        title: "Profile",
        href: "/settings/profile",
        icon: User,
    },
    {
        title: "Appearance",
        href: "/settings/appearance",
        icon: Palette,
    },
    {
        title: "Notifications",
        href: "/settings/notifications",
        icon: Bell,
    },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-neutral-50/30 dark:bg-neutral-950/20 text-neutral-900 dark:text-white font-sans flex flex-col selection:bg-primary/20 transition-colors">
            {/* Header */}
            {/* Note: In a real app we would pass the actual user object from context */}
            <UserHeader user={{}} />

            {/* Main Area */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 lg:w-72 shrink-0">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                                    Settings
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Manage your account and preferences.
                                </p>
                            </div>

                            <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                                {sidebarNavItems.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "w-4 h-4",
                                                    isActive ? "text-primary" : "text-muted-foreground/70"
                                                )}
                                            />
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
