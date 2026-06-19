"use client";

import React, { useMemo } from "react";
import { Task, TaskSection } from "@/features/task/types";
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskItem } from "./TaskItem";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCreateInput } from "./TaskCreateInput";

interface KanbanBoardProps {
  sections: TaskSection[];
  tasks: Task[];
  workspaceId: string;
  userId: string;
}

function KanbanColumn({ 
  section, 
  tasks, 
  workspaceId, 
  userId 
}: { 
  section: TaskSection, 
  tasks: Task[], 
  workspaceId: string, 
  userId: string 
}) {
  const [isAddingTask, setIsAddingTask] = React.useState(false);
  
  const isUncategorized = section.id === "uncategorized";
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id, disabled: isUncategorized, data: { type: "Section", section } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex flex-col flex-shrink-0 w-80 max-h-full bg-neutral-100/50 rounded-2xl border border-neutral-200/60 shadow-sm"
    >
      <div className="p-3 border-b border-neutral-200/60 flex items-center justify-between group bg-white/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          {!isUncategorized && (
            <div {...attributes} {...listeners} className="cursor-grab opacity-0 group-hover:opacity-100 text-neutral-400">
              <GripHorizontal className="w-4 h-4" />
            </div>
          )}
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <h3 className="font-bold text-sm text-neutral-900">{section.name}</h3>
          <span className="text-xs font-semibold text-neutral-500 bg-neutral-200/50 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-indigo-600" onClick={() => setIsAddingTask(true)}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[150px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} workspaceId={workspaceId} userId={userId} isKanban />
          ))}
        </SortableContext>
        
        {isAddingTask ? (
          <div className="bg-white p-2 rounded-xl border border-indigo-200 shadow-sm">
            <TaskCreateInput 
              workspaceId={workspaceId} 
              sectionId={isUncategorized ? null : section.id} 
              onClose={() => setIsAddingTask(false)} 
            />
          </div>
        ) : (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-neutral-500 hover:text-indigo-600 hover:bg-white/60 h-9"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </Button>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ sections, tasks, workspaceId, userId }: KanbanBoardProps) {
  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.sort_order - b.sort_order), [sections]);
  
  const uncategorizedTasks = tasks.filter(t => !t.section_id);
  const uncategorizedSection = { 
    id: "uncategorized", 
    name: "No Section", 
    workspace_id: workspaceId, 
    sort_order: 999, 
    created_by: "", 
    created_at: "", 
    updated_at: "" 
  };

  return (
    <div className="flex items-start gap-4 overflow-x-auto pb-6 pt-2 h-full items-stretch">
      <SortableContext items={sortedSections.map(s => s.id)} strategy={horizontalListSortingStrategy}>
        {sortedSections.map(section => (
          <KanbanColumn 
            key={section.id} 
            section={section} 
            tasks={tasks.filter(t => t.section_id === section.id).sort((a,b) => a.sort_order - b.sort_order)} 
            workspaceId={workspaceId} 
            userId={userId} 
          />
        ))}
      </SortableContext>
      
      {(uncategorizedTasks.length > 0 || sortedSections.length === 0) && (
        <KanbanColumn 
          section={uncategorizedSection} 
          tasks={uncategorizedTasks.sort((a,b) => a.sort_order - b.sort_order)} 
          workspaceId={workspaceId} 
          userId={userId} 
        />
      )}
    </div>
  );
}
