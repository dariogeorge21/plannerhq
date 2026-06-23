import React from 'react';
import { cn } from '@/lib/utils';

export const PRESET_AVATARS = [
    { name: "Indigo Dream", value: "preset:indigo", bg: "bg-gradient-to-tr from-indigo-500 to-purple-500" },
    { name: "Emerald Sea", value: "preset:emerald", bg: "bg-gradient-to-tr from-emerald-500 to-teal-500" },
    { name: "Sunset Orange", value: "preset:sunset", bg: "bg-gradient-to-tr from-orange-500 to-rose-500" },
    { name: "Pastel Lavender", value: "preset:pastel", bg: "bg-gradient-to-tr from-violet-400 to-fuchsia-400" },
    { name: "Cyberpunk Glow", value: "preset:cyber", bg: "bg-gradient-to-tr from-cyan-400 to-blue-500" },
    { name: "Warm Amber", value: "preset:amber", bg: "bg-gradient-to-tr from-amber-400 to-orange-600" },
];

export function getPresetBackground(url: string | null | undefined): string {
    if (!url) return "bg-primary text-primary-foreground";
    const preset = PRESET_AVATARS.find(p => p.value === url);
    if (preset) return preset.bg + " text-white";
    return "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-white";
}

interface WorkspaceAvatarProps {
    workspace: { name: string; avatar_url?: string | null };
    className?: string;
}

export function WorkspaceAvatar({ workspace, className }: WorkspaceAvatarProps) {
    const isPreset = workspace.avatar_url?.startsWith("preset:");
    const hasImage = !!workspace.avatar_url && !isPreset;

    return (
        <div className={cn(
            "flex items-center justify-center font-bold shrink-0 overflow-hidden",
            !hasImage && getPresetBackground(workspace.avatar_url),
            className
        )}>
            {hasImage ? (
                <img 
                    src={workspace.avatar_url!} 
                    alt={workspace.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        (e.target as HTMLElement).parentElement!.innerText = workspace.name.charAt(0).toUpperCase();
                    }}
                />
            ) : (
                workspace.name.charAt(0).toUpperCase()
            )}
        </div>
    );
}
