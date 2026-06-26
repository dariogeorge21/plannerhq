import React, { useState } from "react";
import { Channel } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HashIcon, Users, MessageSquareText, PlusIcon, MoreVertical, LockIcon, TrashIcon, UserCogIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateChannelModal } from "./CreateChannelModal";
import { EditChannelMembersModal } from "./EditChannelMembersModal";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";

interface ChannelSidebarProps {
  channels: Channel[];
  activeChannelId: string | null;
  setActiveChannelId: (id: string) => void;
  workspaceMembers: any[];
  startDirectChat: (memberId: string) => void;
  currentUserId: string | null;
  currentUserRole?: string;
  createChannel?: (name: string, description?: string, isPrivate?: boolean, memberIds?: string[]) => Promise<{ success: boolean; error?: string }>;
  deleteChannel?: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateChannelMembers?: (id: string, added: string[], removed: string[]) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export function ChannelSidebar({
  channels,
  activeChannelId,
  setActiveChannelId,
  workspaceMembers,
  startDirectChat,
  currentUserId,
  currentUserRole = 'member',
  createChannel,
  deleteChannel,
  updateChannelMembers,
  loading = false,
}: ChannelSidebarProps) {
  const publicChannels = channels.filter(c => !c.is_direct && !c.is_private);
  const privateChannels = channels.filter(c => !c.is_direct && c.is_private);
  const directChannels = channels.filter(c => c.is_direct);
  const otherMembers = workspaceMembers.filter(m => m.user_id !== currentUserId);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [deletingChannel, setDeletingChannel] = useState<Channel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdminOrOwner = currentUserRole === 'admin' || currentUserRole === 'owner';

  const handleDeleteClick = (channel: Channel) => {
    setDeletingChannel(channel);
  };

  const confirmDelete = async () => {
    if (deletingChannel && deleteChannel) {
      setIsDeleting(true);
      await deleteChannel(deletingChannel.id);
      setIsDeleting(false);
      setDeletingChannel(null);
    }
  };

  const openEditModal = (channel: Channel) => {
    setEditingChannel(channel);
    setEditModalOpen(true);
  };

  const renderChannel = (channel: Channel) => {
    const isActive = activeChannelId === channel.id;
    const isGeneral = channel.slug === 'general';
    return (
      <div key={channel.id} className="relative group flex items-center">
        <button
          onClick={() => setActiveChannelId(channel.id)}
          className={cn(
            "w-full flex items-center p-2 -mx-2 rounded-xl border border-transparent transition-all text-left",
            isActive
              ? "bg-primary/10 border-primary/20 text-primary shadow-sm"
              : "hover:bg-background hover:border-border/60 hover:shadow-sm text-foreground/80 hover:text-foreground"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0 transition-colors",
            isActive
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground group-hover:bg-muted/80 group-hover:text-foreground"
          )}>
            {channel.is_private ? <LockIcon className="w-4 h-4" strokeWidth={2.5} /> : <HashIcon className="w-4 h-4" strokeWidth={2.5} />}
          </div>
          <span className="text-sm font-bold truncate flex-1">
            {channel.name}
          </span>
        </button>

        {isAdminOrOwner && !isGeneral && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("absolute right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity", isActive ? "opacity-100" : "")}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {channel.is_private && (
                <DropdownMenuItem onClick={() => openEditModal(channel)}>
                  <UserCogIcon className="w-4 h-4 mr-2" /> Edit Members
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleDeleteClick(channel)} className="text-destructive focus:text-destructive">
                <TrashIcon className="w-4 h-4 mr-2" /> Delete Channel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-muted/10 transition-colors duration-300">
      <div className="h-16 px-5 border-b border-border flex items-center justify-between shrink-0 bg-background/50 backdrop-blur-sm transition-colors duration-300">
        <h3 className="font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <MessageSquareText className="w-4 h-4 text-muted-foreground" />
          Chats
        </h3>
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="px-5 space-y-8">

          {/* Public Chat Rooms Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Chat Rooms
              </h4>
              {isAdminOrOwner && (
                <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground" onClick={() => setCreateModalOpen(true)}>
                  <PlusIcon className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
            <div className="space-y-1">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 -mx-2">
                    <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                ))
              ) : (
                publicChannels.map(renderChannel)
              )}
            </div>
          </div>

          {/* Private Channels Section */}
          {(!loading && privateChannels.length > 0) && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  Private Channels
                </h4>
              </div>
              <div className="space-y-1">
                {privateChannels.map(renderChannel)}
              </div>
            </div>
          )}

          {/* Personal Chats Section */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              Personal chats
            </h4>
            <div className="space-y-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 -mx-2">
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="space-y-1 flex-1">
                      <div className="h-3.5 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-2.5 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : otherMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No other members</p>
              ) : (
                otherMembers.map((member) => {
                  const initials = member.display_name?.substring(0, 2).toUpperCase() || '??';
                  return (
                    <button
                      key={member.user_id}
                      onClick={() => startDirectChat(member.user_id)}
                      className={cn(
                        "w-full flex items-center group p-2 -mx-2 rounded-xl border border-transparent transition-all text-left",
                        "hover:bg-background hover:border-border/60 hover:shadow-sm text-foreground/80 hover:text-foreground"
                      )}
                    >
                      <div className="relative flex-shrink-0 mr-3">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.display_name}
                            className="h-8 w-8 rounded-full border border-border object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-[10px] text-foreground/70">
                            {initials}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate text-foreground leading-tight">
                          {member.display_name}
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground truncate mt-0.5">
                          @{member.hqid || member.display_name?.toLowerCase().replace(/\s+/g, '')}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </ScrollArea>

      {createChannel && (
        <CreateChannelModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          workspaceMembers={workspaceMembers}
          currentUserId={currentUserId}
          createChannel={createChannel}
        />
      )}

      {updateChannelMembers && (
        <EditChannelMembersModal
          channel={editingChannel}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          workspaceMembers={workspaceMembers}
          currentUserId={currentUserId}
          updateChannelMembers={updateChannelMembers}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!deletingChannel}
        onClose={() => setDeletingChannel(null)}
        onConfirm={confirmDelete}
        title="Delete Channel"
        description={`Are you sure you want to delete #${deletingChannel?.name}? This action cannot be undone and will permanently delete all messages in this channel.`}
        confirmText="Delete Channel"
        isLoading={isDeleting}
      />
    </div>
  );
}
