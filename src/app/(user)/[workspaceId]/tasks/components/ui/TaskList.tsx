"use client";

import React from "react";
import { Task } from "@/features/task/types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskItem } from "./TaskItem";
import { ListTodo } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  sectionId: string;
  workspaceId: string;
  userId: string;
}

export function TaskList({ tasks, sectionId, workspaceId, userId }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.sort_order === b.sort_order) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return a.sort_order - b.sort_order;
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center bg-muted/30 border border-dashed border-border rounded-xl m-1">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-2">
          <ListTodo className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No tasks here yet</p>
        <p className="text-xs text-muted-foreground mt-1">Add a task below to get started</p>
      </div>
    );
  }

  return (
    <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col gap-2 p-1 min-h-[50px]">
        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} workspaceId={workspaceId} userId={userId} />
        ))}
      </div>
    </SortableContext>
  );
}
