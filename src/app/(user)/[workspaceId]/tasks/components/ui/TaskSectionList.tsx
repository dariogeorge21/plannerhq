"use client";

import React from "react";
import { TaskSection, Task } from "@/features/task/types";
import { TaskSectionItem } from "./TaskSectionItem";

interface TaskSectionListProps {
  sections: TaskSection[];
  tasks: Task[];
  workspaceId: string;
  userId: string;
}

export function TaskSectionList({ sections, tasks, workspaceId, userId }: TaskSectionListProps) {
  // Sort sections by sort_order
  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-4 w-full">
      {sortedSections.map((section) => (
        <TaskSectionItem 
          key={section.id} 
          section={section} 
          tasks={tasks.filter(t => t.section_id === section.id || (section.id === "uncategorized" && !t.section_id))} 
          workspaceId={workspaceId}
          userId={userId}
        />
      ))}
    </div>
  );
}
