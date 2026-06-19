"use client";

import React from "react";
import { Task } from "@/features/task/types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  sectionId: string;
  workspaceId: string;
  userId: string;
}

export function TaskList({ tasks, sectionId, workspaceId, userId }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => a.sort_order - b.sort_order);

  if (tasks.length === 0) {
    return <div className="text-sm text-muted-foreground italic py-2 px-4">No tasks here yet.</div>;
  }

  return (
    <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col gap-2">
        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} workspaceId={workspaceId} userId={userId} />
        ))}
      </div>
    </SortableContext>
  );
}
