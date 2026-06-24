'use client';

import React from 'react';
import { PersonalCalendarView } from '@/features/personal-calendar/components/PersonalCalendarView';

interface PersonalCalendarClientProps {
  userId: string;
}

export function PersonalCalendarClient({ userId }: PersonalCalendarClientProps) {
  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-[#0A0A0A] text-foreground dark:text-white">
      <main className="flex-1 overflow-hidden w-full">
        <PersonalCalendarView userId={userId} />
      </main>
    </div>
  );
}
