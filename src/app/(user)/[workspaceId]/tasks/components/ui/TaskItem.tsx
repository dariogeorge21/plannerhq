"use client";

import React from "react";
import { Task } from "@/features/task/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, CheckCircle2, Clock, CalendarDays, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { useToggleTaskCompletion, useDeleteTask, useMarkTaskReviewed, useUpdateTask, useSetDeadline } from "@/features/task/hooks";
import { motion } from "framer-motion";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { useState } from "react";
import { TaskDetailModal } from "./TaskDetailModal";
import { DeadlinePicker } from "@/components/ui/deadline-picker";
import { format, isSameDay, addDays } from "date-fns";

interface TaskItemProps {
  task: Task;
  workspaceId: string;
  userId: string;
  isKanban?: boolean;
}

export function TaskItem({ task, workspaceId, userId, isKanban = false }: TaskItemProps) {
  const toggleCompletion = useToggleTaskCompletion(workspaceId);
  const deleteTask = useDeleteTask(workspaceId);
  const updateTask = useUpdateTask(workspaceId);
  const markReviewed = useMarkTaskReviewed(workspaceId);
  const setDeadline = useSetDeadline(workspaceId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompletion.mutate({ taskId: task.id, completed: !task.completed });
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleReview = () => {
    markReviewed.mutate({ taskId: task.id, userId });
  };

  const hasReviewed = task.reviewed_by?.includes(userId);

  // Status mapping
  const statusColors = {
    todo: "bg-neutral-200 dark:bg-neutral-600",
    in_progress: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] dark:bg-blue-400",
    done: "bg-emerald-500 dark:bg-emerald-400",
    blocked: "bg-red-500 dark:bg-red-400",
    cancelled: "bg-neutral-300 dark:bg-neutral-600"
  };

  // Priority mapping
  const priorityStyles = {
    none: "",
    low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
    medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
    high: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30",
    urgent: "bg-red-500 text-white border-red-600 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30"
  };

  const priorityLabels = {
    none: "",
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent"
  };

  // Due date formatting
  const formattedDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = formattedDate && formattedDate < new Date() && !task.completed;
  
  const getDeadlineBadgeProps = () => {
    if (!formattedDate) return null;
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (isOverdue) {
      return { 
        text: `${format(formattedDate, "MMM d")} (Overdue)`,
        className: "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
        iconClass: "text-red-500 dark:text-red-400",
        showPulse: true
      };
    }
    
    if (isSameDay(formattedDate, today)) {
      return { 
        text: `Today ${format(formattedDate, "h:mm a")}`,
        className: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
        iconClass: "text-amber-500 dark:text-amber-400"
      };
    }

    if (isSameDay(formattedDate, tomorrow)) {
      return { 
        text: `Tomorrow`,
        className: "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
        iconClass: "text-yellow-500 dark:text-yellow-400"
      };
    }
    
    return {
      text: format(formattedDate, "MMM d"),
      className: "bg-muted text-muted-foreground border-border",
      iconClass: "text-muted-foreground"
    };
  };

  const deadlineProps = getDeadlineBadgeProps();

  if (isKanban) {
    return (
      <>
      <div 
        ref={setNodeRef} 
        style={style} 
        className={`group flex flex-col gap-2 p-3 bg-card border ${task.completed ? 'border-border/50 bg-muted/20 opacity-75' : 'border-border'} rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all cursor-grab active:cursor-grabbing`}
        {...attributes} 
        {...listeners}
        onClick={() => setIsDetailModalOpen(true)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <button 
              onClick={handleToggle}
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                task.completed 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-border hover:border-primary text-transparent hover:text-primary/30 bg-background'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className={`text-sm font-semibold truncate ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {task.title}
              </span>
              {task.description && (
                <span className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{task.description}</span>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-lg">Change Status</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl">
                    <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'todo' })}>Todo</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'in_progress' })}>In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'blocked' })}>Blocked</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-lg">Set Priority</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl">
                    <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'none' })}>None</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'low' })}>Low</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'medium' })}>Medium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'high' })}>High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'urgent' })}>Urgent</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 rounded-lg">Delete Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <div className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} title={task.status.replace('_', ' ')} />
          
          {task.priority !== 'none' && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${priorityStyles[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
          )}

          {deadlineProps && (
            <div className={`flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${deadlineProps.className}`}>
              {deadlineProps.showPulse && <span className="relative flex h-1.5 w-1.5 mr-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span></span>}
              {!deadlineProps.showPulse && <Clock className={`w-3 h-3 mr-1 ${deadlineProps.iconClass}`} />}
              {deadlineProps.text}
            </div>
          )}
          
          {hasReviewed && (
            <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100" title="You reviewed this">
              <Eye className="w-3 h-3 mr-1" /> Reviewed
            </div>
          )}
        </div>
      </div>
      
      <ConfirmDeleteModal 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteTask.mutate(task.id);
          setIsDeleteDialogOpen(false);
        }}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
      <TaskDetailModal 
        task={task} 
        workspaceId={workspaceId} 
        userId={userId} 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
      />
      </>
    );
  }

  // List View
  return (
    <>
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group flex items-center gap-3 p-2.5 bg-card border ${task.completed ? 'border-border/50 bg-muted/20 opacity-75' : 'border-border'} rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer`}
      onClick={() => setIsDetailModalOpen(true)}
    >
      <div {...attributes} {...listeners} className="cursor-grab opacity-0 group-hover:opacity-100 text-muted-foreground p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-all flex-shrink-0" onClick={e => e.stopPropagation()}>
        <GripVertical className="h-4 w-4" />
      </div>
      
      <button 
        onClick={handleToggle}
        className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
          task.completed 
            ? 'bg-primary border-primary text-primary-foreground' 
            : 'border-border hover:border-primary text-transparent hover:text-primary/30'
        }`}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
      </button>
      
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[task.status]}`} title={task.status.replace('_', ' ')} />

      <div className={`flex-1 min-w-0 flex items-center gap-2 ${task.completed ? 'opacity-60' : ''}`}>
        <span className={`text-sm font-semibold truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {task.priority !== 'none' && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityStyles[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
        )}

        {deadlineProps ? (
          <div className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-md border ${deadlineProps.className}`}>
            {deadlineProps.showPulse && <span className="relative flex h-1.5 w-1.5 mr-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span></span>}
            {!deadlineProps.showPulse && <Clock className={`w-3.5 h-3.5 mr-1.5 ${deadlineProps.iconClass}`} />}
            {deadlineProps.text}
          </div>
        ) : (
          <div onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DeadlinePicker 
              value={task.due_date} 
              onChange={(date) => setDeadline.mutate({ taskId: task.id, due_date: date })} 
              trigger={<Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"><CalendarDays className="h-4 w-4" /></Button>}
            />
          </div>
        )}

        {hasReviewed ? (
          <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/20 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-500/30" title="You reviewed this">
            <Eye className="w-3 h-3 mr-1" /> Reviewed
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary" onClick={handleReview}>
            Review
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-lg">Change Status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="rounded-xl">
                  <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'todo' })}>Todo</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'in_progress' })}>In Progress</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, status: 'blocked' })}>Blocked</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-lg">Set Priority</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="rounded-xl">
                  <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'none' })}>None</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'low' })}>Low</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'medium' })}>Medium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'high' })}>High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, priority: 'urgent' })}>Urgent</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 rounded-lg">Delete Task</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <ConfirmDeleteModal 
      isOpen={isDeleteDialogOpen}
      onClose={() => setIsDeleteDialogOpen(false)}
      onConfirm={() => {
        deleteTask.mutate(task.id);
        setIsDeleteDialogOpen(false);
      }}
      title="Delete Task"
      description="Are you sure you want to delete this task? This action cannot be undone."
    />
    <TaskDetailModal 
      task={task} 
      workspaceId={workspaceId} 
      userId={userId} 
      isOpen={isDetailModalOpen} 
      onClose={() => setIsDetailModalOpen(false)} 
    />
    </>
  );
}
