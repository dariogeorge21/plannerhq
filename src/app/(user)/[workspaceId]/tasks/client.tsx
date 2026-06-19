"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskSection, TaskAssignee } from "@/features/task/types";
import { 
  useTaskSections, 
  useTasks, 
  useReorderTaskSections, 
  useReorderTasks,
  useCreateTaskSection,
  useCreateTask
} from "@/features/task/hooks";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { TaskSectionList } from "./components/ui/TaskSectionList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TasksClientProps {
  workspaceId: string;
  initialSections: TaskSection[];
  initialTasks: Task[];
  initialAssignees: TaskAssignee[];
  userId: string;
}

export function TasksClient({ workspaceId, initialSections, initialTasks, initialAssignees, userId }: TasksClientProps) {
  const { data: sections = initialSections } = useTaskSections(workspaceId);
  const { data: tasks = initialTasks } = useTasks(workspaceId);

  const reorderSections = useReorderTaskSections(workspaceId);
  const reorderTasks = useReorderTasks(workspaceId);
  const createSection = useCreateTaskSection(workspaceId);
  const createTask = useCreateTask(workspaceId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      // Determine if dragging section or task
      const isSection = sections.some((s) => s.id === active.id);
      if (isSection) {
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        
        const newSections = arrayMove(sections, oldIndex, newIndex);
        const updates = newSections.map((s, idx) => ({ id: s.id, sort_order: idx }));
        reorderSections.mutate(updates);
      } else {
        // Dragging a task (basic single-list reordering for now, ignoring cross-section in this simple handler)
        // Cross-section drag requires a more complex handler with active.data.current.sortable.containerId
        const activeTask = tasks.find(t => t.id === active.id);
        const overTask = tasks.find(t => t.id === over.id);
        if (activeTask && overTask && activeTask.section_id === overTask.section_id) {
          const sectionTasks = tasks.filter(t => t.section_id === activeTask.section_id).sort((a,b) => a.sort_order - b.sort_order);
          const oldIndex = sectionTasks.findIndex((t) => t.id === active.id);
          const newIndex = sectionTasks.findIndex((t) => t.id === over.id);
          
          const newTasks = arrayMove(sectionTasks, oldIndex, newIndex);
          const updates = newTasks.map((t, idx) => ({ id: t.id, sort_order: idx, sectionId: t.section_id }));
          reorderTasks.mutate(updates);
        }
      }
    }
  };

  const handleCreateSection = () => {
    const name = prompt("Section name:");
    if (name) createSection.mutate(name);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Board</h2>
          <Button onClick={handleCreateSection} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
        
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <TaskSectionList 
            sections={sections} 
            tasks={tasks} 
            workspaceId={workspaceId} 
            userId={userId} 
          />
        </SortableContext>
        
        {/* Uncategorized tasks */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Uncategorized</h3>
          <SortableContext items={tasks.filter(t => !t.section_id).map(t => t.id)} strategy={verticalListSortingStrategy}>
            <TaskSectionList 
              sections={[{ id: "uncategorized", name: "No Section", workspace_id: workspaceId, sort_order: 999, created_by: "", created_at: "", updated_at: "" }]} 
              tasks={tasks.filter(t => !t.section_id)} 
              workspaceId={workspaceId} 
              userId={userId} 
            />
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
}
