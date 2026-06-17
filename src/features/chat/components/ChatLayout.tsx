// src/features/chat/components/ChatLayout.tsx
"use client";

import { useChat } from "../use-chat";
import { ChatWindow } from "./ChatWindow";
import { PresenceSidebar } from "./PresenceSidebar";
import { HashIcon, InfoIcon, PanelRightClose, PanelRightOpen } from "lucide-react";
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
  } = useChat(workspaceId);

  const activeChannel = channels.find((c) => c.id === activeChannelId);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-full w-full overflow-hidden bg-white border border-neutral-200/80 rounded-3xl shadow-xl shadow-neutral-200/40">

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-white">

        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between bg-white/95 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
              <HashIcon className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-extrabold text-neutral-900 tracking-tight leading-tight">
                {activeChannel?.name || "General"}
              </h2>
              <p className="text-xs font-medium text-neutral-500 leading-tight mt-0.5">
                {activeChannel?.description || "Workspace collaboration"}
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