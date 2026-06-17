"use client";

import { useChat } from "../use-chat";
import { ChatWindow } from "./ChatWindow";
import { PresenceSidebar } from "./PresenceSidebar";
import { HashIcon, InfoIcon, PlusIcon, MessageSquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  } = useChat(workspaceId);

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  return (
    <div className="flex h-full w-full overflow-hidden bg-background border border-border/60 rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/5">
      {/* Channel Sidebar */}
      <div className="w-48 border-r bg-muted/5 h-full flex flex-col flex-shrink-0">
        <div className="h-14 px-5 border-b flex items-center justify-between bg-background/50 backdrop-blur sticky top-0 z-10">
          <h3 className="font-semibold flex items-center text-sm text-foreground">
            <MessageSquareIcon className="w-4 h-4 mr-2 text-muted-foreground" />
            Channels
          </h3>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg">
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 animate-in fade-in duration-300">
          {loading && channels.length === 0 ? (
            <div className="space-y-2 px-2">
              <div className="h-8 bg-muted/40 animate-pulse rounded-lg w-full" />
              <div className="h-8 bg-muted/40 animate-pulse rounded-lg w-4/5" />
              <div className="h-8 bg-muted/40 animate-pulse rounded-lg w-3/4" />
            </div>
          ) : (
            channels.map((channel) => {
              const isActive = channel.id === activeChannelId;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-xl text-[14px] font-medium transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:translate-x-0.5"
                  )}
                >
                  <HashIcon
                    className={cn(
                      "w-4 h-4 mr-2 flex-shrink-0 transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-foreground/85"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="truncate">{channel.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-14 my-12 border-b border-border/60 flex justify-between items-center px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-3 animate-in slide-in-from-left-2 duration-200">
            <div className="bg-primary/10 p-1.5 rounded-lg flex items-center justify-center">
              <HashIcon className="w-5 h-5 text-primary" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-bold text-[15px] leading-none text-foreground mb-1">
                {activeChannel?.name || "General"}
              </h2>
              <p className="text-[12px] font-medium text-muted-foreground leading-none">
                {activeChannel?.description || "Workspace collaboration"}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <InfoIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Window */}
        <ChatWindow
          messages={messages}
          currentUserId={currentUserId}
          loading={loading}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
          onSendMessage={sendMessage}
          onTyping={setTyping}
          typingUsers={typingUsers}
        />
      </div>

      {/* Presence Sidebar */}
      <div className="lg:block w-48 relative z-0">
        <PresenceSidebar onlineUsers={onlineUsers} typingUsers={typingUsers} />
      </div>
    </div>
  );
}