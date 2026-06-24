'use client';

import React from 'react';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AggregatedCalendarItem,
  AggregatedWorkspaceEvent,
  AggregatedWorkspaceTask,
  PersonalEvent,
} from '../types';
import { Clock, CheckCircle2, Building2, User } from 'lucide-react';

interface AggregatedEventCardProps {
  item: AggregatedCalendarItem;
  view: 'month' | 'week' | 'day';
  onClick: () => void;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function AggregatedEventCard({ item, view, onClick }: AggregatedEventCardProps) {
  const { type } = item;

  // ─── Derive display data per item type ─────────────────────────────────
  let title = '';
  let color = '#6366f1';
  let startTime: Date | null = null;
  let endTime: Date | null = null;
  let workspaceName: string | null = null;
  let isCompleted = false;

  if (type === 'personal_event') {
    const e = item.item as PersonalEvent;
    title = e.title;
    color = e.color;
    startTime = new Date(e.start_at);
    endTime = new Date(e.end_at);
  } else if (type === 'workspace_event') {
    const e = item.item as AggregatedWorkspaceEvent;
    title = e.title;
    color = e.workspace_color;
    startTime = new Date(e.start_at);
    endTime = new Date(e.end_at);
    workspaceName = e.workspace_name;
  } else {
    const t = item.item as AggregatedWorkspaceTask;
    title = t.title;
    color = t.completed ? '#94a3b8' : t.workspace_color;
    startTime = new Date(t.due_date);
    endTime = new Date(t.due_date);
    workspaceName = t.workspace_name;
    isCompleted = t.completed;
  }

  const bgColor = hexToRgba(color, 0.12);
  const borderColor = hexToRgba(color, 0.35);
  const textColor = color;

  // Month: compact pill
  if (view === 'month') {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        title={title}
        className={cn(
          'text-xs px-1.5 py-0.5 rounded-sm truncate cursor-pointer transition-all border flex items-center gap-1 group',
          isCompleted && 'opacity-60'
        )}
        style={{
          backgroundColor: bgColor,
          borderColor,
          color: textColor,
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="truncate font-medium flex-1">{title}</span>
        {type === 'personal_event' && <User className="w-2.5 h-2.5 shrink-0 opacity-60" />}
        {(type === 'workspace_event' || type === 'workspace_task') && (
          <Building2 className="w-2.5 h-2.5 shrink-0 opacity-50" />
        )}
      </div>
    );
  }

  // Week / Day: block card
  const sameDay = startTime && endTime ? isSameDay(startTime, endTime) : true;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        'h-full w-full rounded-md border p-1.5 flex flex-col cursor-pointer transition-colors overflow-hidden',
        isCompleted && 'opacity-60 grayscale-[30%]'
      )}
      style={{
        backgroundColor: bgColor,
        borderColor,
        color: textColor,
      }}
    >
      {/* Source badge */}
      {workspaceName && (
        <span
          className="text-[9px] font-bold uppercase tracking-wider opacity-70 truncate mb-0.5"
          style={{ color: textColor }}
        >
          {workspaceName}
        </span>
      )}
      {type === 'personal_event' && (
        <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 mb-0.5">Personal</span>
      )}

      <span className="text-xs font-semibold leading-tight truncate">{title}</span>

      {/* Time */}
      {startTime && type !== 'workspace_task' && (
        <div className="flex items-center text-[10px] mt-1 opacity-80">
          <Clock className="w-3 h-3 mr-1 shrink-0" />
          {format(startTime, 'h:mm')}
          {endTime && !isSameDay(startTime, endTime) ? '' : endTime && ` - ${format(endTime, 'h:mm')}`}
        </div>
      )}
      {type === 'workspace_task' && startTime && (
        <div className="flex items-center text-[10px] mt-1 opacity-80">
          {isCompleted ? <CheckCircle2 className="w-3 h-3 mr-1 shrink-0" /> : <Clock className="w-3 h-3 mr-1 shrink-0" />}
          {format(startTime, 'h:mm a')} Due
        </div>
      )}
    </div>
  );
}
