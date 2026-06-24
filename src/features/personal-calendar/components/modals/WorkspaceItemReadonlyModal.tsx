'use client';

import React from 'react';
import { format, isSameDay } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AggregatedWorkspaceEvent, AggregatedWorkspaceTask } from '../../types';
import { CalendarDays, Clock, AlignLeft, Building2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type WorkspaceReadonlyItem =
  | { kind: 'event'; item: AggregatedWorkspaceEvent }
  | { kind: 'task'; item: AggregatedWorkspaceTask };

interface WorkspaceItemReadonlyModalProps {
  data: WorkspaceReadonlyItem;
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_BADGE: Record<string, string> = {
  high: 'bg-rose-100 text-rose-800',
  medium: 'bg-indigo-100 text-indigo-800',
  low: 'bg-emerald-100 text-emerald-800',
};

export function WorkspaceItemReadonlyModal({ data, isOpen, onClose }: WorkspaceItemReadonlyModalProps) {
  const isEvent = data.kind === 'event';
  const item = data.item;

  const title = item.title;
  const description = item.description;
  const workspaceName = isEvent
    ? (data.item as AggregatedWorkspaceEvent).workspace_name
    : (data.item as AggregatedWorkspaceTask).workspace_name;
  const workspaceId = isEvent
    ? (data.item as AggregatedWorkspaceEvent).workspace_id
    : (data.item as AggregatedWorkspaceTask).workspace_id;
  const color = isEvent
    ? (data.item as AggregatedWorkspaceEvent).workspace_color
    : (data.item as AggregatedWorkspaceTask).workspace_color;

  let start: Date | null = null;
  let end: Date | null = null;
  let priority: string | null = null;
  let taskStatus: string | null = null;
  let taskCompleted = false;

  if (isEvent) {
    const e = data.item as AggregatedWorkspaceEvent;
    start = new Date(e.start_at);
    end = new Date(e.end_at);
    priority = e.priority;
  } else {
    const t = data.item as AggregatedWorkspaceTask;
    start = new Date(t.due_date);
    priority = t.priority;
    taskStatus = t.status;
    taskCompleted = t.completed;
  }

  const sameDay = start && end ? isSameDay(start, end) : true;
  const timeDisplay = isEvent && start && end
    ? (sameDay
      ? `${format(start, 'h:mm a')} – ${format(end, 'h:mm a')}`
      : `${format(start, 'MMM d, h:mm a')} – ${format(end, 'MMM d, h:mm a')}`)
    : start ? `Due ${format(start, 'h:mm a')}` : '';

  const viewLink = isEvent
    ? `/${workspaceId}/calendar`
    : `/${workspaceId}/tasks?taskId=${item.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-neutral-200">
        {/* Colored top bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

        <DialogHeader className="px-6 py-5 border-b border-neutral-100 bg-white">
          <div className="flex items-start gap-3 pr-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${color}20` }}
            >
              <Building2 className="w-4.5 h-4.5" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900 leading-tight">
                {title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {workspaceName}
                </span>
                {priority && (
                  <Badge
                    variant="secondary"
                    className={`uppercase text-[10px] font-bold tracking-wider rounded-md border-none px-2 py-0.5 ${PRIORITY_BADGE[priority] || 'bg-neutral-100 text-neutral-700'}`}
                  >
                    {priority}
                  </Badge>
                )}
                {taskCompleted && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                    Completed
                  </Badge>
                )}
                {taskStatus && !taskCompleted && (
                  <Badge variant="secondary" className="bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider">
                    {taskStatus}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Date / Time */}
          {start && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                <CalendarDays className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{format(start, 'EEEE, MMMM d, yyyy')}</p>
                {timeDisplay && (
                  <div className="flex items-center text-sm text-neutral-500 mt-1">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {timeDisplay}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="flex items-start gap-3 pt-4 border-t border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlignLeft className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-1">Description</p>
                <p className="text-sm text-neutral-600 whitespace-pre-wrap leading-relaxed">{description}</p>
              </div>
            </div>
          )}

          {/* Read-only notice */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2 border-t border-neutral-100">
            <Building2 className="w-3.5 h-3.5" />
            <span>This is a workspace item — view and edit it in <strong>{workspaceName}</strong></span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Close
          </Button>
          <Button asChild className="rounded-xl text-white shadow-sm" style={{ backgroundColor: color }}>
            <Link href={viewLink} target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Workspace
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
