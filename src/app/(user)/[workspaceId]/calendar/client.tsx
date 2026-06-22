"use client";

import React from "react";
import { CalendarView } from "@/features/calendar/components/ui/CalendarView";

interface CalendarPageClientProps {
  workspaceId: string;
}

export function CalendarPageClient({ workspaceId }: CalendarPageClientProps) {
  return <CalendarView workspaceId={workspaceId} />;
}
