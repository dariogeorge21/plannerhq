"use client";

import React, { useState, useEffect } from "react";
import { Task } from "@/features/task/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  Calendar,
  User,
  Users,
  Eye,
  CheckSquare,
  Paperclip
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    none: "text-muted-foreground",
    low: "text-blue-500 dark:text-blue-400",
    medium: "text-amber-500 dark:text-amber-400",
    high: "text-orange-500 dark:text-orange-400",
    urgent: "text-red-500 dark:text-red-400"
  };

  const handleReviewToggle = () => {
    if (!task) return;
    const currentReviewers = task.reviewed_by || [];
    const isReviewed = currentReviewers.includes(userId);

    let newReviewers;
    if (isReviewed) {
      newReviewers = currentReviewers.filter(id => id !== userId);
    } else {
      newReviewers = [...currentReviewers, userId];
    }

    updateTask.mutate({ id: task.id, reviewed_by: newReviewers });
  };

  const creator = members.find((m: any) => m.user_id === task.created_by);
  const reviewers = task.reviewed_by ? task.reviewed_by.map((id: string) => members.find((m: any) => m.user_id === id)).filter(Boolean) : [];
  const isReviewedByMe = task.reviewed_by?.includes(userId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl w-full h-[90vh] sm:h-[85vh] p-0 gap-0 overflow-hidden bg-background border-border shadow-2xl flex flex-col sm:rounded-[2rem]">
        <DialogTitle className="sr-only">Task Details</DialogTitle>
        <DialogDescription className="sr-only">Details, properties and attachments for the task.</DialogDescription>

        {/* Header */}
        <DialogHeader className="px-5 sm:px-6 lg:px-10 py-4 sm:py-5 border-b border-border/60 bg-muted/10 flex flex-row items-center gap-3 sm:gap-4 sticky top-0 z-10 shrink-0 pr-12 sm:pr-16 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 sm:h-11 sm:w-11 shrink-0 rounded-full border shadow-sm transition-all duration-200 ${task.completed ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90' : 'border-border bg-background text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5'}`}
            onClick={() => updateTask.mutate({ id: task.id, completed: !task.completed, status: !task.completed ? 'done' : 'todo' })}
          >
            {task.completed ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Circle className="w-5 h-5 sm:w-6 sm:h-6" />}
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="text-xl sm:text-2xl lg:text-3xl font-bold border-0 bg-transparent text-foreground px-0 focus-visible:ring-0 shadow-none h-auto py-1 min-w-0 flex-1"
            placeholder="Task title"
          />
        </DialogHeader>

        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden custom-scrollbar min-h-0 min-w-0">
          {/* Left Main Content */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-border/60 bg-background min-w-0">
            <div className="p-5 sm:p-6 lg:p-10 max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12 min-w-0">

              <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
                <div className="flex items-center gap-2 text-foreground font-semibold text-base sm:text-lg border-b border-border/40 pb-2 sm:pb-3">
                  <AlignLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                  Description
                </div>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescBlur}
                  placeholder="Add a more detailed description..."
                  className="min-h-[50px] sm:min-h-[100px] resize-y border-0 bg-muted/20 focus-visible:bg-muted/40 text-foreground rounded-xl sm:rounded-2xl placeholder:text-muted-foreground/60 shadow-inner text-sm sm:text-base p-4 sm:p-6 leading-relaxed transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
                <div className="flex items-center gap-2 text-foreground font-semibold text-base sm:text-lg border-b border-border/40 pb-2 sm:pb-3">
                  <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                  Attachments
                </div>
                <div className="bg-muted/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-border/40 min-w-0 overflow-x-auto">
                  <TaskAttachment taskId={task.id} workspaceId={workspaceId} />
                </div>
              </div>

            </div>
          </div>

          {/* Right Properties Panel */}
          <div className="w-full md:w-[340px] lg:w-[420px] shrink-0 bg-muted/5 min-w-0 md:overflow-y-auto custom-scrollbar">
            <div className="p-5 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8 min-w-0">

              {/* Properties Grid */}
              <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
                <h3 className="font-semibold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest pl-1">Properties</h3>

                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-y-4 sm:gap-y-6 items-center text-sm min-w-0">
                  <div className="text-muted-foreground flex items-center gap-2 sm:gap-2.5 font-medium truncate">
                    <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/70 shrink-0" />
                    Status
                  </div>
                  <div className="min-w-0">
                    <Select value={task.status} onValueChange={(val) => updateTask.mutate({ id: task.id, status: val as any })}>
                      <SelectTrigger className="h-9 sm:h-10 w-full bg-background/50 backdrop-blur-sm border-border/60 text-foreground rounded-lg sm:rounded-xl shadow-sm hover:bg-background transition-colors min-w-0">
                        <SelectValue className="truncate" />
                      </SelectTrigger>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-border/60 rounded-xl shadow-2xl">
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-2 sm:gap-2.5 font-medium truncate">
                    <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/70 shrink-0" />
                    Priority
                  </div>
                  <div className="min-w-0">
                    <Select value={task.priority} onValueChange={(val) => updateTask.mutate({ id: task.id, priority: val as any })}>
                      <SelectTrigger className="h-9 sm:h-10 w-full bg-background/50 backdrop-blur-sm border-border/60 text-foreground capitalize rounded-lg sm:rounded-xl shadow-sm hover:bg-background transition-colors min-w-0">
                        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                          <Flag className={`w-3.5 h-3.5 shrink-0 ${priorityColors[task.priority]}`} />
                          <span className="truncate"><SelectValue /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-border/60 rounded-xl shadow-2xl">
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-2 sm:gap-2.5 font-medium truncate">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/70 shrink-0" />
                    Deadline
                  </div>
                  <div className="min-w-0">
                    <DeadlinePicker
                      value={task.due_date}
                      onChange={(date) => setDeadline.mutate({ taskId: task.id, due_date: date })}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/40" />

              {/* People Section */}
              <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
                <h3 className="font-semibold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest pl-1">People</h3>

                <div className="flex flex-col gap-5 sm:gap-7 min-w-0">

                  {/* Assignees */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2 sm:gap-2.5 font-medium">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/70 shrink-0" />
                      Assignees
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      {assignees.map(a => {
                        const member = members.find((m: any) => m.user_id === a.user_id);
                        if (!member) return null;
                        return (
                          <Badge key={a.user_id} variant="secondary" className="pl-1.5 pr-2.5 sm:pr-3 py-1 sm:py-1.5 gap-1.5 sm:gap-2 bg-background/80 shadow-sm text-foreground hover:bg-accent border border-border/60 rounded-full transition-colors max-w-full">
                            <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-border/50 shrink-0">
                              <AvatarImage src={member.avatar_url || ''} />
                              <AvatarFallback className="text-[9px] sm:text-[10px] bg-primary/10 text-primary">{member.display_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-[11px] sm:text-xs font-medium truncate">{member.display_name}</span>
                            <Button variant="ghost" size="icon" className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 sm:ml-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0" onClick={() => handleUnassign(a.user_id)}>
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        );
                      })}

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-dashed border-border/80 bg-background/50 p-0 text-muted-foreground hover:bg-accent hover:text-foreground shadow-sm transition-colors shrink-0">
                            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border-border/60 shadow-2xl" align="start">
                          <div className="text-[11px] sm:text-xs font-semibold text-muted-foreground mb-2 px-2 pt-1">Assign members</div>
                          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
                            {members.map((member: any) => {
                              const isAssigned = assigneeUserIds.includes(member.user_id);
                              return (
                                <Button
                                  key={member.user_id}
                                  variant="ghost"
                                  className={`justify-start px-2 py-2 h-auto font-normal rounded-xl transition-colors ${isAssigned ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}
                                  onClick={() => isAssigned ? handleUnassign(member.user_id) : handleAssign(member.user_id)}
                                >
                                  <div className="flex items-center gap-3 w-full min-w-0">
                                    <Avatar className="w-7 h-7 sm:w-8 sm:h-8 border border-border/50 shadow-sm shrink-0">
                                      <AvatarImage src={member.avatar_url || ''} />
                                      <AvatarFallback className="text-[10px] sm:text-xs bg-muted">{member.display_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start min-w-0 flex-1">
                                      <span className="text-xs sm:text-sm font-medium truncate w-full text-left">{member.display_name}</span>
                                      <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate w-full text-left">{member.email}</span>
                                    </div>
                                    {isAssigned && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary ml-auto flex-shrink-0" />}
                                  </div>
                                </Button>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Created By */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2 sm:gap-2.5 font-medium">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/70 shrink-0" />
                      Created By
                    </div>
                    {creator ? (
                      <div className="flex items-center gap-2.5 sm:gap-3 bg-background/50 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-border/50 shadow-sm w-fit pr-4 sm:pr-5 transition-colors hover:bg-background/80 max-w-full">
                        <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border border-border/60 shadow-sm shrink-0">
                          <AvatarImage src={creator.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">{creator.display_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-medium truncate">{creator.display_name}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{format(new Date(task.created_at), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] sm:text-sm text-muted-foreground bg-muted/20 p-2 rounded-lg w-fit">Unknown</div>
                    )}
                  </div>

                  {/* Reviewed By */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2 sm:gap-2.5 font-medium">
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/70 shrink-0" />
                        Reviewed By
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-7 px-3 text-[10px] sm:text-xs rounded-full shadow-sm transition-colors ${isReviewedByMe ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20' : 'bg-background text-muted-foreground hover:text-foreground'}`}
                        onClick={handleReviewToggle}
                      >
                        {isReviewedByMe ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Reviewed
                          </>
                        ) : (
                          'Mark as Reviewed'
                        )}
                      </Button>
                    </div>

                    {reviewers.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <TooltipProvider delayDuration={200}>
                          {reviewers.map((r: any) => (
                            <Tooltip key={r.user_id}>
                              <TooltipTrigger asChild>
                                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-background shadow-sm hover:translate-y-[-2px] transition-transform cursor-pointer shrink-0">
                                  <AvatarImage src={r.avatar_url || ''} />
                                  <AvatarFallback className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-medium">{r.display_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent className="rounded-xl shadow-xl border-border/50 px-3 py-1.5">
                                <p className="font-medium text-xs sm:text-sm">{r.display_name}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="text-[11px] sm:text-xs text-muted-foreground bg-muted/20 px-3 py-2 rounded-lg w-fit">No reviews yet</div>
                    )}
                  </div>

                </div>
              </div>

              <Separator className="bg-border/40 mt-auto" />

              {/* Footer info */}
              <div className="text-[10px] sm:text-xs text-muted-foreground flex flex-col gap-1.5 sm:gap-2.5 opacity-70">
                <div className="flex items-center justify-between gap-2">
                  <span className="shrink-0">Created</span>
                  <span className="font-medium truncate">{format(new Date(task.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="shrink-0">Last Updated</span>
                  <span className="font-medium truncate">{format(new Date(task.updated_at), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
