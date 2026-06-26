"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm, EventFormData } from "../ui/EventForm";
import { WorkspaceMemberOption, CalendarEventWithDetails } from "@/features/calendar/types";
import { useUpdateEvent } from "@/features/calendar/hooks";
import { toast } from "sonner";

interface EditEventModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventWithDetails;
  members: WorkspaceMemberOption[];
}

export function EditEventModal({
  workspaceId,
  isOpen,
  onClose,
  event,
  members,
}: EditEventModalProps) {
  const updateEvent = useUpdateEvent(workspaceId);

  const initialData = useMemo(() => {
    return {
      title: event.title,
      description: event.description || "",
      start_at: event.start_at,
      end_at: event.end_at,
      priority: event.priority,
      mention_all: event.mention_all,
      mention_ids: event.mentions.map((m) => m.user_id),
      attendee_ids: event.attendees.map((a) => a.user_id),
    };
  }, [event]);

  const handleSubmit = (data: EventFormData) => {
    updateEvent.mutate({ id: event.id, ...data }, {
      onSuccess: () => {
        toast.success("Event updated successfully");
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update event");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-neutral-200">
        <DialogHeader className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900">
            Edit Event
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <EventForm
            members={members}
            onSubmit={handleSubmit}
            onCancel={onClose}
            initialData={initialData}
            isLoading={updateEvent.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
