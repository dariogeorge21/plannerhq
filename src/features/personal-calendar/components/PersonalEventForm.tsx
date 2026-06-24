'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PERSONAL_EVENT_COLORS, PersonalEvent } from '../types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface PersonalEventFormData {
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  color: string;
}

interface PersonalEventFormProps {
  initialData?: Partial<PersonalEventFormData>;
  onSubmit: (data: PersonalEventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PersonalEventForm({ initialData, onSubmit, onCancel, isLoading }: PersonalEventFormProps) {
  const formatForInput = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const now = new Date();
  const defaultStart = initialData?.start_at ? new Date(initialData.start_at) : now;
  const defaultEnd = initialData?.end_at
    ? new Date(initialData.end_at)
    : new Date(now.getTime() + 60 * 60 * 1000);

  const [formData, setFormData] = useState<PersonalEventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    start_at: formatForInput(defaultStart),
    end_at: formatForInput(defaultEnd),
    color: initialData?.color || '#6366f1',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (new Date(formData.end_at) < new Date(formData.start_at)) {
      setError('End time must be after start time');
      return;
    }

    onSubmit({
      ...formData,
      start_at: new Date(formData.start_at).toISOString(),
      end_at: new Date(formData.end_at).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="personal-title">
          Event Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="personal-title"
          placeholder="e.g., Doctor Appointment"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          disabled={isLoading}
          autoFocus
          className="h-10"
        />
      </div>

      {/* Time range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="personal-start">Start Time</Label>
          <Input
            id="personal-start"
            type="datetime-local"
            value={formData.start_at}
            onChange={(e) => {
              const newStart = e.target.value;
              setFormData((prev) => {
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
          <Label htmlFor="personal-end">End Time</Label>
          <Input
            id="personal-end"
            type="datetime-local"
            value={formData.end_at}
            onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
            disabled={isLoading}
            className="h-10 cursor-pointer"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="personal-description">Description</Label>
        <Textarea
          id="personal-description"
          placeholder="Add any notes..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isLoading}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Color picker */}
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex gap-2 flex-wrap">
          {PERSONAL_EVENT_COLORS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              title={label}
              disabled={isLoading}
              onClick={() => setFormData({ ...formData, color: value })}
              className={cn(
                'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all',
                formData.color === value
                  ? 'border-neutral-900 scale-110 shadow-md'
                  : 'border-transparent hover:scale-105'
              )}
              style={{ backgroundColor: value }}
            >
              {formData.color === value && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
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
          className="h-10 px-6 rounded-xl text-white shadow-sm"
          style={{ backgroundColor: formData.color }}
        >
          {isLoading ? 'Saving...' : 'Save Event'}
        </Button>
      </div>
    </form>
  );
}
