"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm, EventFormData } from "../ui/EventForm";
import { WorkspaceMemberOption } from "@/features/calendar/types";
import { useCreateEvent } from "@/features/calendar/hooks";
import { toast } from "sonner";

interface CreateEventModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
  members: WorkspaceMemberOption[];
}

export function CreateEventModal({
  workspaceId,
  isOpen,
  onClose,
  defaultDate,
  members,
}: CreateEventModalProps) {
  const createEvent = useCreateEvent(workspaceId);

  const handleSubmit = (data: EventFormData) => {
    createEvent.mutate(data, {
      onSuccess: () => {
        toast.success("Event created successfully");
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create event");
      },
    });
  };

  const initialData = defaultDate ? {
    start_at: defaultDate.toISOString(),
    end_at: new Date(defaultDate.getTime() + 60 * 60 * 1000).toISOString(),
  } : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-border bg-card">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Create New Event
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <EventForm
            members={members}
            onSubmit={handleSubmit}
            onCancel={onClose}
            initialData={initialData}
            isLoading={createEvent.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
