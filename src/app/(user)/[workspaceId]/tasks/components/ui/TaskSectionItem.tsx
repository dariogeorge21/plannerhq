"use client";

import React, { useState, useRef, useEffect } from "react";
import { TaskSection, Task } from "@/features/task/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, ChevronDown, ChevronRight, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteTaskSection, useUpdateTaskSection } from "@/features/task/hooks";
import { TaskList } from "./TaskList";
import { TaskCreateInput } from "./TaskCreateInput";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";

interface TaskSectionItemProps {
  section: TaskSection;
  tasks: Task[];
  workspaceId: string;
  userId: string;
}

export function TaskSectionItem({ section, tasks, workspaceId, userId }: TaskSectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(section.name);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const deleteSection = useDeleteTaskSection(workspaceId);
  const updateSection = useUpdateTaskSection(workspaceId);
  const inputRef = useRef<HTMLInputElement>(null);

  const isUncategorized = section.id === "uncategorized";

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingName]);

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
    zIndex: isDragging ? 50 : 1,
  };

  const handleRenameSubmit = () => {
    if (editName.trim() && editName !== section.name) {
      updateSection.mutate({ id: section.id, name: editName });
    } else {
      setEditName(section.name);
    }
    setIsEditingName(false);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col bg-card border border-border rounded-2xl shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between p-2 pl-1 pr-4 border-b border-border group">
        <div className="flex items-center gap-1 flex-1">
          {!isUncategorized ? (
            <div {...attributes} {...listeners} className="cursor-grab opacity-0 group-hover:opacity-100 text-muted-foreground p-1.5 hover:bg-accent hover:text-accent-foreground rounded-md transition-all">
              <GripVertical className="h-4 w-4" />
            </div>
          ) : (
            <div className="w-7" /> // Spacer to align
          )}
          
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          
          {!isUncategorized && <div className="w-2.5 h-2.5 rounded-full bg-primary ml-1 mr-2" />}
          {isUncategorized && <div className="w-2.5 h-2.5 rounded-full bg-muted ml-1 mr-2" />}

          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input 
                ref={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                className="h-7 py-1 px-2 text-sm font-bold bg-background border-border text-foreground"
              />
              <Button size="icon" variant="ghost" className="h-6 w-6 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10" onMouseDown={(e) => { e.preventDefault(); handleRenameSubmit(); }}>
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <h3 
              className={`font-bold text-foreground ${!isUncategorized ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
              onClick={() => !isUncategorized && setIsEditingName(true)}
            >
              {section.name}
            </h3>
          )}
          
          <span className="text-xs font-semibold text-muted-foreground px-2 py-0.5 bg-muted rounded-full ml-2">
            {tasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => setIsAddingTask(true)} className="h-7 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
          {!isUncategorized && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl bg-card border-border">
                <DropdownMenuItem onClick={() => setIsEditingName(true)} className="rounded-lg cursor-pointer text-foreground focus:bg-accent focus:text-accent-foreground">Rename</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg cursor-pointer">Delete section</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-muted/30 flex flex-col gap-2 rounded-b-2xl">
              <TaskList tasks={tasks} sectionId={section.id} workspaceId={workspaceId} userId={userId} />
              
              {isAddingTask ? (
                <div className="mt-2 p-1">
                  <TaskCreateInput 
                    workspaceId={workspaceId} 
                    sectionId={isUncategorized ? null : section.id} 
                    onClose={() => setIsAddingTask(false)} 
                  />
                </div>
              ) : (
                <div className="mt-1 px-1">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsAddingTask(true)} 
                    className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-background h-8"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New task
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteSection.mutate(section.id);
          setIsDeleteDialogOpen(false);
        }}
        title="Delete Section"
        description="Are you sure you want to delete this section? All tasks inside will be moved to uncategorized."
      />
    </div>
  );
}
