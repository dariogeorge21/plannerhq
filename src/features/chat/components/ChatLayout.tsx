// src/features/chat/components/ChatLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { useChat } from "../use-chat";
import { ChatWindow } from "./ChatWindow";
import { PresenceSidebar } from "./PresenceSidebar";
import { ChannelSidebar } from "./ChannelSidebar";
import { HashIcon, InfoIcon, PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface ChatLayoutProps {
  workspaceId: string;
  initialChannelId?: string;
}

export function ChatLayout({ workspaceId, initialChannelId }: ChatLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    channels,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    hasMore,
    loadingMore,
    loadMore,
    sendMessage,
    setTyping,
    currentUserId,
    currentUserRole,
    activeChannelId,
    setActiveChannelId,
    workspaceMembers,
    startDirectChat,
    createChannel,
    deleteChannel,
    updateChannelMembers,
  } = useChat(workspaceId, initialChannelId);

  const activeChannel = channels.find((c) => c.id === activeChannelId);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  // Sync activeChannelId with URL
  useEffect(() => {
    if (activeChannelId) {
      const currentChannel = searchParams.get("channel");
      if (currentChannel !== activeChannelId) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("channel", activeChannelId);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [activeChannelId, pathname, router, searchParams]);

  let channelName = activeChannel?.name || "General";
  let channelDesc = activeChannel?.description || "Workspace collaboration";
  const isDirect = activeChannel?.is_direct;

  if (isDirect && activeChannel && currentUserId) {
    const parts = activeChannel.slug.split('_');
    const otherUserId = parts.find(p => p !== 'direct' && p !== currentUserId);
    const otherMember = workspaceMembers.find(m => m.user_id === otherUserId);
    if (otherMember) {
      channelName = otherMember.display_name;
      channelDesc = `@${otherMember.hqid || otherMember.display_name?.toLowerCase().replace(/\s+/g, '')}`;
    }
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-background border border-border rounded-3xl shadow-xl shadow-foreground/5 dark:shadow-none transition-colors duration-300">

      {/* Left Sidebar (Channels & Personal Chats) */}
      <div
        className={cn(
          "h-full border-r border-border bg-muted/30 transition-all duration-300 ease-in-out shrink-0 absolute z-20 md:relative",
          leftSidebarOpen ? "w-72 opacity-100 translate-x-0" : "w-0 opacity-0 border-none overflow-hidden -translate-x-full md:translate-x-0"
        )}
      >
        <ChannelSidebar
          channels={channels}
          activeChannelId={activeChannelId}
          setActiveChannelId={(id) => { setActiveChannelId(id); if (window.innerWidth < 768) setLeftSidebarOpen(false); }}
          workspaceMembers={workspaceMembers}
          startDirectChat={(id) => { startDirectChat(id); if (window.innerWidth < 768) setLeftSidebarOpen(false); }}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          createChannel={createChannel}
          deleteChannel={deleteChannel}
          updateChannelMembers={updateChannelMembers}
          loading={loading && channels.length === 0}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {leftSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-10 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setLeftSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-background z-0 transition-colors duration-300">

        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur-md shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className={cn("h-9 w-9 rounded-lg transition-colors mr-1", leftSidebarOpen ? "bg-primary/10 text-primary hidden md:flex" : "text-muted-foreground hover:text-foreground flex")}
            >
              {leftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </Button>
            {loading && !activeChannel ? (
              <div className="w-10 h-10 rounded-xl bg-muted animate-pulse border border-border" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 transition-colors">
                {isDirect ? <UserIcon className="w-5 h-5" strokeWidth={2.5} /> : <HashIcon className="w-5 h-5" strokeWidth={2.5} />}
              </div>
            )}
            <div>
              {loading && !activeChannel ? (
                <div className="space-y-2">
                  <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <h2 className="font-extrabold text-foreground tracking-tight leading-tight transition-colors">
                    {channelName}
                  </h2>
                  <p className="text-xs font-medium text-muted-foreground leading-tight mt-0.5 transition-colors">
                    {channelDesc}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg hidden md:flex transition-colors">
              <InfoIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn("h-9 w-9 rounded-lg transition-colors hidden md:flex", sidebarOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Chat Window Context */}
        <ChatWindow
          messages={messages}
          currentUserId={currentUserId ?? undefined}
          loading={loading && messages.length === 0}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
          onSendMessage={sendMessage}
          onTyping={setTyping}
          typingUsers={typingUsers}
        />
      </div>

      {/* Presence Sidebar (Collapsible) */}
      <div
        className={cn(
          "h-full border-l border-border bg-muted/30 transition-all duration-300 ease-in-out hidden lg:block shrink-0",
          sidebarOpen ? "w-72 opacity-100" : "w-0 opacity-0 border-none overflow-hidden"
        )}
      >
        <PresenceSidebar
          onlineUsers={onlineUsers}
          typingUsers={typingUsers}
          loading={loading && onlineUsers.length === 0}
        />
      </div>
    </div>
  );
}