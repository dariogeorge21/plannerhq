"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarEventPriority, WorkspaceMemberOption } from "@/features/calendar/types";
import { PrioritySelector } from "./PrioritySelector";
import { MentionPicker } from "./MentionPicker";

export interface EventFormData {
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  priority: CalendarEventPriority;
  mention_all: boolean;
  mention_ids: string[];
  attendee_ids: string[];
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  members: WorkspaceMemberOption[];
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EventForm({ initialData, members, onSubmit, onCancel, isLoading }: EventFormProps) {
  // Format current date to YYYY-MM-DDThh:mm for datetime-local input
  const formatForInput = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const now = new Date();
  const defaultStart = initialData?.start_at ? new Date(initialData.start_at) : now;
  const defaultEnd = initialData?.end_at ? new Date(initialData.end_at) : new Date(now.getTime() + 60 * 60 * 1000); // +1 hour

  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    start_at: formatForInput(defaultStart),
    end_at: formatForInput(defaultEnd),
    priority: initialData?.priority || "medium",
    mention_all: initialData?.mention_all || false,
    mention_ids: initialData?.mention_ids || [],
    attendee_ids: initialData?.attendee_ids || [],
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (new Date(formData.end_at) < new Date(formData.start_at)) {
      setError("End time must be after start time");
      return;
    }

    // Convert local time strings to UTC ISO strings before submitting
    const submitData = {
      ...formData,
      start_at: new Date(formData.start_at).toISOString(),
      end_at: new Date(formData.end_at).toISOString(),
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 font-medium">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          placeholder="e.g., Weekly Sync"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          disabled={isLoading}
          autoFocus
          className="h-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="start_at">Start Time</Label>
          <Input
            id="start_at"
            type="datetime-local"
            value={formData.start_at}
            onChange={(e) => {
              const newStart = e.target.value;
              setFormData((prev) => {
                // Auto-adjust end time if it's before the new start time
                if (new Date(prev.end_at) < new Date(newStart)) {
                  const end = new Date(newStart);
                  end.setHours(end.getHours() + 1);
                  return { ...prev, start_at: newStart, end_at: formatForInput(end) };
                }
                return { ...prev, start_at: newStart };
              });
            }}
            disabled={isLoading}
            className="h-10 cursor-pointer"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_at">End Time</Label>
          <Input
            id="end_at"
            type="datetime-local"
            value={formData.end_at}
            onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
            disabled={isLoading}
            className="h-10 cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add details, meeting links, or agenda..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isLoading}
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <PrioritySelector
          value={formData.priority}
          onChange={(val) => setFormData({ ...formData, priority: val })}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2 pt-2 border-t border-neutral-100">
        <Label>Mentions</Label>
        <MentionPicker
          members={members}
          selectedUserIds={formData.mention_ids}
          onChange={(ids) => setFormData({ ...formData, mention_ids: ids })}
          mentionAll={formData.mention_all}
          onMentionAllChange={(val) => setFormData({ ...formData, mention_all: val })}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="h-10 px-4 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          {isLoading ? "Saving..." : "Save Event"}
        </Button>
      </div>
    </form>
  );
}
