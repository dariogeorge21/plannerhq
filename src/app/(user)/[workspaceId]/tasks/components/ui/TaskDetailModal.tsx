"use client";

import React, { useState, useEffect } from "react";
import { Task } from "@/features/task/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useUpdateTask,
  useSetDeadline,
  useTaskAssignees,
  useAssignUser,
  useUnassignUser
} from "@/features/task/hooks";
import { useWorkspaceMembers } from "@/features/workspace/hooks";
import TaskAttachment from "../../../files/components/TaskAttachment";
import { DeadlinePicker } from "@/components/ui/deadline-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlignLeft,
  CheckCircle2,
  Circle,
  UserPlus,
  X,
  Flag,
  AlertCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface TaskDetailModalProps {
  task: Task | null;
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function TaskDetailModal({ task, workspaceId, isOpen, onClose, userId }: TaskDetailModalProps) {
  const updateTask = useUpdateTask(workspaceId);
  const setDeadline = useSetDeadline(workspaceId);
  const { data: members = [] } = useWorkspaceMembers();
  const { data: allAssignees = [] } = useTaskAssignees(workspaceId);
  const assignUser = useAssignUser(workspaceId);
  const unassignUser = useUnassignUser(workspaceId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  if (!task) return null;

  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) {
      updateTask.mutate({ id: task.id, title: title.trim() });
    } else {
      setTitle(task.title);
    }
  };

  const handleDescBlur = () => {
    if (description !== (task.description || "")) {
      updateTask.mutate({ id: task.id, description });
    }
  };

  const assignees = allAssignees.filter(a => a.task_id === task.id);
  const assigneeUserIds = assignees.map(a => a.user_id);

  const handleAssign = (memberId: string) => {
    assignUser.mutate({ task_id: task.id, user_id: memberId });
  };

  const handleUnassign = (memberId: string) => {
    unassignUser.mutate({ task_id: task.id, user_id: memberId });
  };

  const priorityColors: Record<string, string> = {
    none: "text-neutral-500",
    low: "text-blue-500",
    medium: "text-amber-500",
    high: "text-orange-500",
    urgent: "text-red-500"
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:w-[450px] sm:max-w-md p-0 gap-0 overflow-y-auto bg-white/95 backdrop-blur-xl border-l border-neutral-200/60 shadow-2xl">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b border-neutral-100 bg-white/50 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full border ${task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-neutral-300 text-neutral-400 hover:text-indigo-500 hover:border-indigo-500'}`}
                onClick={() => updateTask.mutate({ id: task.id, completed: !task.completed, status: !task.completed ? 'done' : 'todo' })}
              >
                {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </Button>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="text-lg font-bold border-0 bg-transparent px-0 focus-visible:ring-0 shadow-none"
              />
            </div>
          </SheetHeader>

          <div className="p-6 flex flex-col gap-8 flex-1">
            {/* Properties Grid */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center text-sm">
              <div className="text-neutral-500 font-medium">Status</div>
              <div>
                <Select value={task.status} onValueChange={(val) => updateTask.mutate({ id: task.id, status: val as any })}>
                  <SelectTrigger className="h-8 w-fit bg-neutral-50 border-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-neutral-500 font-medium">Priority</div>
              <div>
                <Select value={task.priority} onValueChange={(val) => updateTask.mutate({ id: task.id, priority: val as any })}>
                  <SelectTrigger className="h-8 w-fit bg-neutral-50 border-neutral-200 capitalize">
                    <div className="flex items-center gap-2">
                      <Flag className={`w-3.5 h-3.5 ${priorityColors[task.priority]}`} />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-neutral-500 font-medium">Deadline</div>
              <div>
                <DeadlinePicker
                  value={task.due_date}
                  onChange={(date) => setDeadline.mutate({ taskId: task.id, due_date: date })}
                />
              </div>

              <div className="text-neutral-500 font-medium self-start mt-1.5">Assignees</div>
              <div className="flex flex-wrap items-center gap-2">
                {assignees.map(a => {
                  const member = members.find((m: any) => m.user_id === a.user_id);
                  if (!member) return null;
                  return (
                    <Badge key={a.user_id} variant="secondary" className="pl-1 pr-2 py-1 gap-1.5 bg-neutral-100 hover:bg-neutral-200">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={member.avatar_url || ''} />
                        <AvatarFallback className="text-[10px]">{member.display_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{member.display_name}</span>
                      <Button variant="ghost" size="icon" className="w-4 h-4 ml-1 rounded-full text-neutral-400 hover:text-red-500" onClick={() => handleUnassign(a.user_id)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  );
                })}

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 rounded-full border-dashed p-0 text-neutral-500">
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2 rounded-xl" align="start">
                    <div className="text-xs font-semibold text-neutral-500 mb-2 px-2">Assign members</div>
                    <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                      {members.map((member: any) => {
                        const isAssigned = assigneeUserIds.includes(member.user_id);
                        return (
                          <Button
                            key={member.user_id}
                            variant="ghost"
                            className="justify-start px-2 py-1.5 h-auto font-normal"
                            onClick={() => isAssigned ? handleUnassign(member.user_id) : handleAssign(member.user_id)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={member.avatar_url || ''} />
                                <AvatarFallback className="text-[10px]">{member.display_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col items-start min-w-0 flex-1">
                                <span className="text-sm truncate w-full text-left">{member.display_name}</span>
                                <span className="text-[10px] text-neutral-400 truncate w-full text-left">{member.email}</span>
                              </div>
                              {isAssigned && <CheckCircle2 className="w-4 h-4 text-indigo-500 ml-auto flex-shrink-0" />}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                <AlignLeft className="w-4 h-4" />
                Description
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescBlur}
                placeholder="Add a more detailed description..."
                className="min-h-[150px] resize-y border-neutral-200 bg-neutral-50/50 focus-visible:bg-white rounded-xl"
              />
            </div>

            {/* Attachments */}
            <TaskAttachment taskId={task.id} workspaceId={workspaceId} />

            <div className="mt-auto pt-6 text-xs text-neutral-400 flex flex-col gap-1">
              <div>Created on {format(new Date(task.created_at), "MMM d, yyyy 'at' h:mm a")}</div>
              <div>Last updated {format(new Date(task.updated_at), "MMM d, yyyy 'at' h:mm a")}</div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
