'use client';

import React from 'react';
import { format, isSameDay, eachHourOfInterval, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AggregatedCalendarItem,
  AggregatedWorkspaceEvent,
  AggregatedWorkspaceTask,
  PersonalEvent,
} from '../types';
import { AggregatedEventCard } from './AggregatedEventCard';

interface PersonalDayViewProps {
  currentDate: Date;
  items: AggregatedCalendarItem[];
  onItemClick: (item: AggregatedCalendarItem) => void;
  onDayClick: (date: Date, hour?: number) => void;
}

function getPositionStyle(start: Date, end: Date) {
  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;
  const duration = Math.max(0.5, endHour - startHour);
  return { top: `${startHour * 60}px`, height: `${duration * 60}px` };
}

function getItemStart(item: AggregatedCalendarItem): Date {
  if (item.type === 'personal_event') return new Date((item.item as PersonalEvent).start_at);
  if (item.type === 'workspace_event') return new Date((item.item as AggregatedWorkspaceEvent).start_at);
  return new Date((item.item as AggregatedWorkspaceTask).due_date);
}

function getItemEnd(item: AggregatedCalendarItem): Date {
  if (item.type === 'personal_event') return new Date((item.item as PersonalEvent).end_at);
  if (item.type === 'workspace_event') return new Date((item.item as AggregatedWorkspaceEvent).end_at);
  const due = new Date((item.item as AggregatedWorkspaceTask).due_date);
  return new Date(due.getTime() + 30 * 60000);
}

export function PersonalDayView({ currentDate, items, onItemClick, onDayClick }: PersonalDayViewProps) {
  const hours = eachHourOfInterval({ start: startOfDay(currentDate), end: endOfDay(currentDate) });
  const isToday = isSameDay(currentDate, new Date());
  const dayItems = items.filter((item) => isSameDay(getItemStart(item), currentDate));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 rounded-b-xl overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-6 py-4 items-center gap-3">
        <span className={cn(
          'text-3xl font-bold w-12 h-12 flex items-center justify-center rounded-xl',
          isToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-800 dark:text-neutral-200'
        )}>
          {format(currentDate, 'd')}
        </span>
        <div>
          <p className={cn('text-sm font-bold uppercase tracking-wider', isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 dark:text-neutral-400')}>
            {format(currentDate, 'EEEE')}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">{format(currentDate, 'MMMM yyyy')}</p>
        </div>
        <div className="ml-auto text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {dayItems.length > 0 ? `${dayItems.length} item${dayItems.length > 1 ? 's' : ''}` : 'No events'}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex relative" style={{ height: `${24 * 60}px` }}>
          {/* Time column */}
          <div className="w-16 shrink-0 border-r border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10">
            {hours.map((hour, i) => (
              <div key={i} className="h-[60px] relative">
                {i > 0 && (
                  <span className="absolute -top-2.5 right-2 text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                    {format(hour, 'ha')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div
            className="flex-1 relative bg-neutral-50/20 dark:bg-neutral-900/20"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const y = e.clientY - rect.top;
              const hour = Math.floor(y / 60);
              onDayClick(currentDate, hour);
            }}
          >
            {/* Hour lines */}
            <div className="absolute inset-0 pointer-events-none">
              {hours.map((_, i) => (
                <div key={i} className="h-[60px] border-t border-neutral-100 dark:border-neutral-800 w-full" />
              ))}
            </div>

            {/* Items */}
            {dayItems.map((item) => {
              const start = getItemStart(item);
              const end = getItemEnd(item);
              return (
                <div
                  key={`${item.type}-${item.item.id}`}
                  className="absolute left-2 right-2 z-20"
                  style={getPositionStyle(start, end)}
                >
                  <AggregatedEventCard
                    item={item}
                    view="day"
                    onClick={() => onItemClick(item)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
