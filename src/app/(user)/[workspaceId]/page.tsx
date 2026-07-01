"use client";

import React, { use } from "react";
import { NavigationMatrix } from "./components/dashboard/NavigationMatrix";
import { WelcomeHero } from "./components/dashboard/WelcomeHero";
import { MembersWidget } from "./components/dashboard/MembersWidget";
import { TasksWidget } from "./components/dashboard/TasksWidget";
import { NotesPresenceWidget } from "./components/dashboard/NotesPresenceWidget";
import { CalendarWidget } from "./components/dashboard/CalendarWidget";
import { FilesWidget } from "./components/dashboard/FilesWidget";

export default function WorkspacePage({
  params: paramsPromise,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const params = use(paramsPromise);
  const workspaceId = params.workspaceId;

  return (
    <div className="max-w-9xl mx-auto p-6 xl:p-8 space-y-8 min-h-screen pb-20">
      <WelcomeHero workspaceId={workspaceId} />

      <NavigationMatrix workspaceId={workspaceId} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            <TasksWidget workspaceId={workspaceId} />
            <MembersWidget workspaceId={workspaceId} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NotesPresenceWidget workspaceId={workspaceId} />
            <FilesWidget workspaceId={workspaceId} />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8 flex flex-col">
          <div className="flex-1">
            <CalendarWidget workspaceId={workspaceId} />
          </div>
        </div>
      </div>
    </div>
  );
}