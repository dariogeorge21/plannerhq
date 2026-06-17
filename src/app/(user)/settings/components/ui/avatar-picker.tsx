"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface AvatarPickerProps {
    value: string | null;
    onChange: (url: string) => void;
    displayName: string;
}

const PRESET_AVATARS = [
    { name: "Indigo Dream", value: "preset:indigo", bg: "bg-gradient-to-tr from-indigo-500 to-purple-500" },
    { name: "Emerald Sea", value: "preset:emerald", bg: "bg-gradient-to-tr from-emerald-500 to-teal-500" },
    { name: "Sunset Orange", value: "preset:sunset", bg: "bg-gradient-to-tr from-orange-500 to-rose-500" },
    { name: "Pastel Lavender", value: "preset:pastel", bg: "bg-gradient-to-tr from-violet-400 to-fuchsia-400" },
    { name: "Cyberpunk Glow", value: "preset:cyber", bg: "bg-gradient-to-tr from-cyan-400 to-blue-500" },
    { name: "Warm Amber", value: "preset:amber", bg: "bg-gradient-to-tr from-amber-400 to-orange-600" },
];

export function AvatarPicker({ value, onChange, displayName }: AvatarPickerProps) {
    const initials = displayName ? displayName.charAt(0).toUpperCase() : "?";
    
    // Check if the current value is a preset or a custom URL
    const isPreset = (val: string | null) => val ? val.startsWith("preset:") : false;
    const activePreset = isPreset(value) ? value : null;

    return (
        <div className="space-y-4">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                Profile Avatar
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Large Preview */}
                <div className="relative group shrink-0">
                    <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-lg transition-all transform group-hover:scale-105 duration-300 select-none",
                        activePreset === "preset:indigo" && PRESET_AVATARS[0].bg,
                        activePreset === "preset:emerald" && PRESET_AVATARS[1].bg,
                        activePreset === "preset:sunset" && PRESET_AVATARS[2].bg,
                        activePreset === "preset:pastel" && PRESET_AVATARS[3].bg,
                        activePreset === "preset:cyber" && PRESET_AVATARS[4].bg,
                        activePreset === "preset:amber" && PRESET_AVATARS[5].bg,
                        (!activePreset && value) && "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-700",
                        !value && PRESET_AVATARS[0].bg // Fallback to indigo
                    )}>
                        {(!activePreset && value) ? (
                            <img src={value} alt="Avatar" className="w-full h-full object-cover rounded-2xl" onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLElement).style.display = 'none';
                            }} />
                        ) : initials}
                    </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                    {/* Preset Grid */}
                    <div>
                        <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-2">
                            Choose from curated presets
                        </span>
                        <div className="grid grid-cols-6 gap-2">
                            {PRESET_AVATARS.map((preset) => {
                                const isSelected = value === preset.value || (!value && preset.value === "preset:indigo");
                                return (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        onClick={() => onChange(preset.value)}
                                        title={preset.name}
                                        className={cn(
                                            "h-10 rounded-xl relative flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-200",
                                            preset.bg
                                        )}
                                    >
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-xl flex items-center justify-center text-white">
                                                <Check className="w-4 h-4 drop-shadow-sm" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Image URL Input */}
                    <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                            Or use a custom image URL
                        </span>
                        <input
                            type="url"
                            placeholder="https://example.com/avatar.png"
                            value={isPreset(value) ? "" : (value || "")}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full text-xs rounded-xl border border-neutral-200/80 dark:border-neutral-800 focus:border-indigo-500/50 bg-white/70 dark:bg-neutral-900/40 text-neutral-800 dark:text-white px-3 py-2 shadow-2xs outline-hidden focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
