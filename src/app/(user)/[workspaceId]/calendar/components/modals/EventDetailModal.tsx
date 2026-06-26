"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarEventWithDetails, WorkspaceMemberOption } from "@/features/calendar/types";
import { useDeleteEvent } from "@/features/calendar/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Edit2, Trash2, AlignLeft, Users, AtSign, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventDetailModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventWithDetails;
  members: WorkspaceMemberOption[];
  onEditClick: () => void;
  canEdit: boolean;
}

export function EventDetailModal({
  workspaceId,
  isOpen,
  onClose,
  event,
  members,
  onEditClick,
  canEdit,
}: EventDetailModalProps) {
  const deleteEvent = useDeleteEvent(workspaceId);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDelete = () => {
    deleteEvent.mutate(event.id, {
      onSuccess: () => {
        toast.success("Event deleted");
        setIsConfirmingDelete(false);
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete event");
        setIsConfirmingDelete(false);
      },
    });
  };

  const getPriorityColor = (p: string) => {
    if (p === 'high') return "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300";
    if (p === 'low') return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300";
    return "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300";
  };

  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  const isSameDay = start.toDateString() === end.toDateString();

  const timeDisplay = isSameDay 
    ? `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`
    : `${format(start, "MMM d, h:mm a")} - ${format(end, "MMM d, h:mm a")}`;

  const mentionedMembers = members.filter(m => event.mentions.some(mention => mention.user_id === m.user_id));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setIsConfirmingDelete(false);
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-border bg-card">
        <DialogHeader className="px-6 py-5 border-b border-border bg-muted/30 relative">
          <div className="flex justify-between items-start pr-8">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground pr-2">
              {event.title}
            </DialogTitle>
            <Badge className={`uppercase text-[10px] font-bold tracking-wider rounded-md border-none px-2 py-0.5 ${getPriorityColor(event.priority)}`} variant="secondary">
              {event.priority}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{format(start, "EEEE, MMMM d, yyyy")}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {timeDisplay}
              </div>
            </div>
          </div>

          {event.description && (
            <div className="flex items-start gap-3 pt-4 border-t border-border">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <AlignLeft className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">Description</p>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </div>
              </div>
            </div>
          )}

          {(event.mention_all || mentionedMembers.length > 0) && (
            <div className="flex items-start gap-3 pt-4 border-t border-border">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <AtSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-2">Mentions</p>
                {event.mention_all ? (
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">@all workspace members</Badge>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {mentionedMembers.map(m => (
                      <Badge variant="secondary" key={m.user_id} className="bg-muted text-foreground hover:bg-accent border border-border">
                        <Avatar className="h-4 w-4 mr-1.5 inline-block">
                          <AvatarImage src={m.avatar_url || ""} />
                          <AvatarFallback className="text-[9px]">{m.display_name?.substring(0,2).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        {m.display_name || m.email}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {canEdit && (
          <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center rounded-b-2xl">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="text-sm text-red-600 font-medium pl-2">Delete this event?</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsConfirmingDelete(false)} disabled={deleteEvent.isPending}>
                    Cancel
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteEvent.isPending}>
                    {deleteEvent.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Confirm
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button 
                  onClick={() => {
                    onClose();
                    onEditClick();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Event
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
