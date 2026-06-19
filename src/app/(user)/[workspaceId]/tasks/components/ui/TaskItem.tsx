"use client";

import React, { useState } from "react";
import { Task } from "@/features/task/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToggleTaskCompletion, useDeleteTask, useMarkTaskReviewed } from "@/features/task/hooks";

interface TaskItemProps {
  task: Task;
  workspaceId: string;
  userId: string;
}

export function TaskItem({ task, workspaceId, userId }: TaskItemProps) {
  const toggleCompletion = useToggleTaskCompletion(workspaceId);
  const deleteTask = useDeleteTask(workspaceId);
  const markReviewed = useMarkTaskReviewed(workspaceId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggle = (checked: boolean) => {
    toggleCompletion.mutate({ taskId: task.id, completed: checked });
  };

  const handleDelete = () => {
    if (confirm("Delete this task?")) {
      deleteTask.mutate(task.id);
    }
  };

  const handleReview = () => {
    markReviewed.mutate({ taskId: task.id, userId });
  };

  const hasReviewed = task.reviewed_by?.includes(userId);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-3 p-2 bg-background border rounded-md shadow-sm group hover:border-border/80 transition-colors"
    >
      <div {...attributes} {...listeners} className="cursor-grab opacity-0 group-hover:opacity-100 text-muted-foreground flex-shrink-0">
        <GripVertical className="h-4 w-4" />
      </div>
      
      <Checkbox 
        checked={task.completed} 
        onCheckedChange={handleToggle}
        className="flex-shrink-0"
      />
      
      <div className={`flex-1 min-w-0 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
        <p className="text-sm font-medium truncate">{task.title}</p>
        {task.description && (
          <p className="text-xs text-muted-foreground truncate">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {hasReviewed ? (
          <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full" title="You reviewed this">
            <Eye className="h-3 w-3 mr-1" /> Reviewed
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 text-xs opacity-0 group-hover:opacity-100" onClick={handleReview}>
            Mark Reviewed
          </Button>
        )}

        {task.priority !== 'none' && (
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
            {task.priority}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">Delete Task</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
