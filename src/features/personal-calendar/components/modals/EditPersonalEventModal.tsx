'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PersonalEventForm, PersonalEventFormData } from '../PersonalEventForm';
import { useUpdatePersonalEvent } from '../../hooks';
import { PersonalEvent } from '../../types';
import { toast } from 'sonner';
import { Edit2 } from 'lucide-react';

interface EditPersonalEventModalProps {
  userId: string;
  event: PersonalEvent;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPersonalEventModal({
  userId,
  event,
  isOpen,
  onClose,
}: EditPersonalEventModalProps) {
  const updateEvent = useUpdatePersonalEvent(userId);

  const handleSubmit = (data: PersonalEventFormData) => {
    updateEvent.mutate(
      { id: event.id, ...data },
      {
        onSuccess: (result) => {
          if (result.success) {
            toast.success('Event updated');
            onClose();
          } else {
            toast.error(result.error || 'Failed to update event');
          }
        },
        onError: () => toast.error('Failed to update event'),
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-neutral-200">
        <DialogHeader className="px-6 py-4 border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-indigo-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-indigo-600" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900">
              Edit Personal Event
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="p-6">
          <PersonalEventForm
            initialData={{
              title: event.title,
              description: event.description || '',
              start_at: event.start_at,
              end_at: event.end_at,
              color: event.color,
            }}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={updateEvent.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
