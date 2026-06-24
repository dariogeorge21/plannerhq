'use client';

import React from 'react';
import {
  format, isSameDay, startOfWeek, addDays,
  eachHourOfInterval, startOfDay, endOfDay,
} from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AggregatedCalendarItem,
  AggregatedWorkspaceEvent,
  AggregatedWorkspaceTask,
  PersonalEvent,
} from '../types';
import { AggregatedEventCard } from './AggregatedEventCard';

interface PersonalWeekViewProps {
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

export function PersonalWeekView({ currentDate, items, onItemClick, onDayClick }: PersonalWeekViewProps) {
  const startDate = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const hours = eachHourOfInterval({ start: startOfDay(currentDate), end: endOfDay(currentDate) });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 rounded-b-xl overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="w-16 shrink-0 border-r border-neutral-100 dark:border-neutral-800" />
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={day.toString()}
                className="flex flex-col items-center py-3 border-r border-neutral-100 dark:border-neutral-800 last:border-r-0 cursor-pointer hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
                onClick={() => onDayClick(day)}
              >
                <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{format(day, 'EEE')}</span>
                <span className={cn(
                  'text-lg font-semibold w-8 h-8 flex items-center justify-center rounded-full mt-0.5',
                  isToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-800 dark:text-neutral-200'
                )}>
                  {format(day, 'd')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto relative bg-neutral-50/20 dark:bg-neutral-900/20">
        <div className="flex relative" style={{ height: `${24 * 60}px` }}>
          {/* Time axis */}
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

          {/* Day columns */}
          <div className="flex-1 grid grid-cols-7 relative">
            {/* Hour lines */}
            <div className="absolute inset-0 pointer-events-none">
              {hours.map((_, i) => (
                <div key={i} className="h-[60px] border-t border-neutral-100 dark:border-neutral-800 w-full" />
              ))}
            </div>

            {weekDays.map((day) => {
              const dayItems = items.filter((item) => isSameDay(getItemStart(item), day));
              return (
                <div
                  key={day.toString()}
                  className="relative border-r border-neutral-100 dark:border-neutral-800 last:border-r-0 h-full"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const hour = Math.floor(y / 60);
                    onDayClick(day, hour);
                  }}
                >
                  {dayItems.map((item) => {
                    const start = getItemStart(item);
                    const end = getItemEnd(item);
                    return (
                      <div
                        key={`${item.type}-${item.item.id}`}
                        className="absolute w-[calc(100%-8px)] left-[4px] z-20"
                        style={getPositionStyle(start, end)}
                      >
                        <AggregatedEventCard
                          item={item}
                          view="week"
                          onClick={() => onItemClick(item)}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
