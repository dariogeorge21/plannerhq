// src/app/(user)/[workspaceId]/chat/page.tsx
import { Metadata } from "next";
import { ChatLayout } from "@/features/chat/components/ChatLayout";

export const metadata: Metadata = {
  title: "Chat - PlannerHQ",
  description: "Collaborate in real-time with your workspace members.",
};

interface ChatPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
  searchParams: Promise<{
    channel?: string;
  }>;
}

export default async function ChatPage({ params, searchParams }: ChatPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    // By using absolute inset-0 here within the flex-1 main element of layout, 
    // it perfectly fills the remaining space without scrolling the whole page.
    <div className="absolute inset-0 p-4 md:p-6 lg:p-8 flex flex-col">
      <ChatLayout 
        workspaceId={resolvedParams.workspaceId} 
        initialChannelId={resolvedSearchParams.channel}
      />
    </div>
  );
}