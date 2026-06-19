"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCreateTask } from "@/features/task/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TaskCreateInputProps {
  workspaceId: string;
  sectionId: string | null;
  onClose: () => void;
}

export function TaskCreateInput({ workspaceId, sectionId, onClose }: TaskCreateInputProps) {
  const [title, setTitle] = useState("");
  const createTask = useCreateTask(workspaceId);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    createTask.mutate({ title: finalTitle, section_id: sectionId }, {
      onSuccess: () => {
        setTitle("");
        // Keep input open to add more tasks
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!title) onClose();
        }}
        placeholder="Type a task title... (e.g., [ ] new task)"
        className="flex-1 h-8 text-sm"
      />
      <Button type="submit" size="sm" className="h-8" disabled={createTask.isPending || !title.trim()}>
        Add
      </Button>
    </form>
  );
}
