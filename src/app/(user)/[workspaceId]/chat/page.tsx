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
}

export default async function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = await params;

  return (
    <div className="absolute inset-0 p-4 lg:p-6 lg:pb-8 flex flex-col">
      <ChatLayout workspaceId={resolvedParams.workspaceId} />
    </div>
  );
}
