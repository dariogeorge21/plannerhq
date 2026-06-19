"use client";

import React, { useState, useMemo } from "react";
import { Task, TaskSection, TaskAssignee } from "@/features/task/types";
import { 
  useTaskSections, 
  useTasks, 
  useReorderTaskSections, 
  useReorderTasks,
  useCreateTaskSection,
} from "@/features/task/hooks";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { TaskSectionList } from "./components/ui/TaskSectionList";
import { KanbanBoard } from "./components/ui/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Sparkles, LayoutList, LayoutGrid, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      // Check if active is a section
      const activeSection = sections.find((s) => s.id === active.id);
      
      if (activeSection) {
        // Reordering sections
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newSections = arrayMove(sections, oldIndex, newIndex);
          const updates = newSections.map((s, idx) => ({ id: s.id, sort_order: idx * 1024 }));
          reorderSections.mutate(updates);
        }
      } else {
        // Reordering tasks
        const activeTask = tasks.find(t => t.id === active.id);
        const overTask = tasks.find(t => t.id === over.id);
        const overSection = sections.find(s => s.id === over.id); // For dropping on empty columns

        if (activeTask) {
          const targetSectionId = overSection ? overSection.id : (overTask ? overTask.section_id : activeTask.section_id);
          
          if (activeTask.section_id === targetSectionId) {
            // Reordering within the same section
            const sectionTasks = tasks.filter(t => t.section_id === activeTask.section_id).sort((a,b) => a.sort_order - b.sort_order);
            const oldIndex = sectionTasks.findIndex((t) => t.id === active.id);
            const newIndex = overTask ? sectionTasks.findIndex((t) => t.id === over.id) : sectionTasks.length;
            
            if (oldIndex !== -1 && newIndex !== -1) {
              const newTasks = arrayMove(sectionTasks, oldIndex, newIndex);
              const updates = newTasks.map((t, idx) => ({ id: t.id, sort_order: idx * 1024, sectionId: t.section_id }));
              reorderTasks.mutate(updates);
            }
          } else {
            // Cross-section drag (simplified logic: move to the end of the target section)
            const updates = [{ id: activeTask.id, sort_order: 99999, sectionId: targetSectionId }];
            reorderTasks.mutate(updates);
          }
        }
      }
    }
  };

  const handleCreateSection = () => {
    if (newSectionName.trim()) {
      createSection.mutate(newSectionName);
      setNewSectionName("");
      setIsCreateModalOpen(false);
    }
  };

  // Filter tasks based on search
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [tasks, searchQuery]);

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-6 lg:p-10 min-h-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase border border-indigo-100/50">
              <Sparkles className="w-3.5 h-3.5" /> Task Board
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
              Tasks
            </h1>
            <p className="text-base text-neutral-500 font-medium">
              Manage your project tasks, priorities, and deadlines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-neutral-200/60 rounded-xl p-1 shadow-sm flex items-center">
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className={`h-8 px-3 rounded-lg ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-neutral-500'}`}
              >
                <LayoutList className="w-4 h-4 mr-1.5" /> List
              </Button>
              <Button 
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('kanban')}
                className={`h-8 px-3 rounded-lg ${viewMode === 'kanban' ? 'bg-indigo-50 text-indigo-700' : 'text-neutral-500'}`}
              >
                <LayoutGrid className="w-4 h-4 mr-1.5" /> Board
              </Button>
            </div>
            <Button onClick={handleCreateSection} className="h-10 rounded-xl shadow-md bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <Card className="border-neutral-200/60 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Tasks</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-extrabold text-neutral-900">{totalTasks}</div>
            </CardContent>
          </Card>
          
          <Card className="border-neutral-200/60 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">In Progress</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-extrabold text-neutral-900">{inProgressTasks}</div>
            </CardContent>
          </Card>
          
          <Card className="border-neutral-200/60 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">Completed</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-extrabold text-neutral-900">{completedTasks}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl border-neutral-200/60 bg-white"
            />
          </div>
          <Button variant="outline" className="h-10 rounded-xl border-neutral-200/60 bg-white text-neutral-600">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        {/* Board Content */}
        <div className="flex-1 min-h-[500px]">
          {viewMode === 'list' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <TaskSectionList 
                  sections={sections} 
                  tasks={filteredTasks} 
                  workspaceId={workspaceId} 
                  userId={userId} 
                />
              </SortableContext>
              
              {/* Uncategorized tasks */}
              {filteredTasks.filter(t => !t.section_id).length > 0 && (
                <div className="mt-4">
                  <SortableContext items={filteredTasks.filter(t => !t.section_id).map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <TaskSectionList 
                      sections={[{ id: "uncategorized", name: "No Section", workspace_id: workspaceId, sort_order: 999, created_by: "", created_at: "", updated_at: "" }]} 
                      tasks={filteredTasks.filter(t => !t.section_id)} 
                      workspaceId={workspaceId} 
                      userId={userId} 
                    />
                  </SortableContext>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
              <KanbanBoard 
                sections={sections} 
                tasks={filteredTasks} 
                workspaceId={workspaceId} 
                userId={userId} 
              />
            </motion.div>
          )}
        </div>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
            <DialogDescription>Enter a name for your new task section.</DialogDescription>
          </DialogHeader>
          <Input 
            value={newSectionName} 
            onChange={(e) => setNewSectionName(e.target.value)} 
            placeholder="Section Name" 
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateSection() }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSection} disabled={!newSectionName.trim()}>Create Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
