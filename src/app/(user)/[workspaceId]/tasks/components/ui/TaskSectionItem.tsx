"use client";

import React, { useState } from "react";
import { TaskSection, Task } from "@/features/task/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteTaskSection, useUpdateTaskSection } from "@/features/task/hooks";
import { TaskList } from "./TaskList";
import { TaskCreateInput } from "./TaskCreateInput";

interface TaskSectionItemProps {
  section: TaskSection;
  tasks: Task[];
  workspaceId: string;
  userId: string;
}

export function TaskSectionItem({ section, tasks, workspaceId, userId }: TaskSectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const deleteSection = useDeleteTaskSection(workspaceId);
  const updateSection = useUpdateTaskSection(workspaceId);

  const isUncategorized = section.id === "uncategorized";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id, disabled: isUncategorized });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleRename = () => {
    const newName = prompt("Rename section:", section.name);
    if (newName && newName !== section.name) {
      updateSection.mutate({ id: section.id, name: newName });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this section? All tasks inside will be moved to uncategorized.")) {
      deleteSection.mutate(section.id);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-3 border-b group">
        <div className="flex items-center gap-2 flex-1">
          {!isUncategorized && (
            <div {...attributes} {...listeners} className="cursor-grab opacity-0 group-hover:opacity-100 text-muted-foreground">
              <GripVertical className="h-4 w-4" />
            </div>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <h3 className="font-semibold">{section.name}</h3>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsAddingTask(true)} className="h-8">
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
          {!isUncategorized && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRename}>Rename</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 bg-muted/20 flex flex-col gap-2">
          <TaskList tasks={tasks} sectionId={section.id} workspaceId={workspaceId} userId={userId} />
          {isAddingTask && (
            <TaskCreateInput 
              workspaceId={workspaceId} 
              sectionId={isUncategorized ? null : section.id} 
              onClose={() => setIsAddingTask(false)} 
            />
          )}
        </div>
      )}
    </div>
  );
}
