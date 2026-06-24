'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PersonalEventForm, PersonalEventFormData } from '../PersonalEventForm';
import { useCreatePersonalEvent } from '../../hooks';
import { toast } from 'sonner';
import { User } from 'lucide-react';

interface CreatePersonalEventModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
}

export function CreatePersonalEventModal({
  userId,
  isOpen,
  onClose,
  defaultDate,
}: CreatePersonalEventModalProps) {
  const createEvent = useCreatePersonalEvent(userId);

  const handleSubmit = (data: PersonalEventFormData) => {
    createEvent.mutate(data, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success('Personal event created');
          onClose();
        } else {
          toast.error(result.error || 'Failed to create event');
        }
      },
      onError: () => toast.error('Failed to create event'),
    });
  };

  const formatForInput = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const initialData = defaultDate
    ? {
        start_at: formatForInput(defaultDate),
        end_at: formatForInput(new Date(defaultDate.getTime() + 60 * 60 * 1000)),
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-neutral-200">
        <DialogHeader className="px-6 py-4 border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-indigo-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900">
              New Personal Event
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="p-6">
          <PersonalEventForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={createEvent.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
