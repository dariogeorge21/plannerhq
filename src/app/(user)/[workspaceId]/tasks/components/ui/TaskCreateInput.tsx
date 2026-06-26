"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCreateTask } from "@/features/task/hooks";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";

import { DeadlinePicker } from "@/components/ui/deadline-picker";

interface TaskCreateInputProps {
  workspaceId: string;
  sectionId: string | null;
  onClose: () => void;
}

export function TaskCreateInput({ workspaceId, sectionId, onClose }: TaskCreateInputProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const createTask = useCreateTask(workspaceId);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      onClose();
      return;
    }

    let finalTitle = title;
    let completed = false;

    // Slash command shorthand for checking
    if (finalTitle.startsWith("/checkbox ") || finalTitle.startsWith("[ ] ")) {
      finalTitle = finalTitle.replace(/^(\/checkbox\s+|\[\s\]\s+)/i, "");
    } else if (finalTitle.startsWith("[x] ")) {
      finalTitle = finalTitle.replace(/^\[x\]\s+/i, "");
      completed = true;
    }

    createTask.mutate({ title: finalTitle, section_id: sectionId, due_date: dueDate }, {
      onSuccess: () => {
        setTitle("");
        setDueDate(null);
        // Keep input open to add more tasks
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-card rounded-xl border-2 border-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.1)] p-1 transition-all">
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-primary pl-1">
        {createTask.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
      </div>
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!title) onClose();
        }}
        placeholder="Type a task title... (Press Enter to save, Esc to cancel)"
        className="flex-1 h-8 text-sm bg-transparent text-foreground placeholder:text-muted-foreground border-0 focus-visible:ring-0 px-1 shadow-none"
        disabled={createTask.isPending}
      />
      <div className="flex-shrink-0 pr-1">
        <DeadlinePicker
          value={dueDate}
          onChange={setDueDate}
        />
      </div>
    </div>
  );
}
