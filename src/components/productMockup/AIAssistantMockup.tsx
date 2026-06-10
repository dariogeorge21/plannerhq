import { useState } from "react";
import { Sparkles, FileText, Users } from "lucide-react";
import { motion } from "framer-motion";

export function AIAssistantMockup() {
  const [content, setContent] = useState(
    "Write a product announcement for our new AI feature launch."
  );
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleAIAction = async (action: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (action === "rewrite") {
      setAiSuggestion("🚀 Launch our revolutionary AI assistant — now in beta.");
      setContent(
        "We're thrilled to announce the beta launch of our AI-powered writing assistant, designed to help your team create better content faster."
      );
    } else if (action === "expand") {
      setAiSuggestion(
        "This tool integrates seamlessly with your existing workflow, offering smart completions, tone adjustments, and multilingual support."
      );
      setContent((prev) => prev + " It supports 20+ languages, team tone presets, and contextual suggestions based on your past documents.");
    } else if (action === "summarize") {
      setAiSuggestion("Summarizing key points: AI feature launch, beta availability, team productivity boost.");
      setContent(
        "Launching AI assistant beta. Improves writing speed, supports multiple languages, and learns from your team's documents."
      );
    }
    setIsLoading(false);
    setTimeout(() => setAiSuggestion(""), 3000);
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] shadow-lg overflow-hidden bg-white">
      <div className="flex h-[420px]">
        {/* Sidebar */}
        <div className="w-24 border-r border-[#EAEAEA] bg-[#FAFAFA] p-3 flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="w-8 h-8 rounded-lg hover:bg-[#EAEAEA] flex items-center justify-center cursor-pointer">
            <FileText className="w-4 h-4 text-[#111111]/40" />
          </div>
          <div className="w-8 h-8 rounded-lg hover:bg-[#EAEAEA] flex items-center justify-center cursor-pointer">
            <Users className="w-4 h-4 text-[#111111]/40" />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-[#EAEAEA] px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
              <span className="text-xs font-medium text-[#111111]/60">AI Connected</span>
            </div>
            <div className="flex gap-1">
              <button className="px-2 py-1 text-xs rounded-md bg-[#4F46E5]/10 text-[#4F46E5] font-medium">
                ✨ Ask AI
              </button>
            </div>
          </div>
          <div className="flex-1 p-5 overflow-auto">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 resize-none border-none focus:outline-none text-sm text-[#111111]/80 font-sans"
              placeholder="Start writing..."
            />
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-[#4F46E5]/5 rounded-xl border border-[#4F46E5]/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-[#4F46E5]" />
                  <span className="text-xs font-medium text-[#4F46E5]">AI Suggestions</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleAIAction("rewrite")}
                    className="text-xs px-2 py-1 rounded-full bg-white border border-[#EAEAEA] hover:border-[#4F46E5] transition-colors"
                  >
                    Rewrite
                  </button>
                  <button
                    onClick={() => handleAIAction("expand")}
                    className="text-xs px-2 py-1 rounded-full bg-white border border-[#EAEAEA] hover:border-[#4F46E5] transition-colors"
                  >
                    Expand
                  </button>
                  <button
                    onClick={() => handleAIAction("summarize")}
                    className="text-xs px-2 py-1 rounded-full bg-white border border-[#EAEAEA] hover:border-[#4F46E5] transition-colors"
                  >
                    Summarize
                  </button>
                </div>
              </motion.div>
            )}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 flex items-center gap-2 text-xs text-[#4F46E5]"
              >
                <div className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
                AI is thinking...
              </motion.div>
            )}
            {aiSuggestion && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-2 bg-[#10B981]/10 rounded-lg text-xs text-[#111111]/70"
              >
                {aiSuggestion}
              </motion.div>
            )}
          </div>
          {/* Typing indicator (cursor animation) */}
          <div className="border-t border-[#EAEAEA] px-4 py-2 flex items-center gap-2 text-xs text-[#111111]/40">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-1 h-3 bg-[#4F46E5] rounded-sm"
            />
            Editing — AI ready
          </div>
        </div>
      </div>
    </div>
  );
}