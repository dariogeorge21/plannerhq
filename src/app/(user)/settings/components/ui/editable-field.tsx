"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
    label: string;
    value: string;
    placeholder?: string;
    onSave: (newValue: string) => Promise<boolean>;
    validator?: (val: string) => string | null;
    isMono?: boolean;
}

export function EditableField({ label, value, placeholder, onSave, validator, isMono = false }: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Keep tempValue in sync with prop updates
    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleSave = async () => {
        setError(null);
        const trimmed = tempValue.trim();
        
        if (validator) {
            const validationError = validator(trimmed);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        if (trimmed === value.trim()) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        try {
            const success = await onSave(trimmed);
            if (success) {
                setIsEditing(false);
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
        setError(null);
    };

    return (
        <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                {label}
            </label>
            
            <div className="flex items-center gap-3 min-h-[44px]">
                {isEditing ? (
                    <div className="flex-1 flex flex-row items-center gap-2">
                        <Input
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder={placeholder}
                            disabled={loading}
                            className={cn(
                                "flex-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/40 text-neutral-800 dark:text-white px-3 py-2 text-sm font-semibold focus-visible:ring-indigo-500/10",
                                isMono && "font-mono"
                            )}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                                if (e.key === "Escape") handleCancel();
                            }}
                        />
                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={loading}
                                className="rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center justify-center h-9 w-9 p-0 shrink-0 cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Check className="w-4 h-4" />
                                )}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={loading}
                                className="rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center justify-center h-9 w-9 p-0 shrink-0 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-between border border-transparent py-2 rounded-xl">
                        <span className={cn(
                            "text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight",
                            isMono && "font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1.5 rounded-lg border border-neutral-200/30 dark:border-neutral-700/30"
                        )}>
                            {value || <span className="text-neutral-300 dark:text-neutral-600 italic font-normal">Not set</span>}
                        </span>
                        
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setIsEditing(true)}
                            className="text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-[11px] font-bold text-red-500 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}
