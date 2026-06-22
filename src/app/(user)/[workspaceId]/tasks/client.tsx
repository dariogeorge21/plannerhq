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
import { Plus, Search, Filter, Sparkles, LayoutList, LayoutGrid, CheckCircle2, Clock, ListTodo, AlertCircle, X, Flag, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterDeadline, setFilterDeadline] = useState<string>("all");
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [dismissedBanner, setDismissedBanner] = useState(false);

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

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      // Search
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      // Status
      if (filterStatus !== "all" && t.status !== filterStatus) return false;

      // Priority
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;

      // Deadline
      if (filterDeadline !== "all") {
        const d = t.due_date ? new Date(t.due_date) : null;
        const now = new Date();
        const today = new Date(now.setHours(0,0,0,0));
        
        if (filterDeadline === "overdue") {
          if (!d || d >= today || t.completed) return false;
        } else if (filterDeadline === "today") {
          if (!d || d.toDateString() !== today.toDateString()) return false;
        } else if (filterDeadline === "none") {
          if (d) return false;
        }
      }

      return true;
    });
  }, [tasks, searchQuery, filterStatus, filterPriority, filterDeadline]);

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && !t.completed).length;
  
  const hasActiveFilters = filterStatus !== "all" || filterPriority !== "all" || filterDeadline !== "all";
  
  const clearFilters = () => {
    setFilterStatus("all");
    setFilterPriority("all");
    setFilterDeadline("all");
    setSearchQuery("");
  };

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
            <Button onClick={() => setIsCreateModalOpen(true)} className="h-10 rounded-xl shadow-md bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {overdueTasks > 0 && !dismissedBanner && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-2xl"
            >
              <div className="bg-red-50 border border-red-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </div>
                  <p className="text-sm font-medium text-red-800">
                    You have <span className="font-bold">{overdueTasks} overdue</span> task{overdueTasks > 1 ? 's' : ''}.
                  </p>
                  <Button variant="link" size="sm" className="h-auto p-0 text-red-600 hover:text-red-700 font-semibold" onClick={() => setFilterDeadline('overdue')}>
                    View Overdue
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-100" onClick={() => setDismissedBanner(true)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card border-white/20 shadow-sm rounded-3xl h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Tasks</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <ListTodo className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-5">
                <div className="text-3xl font-extrabold text-neutral-900">{totalTasks}</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card border-white/20 shadow-sm rounded-3xl h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">In Progress</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-5">
                <div className="text-3xl font-extrabold text-neutral-900">{inProgressTasks}</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card border-white/20 shadow-sm rounded-3xl h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">Completed</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-5">
                <div className="text-3xl font-extrabold text-neutral-900">{completedTasks}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card border-white/20 shadow-sm rounded-3xl h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertCircle className="w-16 h-16 text-red-600" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6 relative z-10">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-500">Overdue</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-extrabold text-neutral-900">{overdueTasks}</div>
                  {overdueTasks > 0 && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row gap-3 items-start xl:items-center w-full bg-white/50 p-2 rounded-2xl border border-neutral-200/60 shadow-sm backdrop-blur-sm">
          <div className="relative w-full xl:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl border-neutral-200/60 bg-white"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-10 rounded-xl border-neutral-200/60 bg-white w-[140px]">
                <div className="flex items-center gap-2 text-neutral-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="h-10 rounded-xl border-neutral-200/60 bg-white w-[140px]">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Flag className="w-4 h-4" />
                  <SelectValue placeholder="Priority" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDeadline} onValueChange={setFilterDeadline}>
              <SelectTrigger className="h-10 rounded-xl border-neutral-200/60 bg-white w-[140px]">
                <div className="flex items-center gap-2 text-neutral-600">
                  <CalendarDays className="w-4 h-4" />
                  <SelectValue placeholder="Deadline" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Deadlines</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="none">No Deadline</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="h-10 rounded-xl text-neutral-500 hover:text-neutral-900 ml-auto">
                Clear filters <X className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
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
