'use client';

import React, { useState, useMemo } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
  format,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft, ChevronRight, Plus, CalendarDays,
  Building2, User, CheckSquare, Layers,
  RefreshCw, ArrowLeft, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AggregatedCalendarItem,
  AggregatedWorkspaceEvent,
  AggregatedWorkspaceTask,
  PersonalEvent,
  WorkspaceInfo,
} from '../types';
import {
  usePersonalCalendarData,
  useUserWorkspaces,
  useCreatePersonalEvent,
  useUpdatePersonalEvent,
} from '../hooks';
import { PersonalMonthView } from './PersonalMonthView';
import { PersonalWeekView } from './PersonalWeekView';
import { PersonalDayView } from './PersonalDayView';
import { CreatePersonalEventModal } from './modals/CreatePersonalEventModal';
import { EditPersonalEventModal } from './modals/EditPersonalEventModal';
import { PersonalEventDetailModal } from './modals/PersonalEventDetailModal';
import { WorkspaceItemReadonlyModal } from './modals/WorkspaceItemReadonlyModal';

interface PersonalCalendarViewProps {
  userId: string;
}

type ViewMode = 'month' | 'week' | 'day';

export function PersonalCalendarView({ userId }: PersonalCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<ViewMode>('month');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isNavigatingToDashboard, setIsNavigatingToDashboard] = useState(false);
  const pathname = usePathname();

  // Compute date range
  const dateRange = useMemo(() => {
    if (activeView === 'month') {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      return { start: start.toISOString(), end: end.toISOString() };
    } else if (activeView === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return { start: start.toISOString(), end: end.toISOString() };
    } else {
      const start = new Date(currentDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(currentDate);
      end.setHours(23, 59, 59, 999);
      return { start: start.toISOString(), end: end.toISOString() };
    }
  }, [currentDate, activeView]);

  // Data
  const { data: workspaces = [], isLoading: wsLoading } = useUserWorkspaces(userId);
  const {
    data: items = [],
    isLoading: itemsLoading,
    refetch,
  } = usePersonalCalendarData(userId, workspaces, dateRange);

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDate, setCreateDate] = useState<Date | undefined>(undefined);

  const [selectedPersonalEvent, setSelectedPersonalEvent] = useState<PersonalEvent | null>(null);
  const [isPersonalDetailOpen, setIsPersonalDetailOpen] = useState(false);
  const [isPersonalEditOpen, setIsPersonalEditOpen] = useState(false);

  const [selectedWorkspaceItem, setSelectedWorkspaceItem] = useState<
    { kind: 'event'; item: AggregatedWorkspaceEvent } | { kind: 'task'; item: AggregatedWorkspaceTask } | null
  >(null);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Navigation
  const handlePrev = () => {
    setIsNavigating(true);
    if (activeView === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (activeView === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    setIsNavigating(true);
    if (activeView === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (activeView === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const getLabel = () => {
    if (activeView === 'month') return format(currentDate, 'MMMM yyyy');
    if (activeView === 'week') return format(currentDate, 'MMM yyyy');
    return format(currentDate, 'MMMM d, yyyy');
  };

  // Handlers
  const handleDayClick = (date: Date, hour?: number) => {
    const d = new Date(date);
    d.setHours(hour ?? 9, 0, 0, 0);
    setCreateDate(d);
    setIsCreateOpen(true);
  };

  const handleItemClick = (item: AggregatedCalendarItem) => {
    if (item.type === 'personal_event') {
      setSelectedPersonalEvent(item.item as PersonalEvent);
      setIsPersonalDetailOpen(true);
    } else if (item.type === 'workspace_event') {
      setSelectedWorkspaceItem({ kind: 'event', item: item.item as AggregatedWorkspaceEvent });
      setIsWorkspaceModalOpen(true);
    } else {
      setSelectedWorkspaceItem({ kind: 'task', item: item.item as AggregatedWorkspaceTask });
      setIsWorkspaceModalOpen(true);
    }
  };

  // Counts for legend
  const personalCount = items.filter((i) => i.type === 'personal_event').length;
  const wsEventCount = items.filter((i) => i.type === 'workspace_event').length;
  const wsTaskCount = items.filter((i) => i.type === 'workspace_task').length;

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-[#0A0A0A] p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-10 px-3 rounded-xl"
                onClick={() => setIsNavigatingToDashboard(true)}
              >
                <Link href="/dashboard">
                  {isNavigatingToDashboard ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  )}
                  Back to dashboard
                </Link>
              </Button>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Personal Calendar</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {wsLoading ? 'Loading workspaces…' : (
                    <>Your events &amp; {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''} merged</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Workspace source pills */}
          {workspaces.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {workspaces.map((ws) => (
                <span
                  key={ws.id}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${ws.color}14`,
                    borderColor: `${ws.color}35`,
                    color: ws.color,
                  }}
                >
                  <Building2 className="w-3 h-3" />
                  {ws.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200/60 dark:border-neutral-800 flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-neutral-100 dark:border-neutral-800 px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight min-w-[150px]">{getLabel()}</h2>
            <div className="flex items-center bg-neutral-100/80 dark:bg-neutral-800 rounded-lg p-0.5 border border-neutral-200/50 dark:border-neutral-700 shadow-sm">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 rounded-md" onClick={handlePrev}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="h-8 px-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 rounded-md" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 rounded-md" onClick={handleNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200"
              onClick={() => refetch()}
              title="Refresh"
            >
              <RefreshCw className={cn('w-4 h-4', itemsLoading && 'animate-spin')} />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* View switcher */}
            <div className="flex p-1 bg-neutral-100/80 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700 rounded-xl shadow-sm w-full sm:w-auto">
              {(['month', 'week', 'day'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition-all capitalize ${activeView === view
                    ? 'bg-white dark:bg-neutral-700 text-indigo-700 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                    }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* New event button */}
            <Button
              onClick={() => {
                const d = new Date(currentDate);
                d.setHours(9, 0, 0, 0);
                setCreateDate(d);
                setIsCreateOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm h-10 px-4"
            >
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">New Event</span>
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 min-h-0 relative">
          {itemsLoading && (
            <div className="absolute inset-0 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm z-30 flex items-center justify-center rounded-b-2xl">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                Loading calendar…
              </div>
            </div>
          )}

          {activeView === 'month' && (
            <PersonalMonthView
              currentDate={currentDate}
              items={items}
              onItemClick={handleItemClick}
              onDayClick={handleDayClick}
            />
          )}
          {activeView === 'week' && (
            <PersonalWeekView
              currentDate={currentDate}
              items={items}
              onItemClick={handleItemClick}
              onDayClick={handleDayClick}
            />
          )}
          {activeView === 'day' && (
            <PersonalDayView
              currentDate={currentDate}
              items={items}
              onItemClick={handleItemClick}
              onDayClick={handleDayClick}
            />
          )}
        </div>

        {/* Legend strip */}
        <div className="flex items-center gap-6 px-6 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 rounded-b-2xl">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm" />
            <span>Personal Events ({personalCount})</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Building2 className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
            <span>Workspace Events ({wsEventCount})</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <CheckSquare className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
            <span>Tasks ({wsTaskCount})</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePersonalEventModal
        userId={userId}
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setCreateDate(undefined); }}
        defaultDate={createDate}
      />

      {selectedPersonalEvent && (
        <PersonalEventDetailModal
          userId={userId}
          event={selectedPersonalEvent}
          isOpen={isPersonalDetailOpen}
          onClose={() => setIsPersonalDetailOpen(false)}
          onEditClick={() => { setIsPersonalDetailOpen(false); setIsPersonalEditOpen(true); }}
        />
      )}

      {selectedPersonalEvent && (
        <EditPersonalEventModal
          userId={userId}
          event={selectedPersonalEvent}
          isOpen={isPersonalEditOpen}
          onClose={() => setIsPersonalEditOpen(false)}
        />
      )}

      {selectedWorkspaceItem && (
        <WorkspaceItemReadonlyModal
          data={selectedWorkspaceItem}
          isOpen={isWorkspaceModalOpen}
          onClose={() => setIsWorkspaceModalOpen(false)}
        />
      )}
    </div>
  );
}
