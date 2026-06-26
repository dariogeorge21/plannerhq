// src/features/chat/components/ChatLayout.tsx
"use client";

import { useChat } from "../use-chat";
import { ChatWindow } from "./ChatWindow";
import { PresenceSidebar } from "./PresenceSidebar";
import { ChannelSidebar } from "./ChannelSidebar";
import { HashIcon, InfoIcon, PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  workspaceId: string;
}

export function ChatLayout({ workspaceId }: ChatLayoutProps) {
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
    activeChannelId,
    setActiveChannelId,
    workspaceMembers,
    startDirectChat,
  } = useChat(workspaceId);

  const activeChannel = channels.find((c) => c.id === activeChannelId);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

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
    <div className="flex h-full w-full overflow-hidden bg-white border border-neutral-200/80 rounded-3xl shadow-xl shadow-neutral-200/40">

      {/* Left Sidebar (Channels & Personal Chats) */}
      <div
        className={cn(
          "h-full border-r border-neutral-100 bg-neutral-50/50 transition-all duration-300 ease-in-out shrink-0 absolute z-20 md:relative",
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
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {leftSidebarOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/20 z-10 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setLeftSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-white z-0">

        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between bg-white/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className={cn("h-9 w-9 rounded-lg transition-colors mr-1", leftSidebarOpen ? "bg-indigo-50 text-indigo-600 hidden md:flex" : "text-neutral-400 hover:text-neutral-900 flex")}
            >
              {leftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </Button>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
              {isDirect ? <UserIcon className="w-5 h-5" strokeWidth={2.5} /> : <HashIcon className="w-5 h-5" strokeWidth={2.5} />}
            </div>
            <div>
              <h2 className="font-extrabold text-neutral-900 tracking-tight leading-tight">
                {channelName}
              </h2>
              <p className="text-xs font-medium text-neutral-500 leading-tight mt-0.5">
                {channelDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-400 hover:text-neutral-900 rounded-lg hidden md:flex">
              <InfoIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn("h-9 w-9 rounded-lg transition-colors hidden md:flex", sidebarOpen ? "bg-indigo-50 text-indigo-600" : "text-neutral-400 hover:text-neutral-900")}
            >
              {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Chat Window Context */}
        <ChatWindow
          messages={messages}
          currentUserId={currentUserId ?? undefined}
          loading={loading}
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
          "h-full border-l border-neutral-100 bg-neutral-50/50 transition-all duration-300 ease-in-out hidden lg:block shrink-0",
          sidebarOpen ? "w-72 opacity-100" : "w-0 opacity-0 border-none overflow-hidden"
        )}
      >
        <PresenceSidebar onlineUsers={onlineUsers} typingUsers={typingUsers} />
      </div>
    </div>
  );
}