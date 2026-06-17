import React from "react";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function SettingsCard({ title, description, children, className }: SettingsCardProps) {
    return (
        <div className={cn(
            "rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md p-6 sm:p-8 shadow-xs transition-colors",
            className
        )}>
            <div className="mb-6">
                <h3 className="text-lg font-extrabold text-neutral-950 dark:text-white tracking-tight">{title}</h3>
                {description && (
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium mt-1">{description}</p>
                )}
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}
