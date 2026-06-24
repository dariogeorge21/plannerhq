'use client';

import React, { useState, useMemo } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameDay, isSameMonth, format,
} from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AggregatedCalendarItem,
  AggregatedWorkspaceEvent,
  AggregatedWorkspaceTask,
  PersonalEvent,
} from '../types';
import { AggregatedEventCard } from './AggregatedEventCard';

interface PersonalMonthViewProps {
  currentDate: Date;
  items: AggregatedCalendarItem[];
  onItemClick: (item: AggregatedCalendarItem) => void;
  onDayClick: (date: Date) => void;
}

export function PersonalMonthView({
  currentDate,
  items,
  onItemClick,
  onDayClick,
}: PersonalMonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getItemDate = (item: AggregatedCalendarItem): Date => {
    if (item.type === 'personal_event') return new Date((item.item as PersonalEvent).start_at);
    if (item.type === 'workspace_event') return new Date((item.item as AggregatedWorkspaceEvent).start_at);
    return new Date((item.item as AggregatedWorkspaceTask).due_date);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-neutral-900 rounded-b-xl overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 py-3 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7">
        {days.map((day, i) => {
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, monthStart);
          const dayItems = items.filter((item) => isSameDay(getItemDate(item), day));

          return (
            <div
              key={day.toString()}
              onClick={() => onDayClick(day)}
              className={cn(
                'min-h-[120px] p-1.5 border-r border-b border-neutral-100 dark:border-neutral-800 relative cursor-pointer transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 group',
                !isCurrentMonth && 'bg-neutral-50/30 dark:bg-neutral-900/30',
                (i + 1) % 7 === 0 && 'border-r-0'
              )}
            >
              <div className="flex justify-between items-start mb-1 px-1">
                <span
                  className={cn(
                    'text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full',
                    !isCurrentMonth ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-700 dark:text-neutral-300',
                    isToday && 'bg-indigo-600 text-white shadow-sm'
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-1 flex flex-col max-h-[calc(100%-32px)] overflow-y-auto scrollbar-none pb-1 px-0.5">
                {dayItems.slice(0, 4).map((item) => (
                  <AggregatedEventCard
                    key={`${item.type}-${item.item.id}`}
                    item={item}
                    view="month"
                    onClick={() => onItemClick(item)}
                  />
                ))}
                {dayItems.length > 4 && (
                  <div className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 pl-1">
                    +{dayItems.length - 4} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
