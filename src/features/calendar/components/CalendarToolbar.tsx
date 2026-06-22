
"use client";

import React from "react";
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarToolbarProps {
  currentDate: Date;
  activeView: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  onDateChange: (date: Date) => void;
  onCreateClick: () => void;
}

export function CalendarToolbar({
  currentDate,
  activeView,
  onViewChange,
  onDateChange,
  onCreateClick
}: CalendarToolbarProps) {
  
  const handlePrev = () => {
    if (activeView === 'month') onDateChange(subMonths(currentDate, 1));
    else if (activeView === 'week') onDateChange(subWeeks(currentDate, 1));
    else onDateChange(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (activeView === 'month') onDateChange(addMonths(currentDate, 1));
    else if (activeView === 'week') onDateChange(addWeeks(currentDate, 1));
    else onDateChange(addDays(currentDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getLabel = () => {
    if (activeView === 'month') {
      return format(currentDate, "MMMM yyyy");
    } else if (activeView === 'week') {
      // Simple label for week
      return `${format(currentDate, "MMM yyyy")}`; 
    } else {
      return format(currentDate, "MMMM d, yyyy");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-neutral-200/60 bg-white px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight min-w-[150px]">
          {getLabel()}
        </h2>
        
        <div className="flex items-center bg-neutral-100/80 rounded-lg p-0.5 border border-neutral-200/50 shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-neutral-600 hover:bg-white rounded-md" 
            onClick={handlePrev}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            className="h-8 px-3 text-xs font-semibold text-neutral-600 hover:bg-white rounded-md" 
            onClick={handleToday}
          >
            Today
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-neutral-600 hover:bg-white rounded-md" 
            onClick={handleNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex p-1 bg-neutral-100/80 border border-neutral-200/50 rounded-xl shadow-sm w-full sm:w-auto">
          {(['month', 'week', 'day'] as const).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition-all capitalize ${
                activeView === view 
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" 
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50"
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        <Button 
          onClick={onCreateClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm h-10 px-4"
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">New Event</span>
        </Button>
      </div>
    </div>
  );
}
