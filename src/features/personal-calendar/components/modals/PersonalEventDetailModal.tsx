'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PersonalEvent } from '../../types';
import { useDeletePersonalEvent } from '../../hooks';
import { toast } from 'sonner';
import { CalendarDays, Clock, AlignLeft, Edit2, Trash2, Loader2, User } from 'lucide-react';

interface PersonalEventDetailModalProps {
  userId: string;
  event: PersonalEvent;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: () => void;
}

export function PersonalEventDetailModal({
  userId,
  event,
  isOpen,
  onClose,
  onEditClick,
}: PersonalEventDetailModalProps) {
  const deleteEvent = useDeletePersonalEvent(userId);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDelete = () => {
    deleteEvent.mutate(event.id, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success('Event deleted');
          setIsConfirmingDelete(false);
          onClose();
        } else {
          toast.error(result.error || 'Failed to delete event');
        }
      },
      onError: () => toast.error('Failed to delete event'),
    });
  };

  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  const isSameDay = start.toDateString() === end.toDateString();

  const timeDisplay = isSameDay
    ? `${format(start, 'h:mm a')} – ${format(end, 'h:mm a')}`
    : `${format(start, 'MMM d, h:mm a')} – ${format(end, 'MMM d, h:mm a')}`;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsConfirmingDelete(false);
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-neutral-200">
        {/* Header colored bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: event.color }} />

        <DialogHeader className="px-6 py-5 border-b border-neutral-100 bg-white">
          <div className="flex items-start gap-3 pr-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${event.color}20` }}
            >
              <User className="w-4.5 h-4.5" style={{ color: event.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900 leading-tight">
                {event.title}
              </DialogTitle>
              <span className="text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full" style={{ backgroundColor: `${event.color}18`, color: event.color }}>
                Personal Event
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Date / Time */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarDays className="w-4 h-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{format(start, 'EEEE, MMMM d, yyyy')}</p>
              <div className="flex items-center text-sm text-neutral-500 mt-1">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {timeDisplay}
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="flex items-start gap-3 pt-4 border-t border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlignLeft className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-1">Notes</p>
                <p className="text-sm text-neutral-600 whitespace-pre-wrap leading-relaxed">{event.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center">
          {isConfirmingDelete ? (
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-sm text-red-600 font-medium pl-1">Delete this event?</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsConfirmingDelete(false)} disabled={deleteEvent.isPending}>
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteEvent.isPending}>
                  {deleteEvent.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setIsConfirmingDelete(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                onClick={() => { onClose(); onEditClick(); }}
                className="text-white shadow-sm"
                style={{ backgroundColor: event.color }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Event
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
