import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";

export function CollaborationMockup() {
  const [comments, setComments] = useState([
    { id: 1, user: "Emma", text: "Should we update the timeline?", time: "2m ago" },
    { id: 2, user: "Alex", text: "Yes, let's push to Q3", time: "1m ago" },
  ]);
  const [newComment, setNewComment] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Simulate cursor movement and typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers((prev) =>
        prev.length ? [] : ["Emma is typing..."]
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), user: "You", text: newComment, time: "Just now" },
    ]);
    setNewComment("");
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] shadow-lg overflow-hidden bg-white">
      <div className="flex h-[420px]">
        {/* Document area with cursors */}
        <div className="flex-1 border-r border-[#EAEAEA] p-4 overflow-auto">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium text-[#111111]">Product Roadmap 2025</h3>
            <div className="flex -space-x-2">
              {["JD", "MK", "AL"].map((initial, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-[#4F46E5]/20 flex items-center justify-center text-[10px] font-semibold text-[#4F46E5] border-2 border-white"
                >
                  {initial}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3 text-sm text-[#111111]/70">
            <p>• Finalize UI designs <span className="text-[#10B981] text-xs">✓ Complete</span></p>
            <p>• Develop API integration — <span className="bg-[#4F46E5]/10 px-1 rounded">In progress</span></p>
            <div className="relative">
              <motion.div
                className="absolute left-0 top-0 w-0.5 h-5 bg-[#4F46E5]"
                animate={{ x: [0, 100, 200, 100, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              />
              <p>• Launch beta testing</p>
            </div>
          </div>
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-xs text-[#4F46E5] flex items-center gap-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
              {typingUsers[0]}
            </motion.div>
          )}
        </div>

        {/* Comments Panel */}
        <div className="w-48 bg-[#FAFAFA] p-3 flex flex-col">
          <div className="text-xs font-semibold text-[#111111]/60 mb-2 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Comments
          </div>
          <div className="flex-1 space-y-2 overflow-auto">
            {comments.map((c) => (
              <div key={c.id} className="text-xs">
                <span className="font-medium text-[#111111]">{c.user}</span>
                <span className="text-[#111111]/50 text-[10px] ml-1">{c.time}</span>
                <p className="text-[#111111]/70 mt-0.5">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add reply..."
              className="flex-1 text-xs border border-[#EAEAEA] rounded-full px-2 py-1 focus:outline-none focus:border-[#4F46E5]"
              onKeyDown={(e) => e.key === "Enter" && addComment()}
            />
            <button onClick={addComment} className="p-1 rounded-full hover:bg-[#EAEAEA]">
              <Send className="w-3 h-3 text-[#4F46E5]" />
            </button>
          </div>
        </div>
      </div>
      {/* Live presence bar */}
      <div className="border-t border-[#EAEAEA] px-3 py-1.5 text-[10px] text-[#111111]/40 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        3 active collaborators • Emma is viewing
      </div>
    </div>
  );
}