// components/ProductShowcase.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Users,
  Layers,
  CheckSquare,
  Calendar,
  Send,
  X,
  MessageSquare,
  MoreHorizontal,
  Search,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Clock,
  User,
  Plus,
  Edit2,
  Trash2,
  Move,
  Circle,
  CheckCircle,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

// ------------------------------------------------------------
// SHOWCASE BLOCK #1: AI WRITING ASSISTANT MOCKUP
// ------------------------------------------------------------
function AIAssistantMockup() {
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

// ------------------------------------------------------------
// SHOWCASE BLOCK #2: REAL-TIME COLLABORATION MOCKUP
// ------------------------------------------------------------
function CollaborationMockup() {
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

// ------------------------------------------------------------
// SHOWCASE BLOCK #3: WORKSPACE ORGANIZATION MOCKUP
// ------------------------------------------------------------
function WorkspaceMockup() {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    Product: true,
    Design: false,
    Engineering: false,
  });
  const [selectedPage, setSelectedPage] = useState("Roadmap");

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const pages = {
    Product: ["Roadmap", "Release Notes", "Feedback"],
    Design: ["UI Kit", "Wireframes"],
    Engineering: ["API Docs", "Sprint Board"],
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] shadow-lg overflow-hidden bg-white flex h-[420px]">
      {/* Sidebar */}
      <div className="w-44 border-r border-[#EAEAEA] bg-[#FAFAFA] p-2 overflow-auto">
        <div className="mb-3 flex items-center gap-1 text-xs font-medium text-[#111111]/60">
          <Search className="w-3 h-3" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full text-[#111111]"
          />
        </div>
        {Object.keys(expandedFolders).map((folder) => (
          <div key={folder}>
            <button
              onClick={() => toggleFolder(folder)}
              className="flex items-center gap-1 w-full text-left px-2 py-1 rounded-md hover:bg-[#EAEAEA] text-sm font-medium"
            >
              {expandedFolders[folder] ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <Folder className="w-3 h-3" />
              <span>{folder}</span>
            </button>
            {expandedFolders[folder] && (
              <div className="ml-5 space-y-0.5 mt-0.5">
                {pages[folder as keyof typeof pages].map((page) => (
                  <button
                    key={page}
                    onClick={() => setSelectedPage(page)}
                    className={`flex items-center gap-1 w-full text-left px-2 py-1 rounded-md text-xs ${
                      selectedPage === page
                        ? "bg-[#4F46E5]/10 text-[#4F46E5] font-medium"
                        : "hover:bg-[#EAEAEA] text-[#111111]/70"
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[#111111]">{selectedPage}</h3>
          <div className="flex gap-1">
            <button className="p-1 rounded-md hover:bg-[#EAEAEA]">
              <Plus className="w-3 h-3" />
            </button>
            <button className="p-1 rounded-md hover:bg-[#EAEAEA]">
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="text-sm text-[#111111]/70 space-y-2">
          {selectedPage === "Roadmap" && (
            <>
              <p>✓ Q2 goals defined</p>
              <p>• AI feature research</p>
              <p>• Design system update</p>
            </>
          )}
          {selectedPage === "Release Notes" && <p>v2.4.0 — Improved performance</p>}
          {selectedPage === "Feedback" && <p>User suggestions: dark mode, API rate limits</p>}
          {selectedPage === "UI Kit" && <p>Components: buttons, modals, forms</p>}
          {selectedPage === "Wireframes" && <p>Figma link: [draft]</p>}
          {selectedPage === "API Docs" && <p>REST endpoints, authentication</p>}
          {selectedPage === "Sprint Board" && <p>Current sprint: 3 tasks left</p>}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// SHOWCASE BLOCK #4: TASKS & PROJECT TRACKING MOCKUP (Kanban)
// ------------------------------------------------------------
type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: "todo" | "in-progress" | "done";
};

const initialTasks: Task[] = [
  { id: "1", title: "Design system update", assignee: "Emma", dueDate: "Mar 20", status: "todo" },
  { id: "2", title: "API integration", assignee: "Alex", dueDate: "Mar 22", status: "in-progress" },
  { id: "3", title: "User testing", assignee: "Sarah", dueDate: "Mar 18", status: "done" },
  { id: "4", title: "Write documentation", assignee: "John", dueDate: "Mar 25", status: "todo" },
  { id: "5", title: "Bug fixes", assignee: "Alex", dueDate: "Mar 19", status: "in-progress" },
];

function TaskTrackingMockup() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const columns = {
    todo: { title: "To Do", color: "#EAEAEA", tasks: tasks.filter((t) => t.status === "todo") },
    "in-progress": { title: "In Progress", color: "#4F46E5", tasks: tasks.filter((t) => t.status === "in-progress") },
    done: { title: "Done", color: "#10B981", tasks: tasks.filter((t) => t.status === "done") },
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] shadow-lg overflow-hidden bg-white p-3 h-[420px]">
      <div className="flex gap-3 h-full overflow-auto">
        {Object.entries(columns).map(([key, col]) => (
          <div key={key} className="flex-1 min-w-[140px] bg-[#FAFAFA] rounded-xl p-2 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#111111]/60">
                {col.title}
              </span>
              <span className="text-xs bg-white px-1.5 py-0.5 rounded-full border border-[#EAEAEA]">
                {col.tasks.length}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              {col.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  className="bg-white rounded-lg border border-[#EAEAEA] p-2 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-[#111111]">{task.title}</h4>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as Task["status"])}
                      className="text-[10px] border-none bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-[#111111]/50">
                    <User className="w-3 h-3" />
                    <span>{task.assignee}</span>
                    <Clock className="w-3 h-3 ml-1" />
                    <span>{task.dueDate}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// SHOWCASE BLOCK #5: CALENDAR & MEETINGS MOCKUP
// ------------------------------------------------------------
function CalendarMockup() {
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [hoverEvent, setHoverEvent] = useState<{ day: number; title: string } | null>(null);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const events: Record<number, { title: string; time: string }[]> = {
    5: [{ title: "Design review", time: "10:00 AM" }],
    12: [{ title: "Sprint planning", time: "2:00 PM" }],
    15: [{ title: "Product demo", time: "11:00 AM" }],
    20: [{ title: "Team sync", time: "3:00 PM" }],
    25: [{ title: "Launch prep", time: "9:00 AM" }],
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] shadow-lg overflow-hidden bg-white p-3 h-[420px]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-[#111111]">March 2026</h3>
        <div className="flex gap-1 text-xs">
          <button className="px-2 py-1 rounded-md hover:bg-[#FAFAFA]">Today</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#111111]/50 mb-2">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const hasEvents = events[day];
          const isSelected = selectedDate === day;
          return (
            <div
              key={day}
              className={`relative p-1 text-center rounded-lg cursor-pointer transition-all ${
                isSelected ? "bg-[#4F46E5]/10 ring-1 ring-[#4F46E5]" : "hover:bg-[#FAFAFA]"
              }`}
              onClick={() => setSelectedDate(day)}
              onMouseEnter={() =>
                hasEvents && setHoverEvent({ day, title: hasEvents[0].title })
              }
              onMouseLeave={() => setHoverEvent(null)}
            >
              <span className={`text-sm ${isSelected ? "text-[#4F46E5] font-medium" : "text-[#111111]/70"}`}>
                {day}
              </span>
              {hasEvents && (
                <div className="w-1 h-1 rounded-full bg-[#4F46E5] mx-auto mt-0.5"></div>
              )}
              {hoverEvent?.day === day && (
                <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#111111] text-white text-[10px] rounded whitespace-nowrap">
                  {hoverEvent.title}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDate && events[selectedDate] && (
        <div className="mt-4 p-2 border-t border-[#EAEAEA] text-xs">
          <span className="font-medium">Events for Mar {selectedDate}:</span>
          <ul className="mt-1 space-y-1">
            {events[selectedDate].map((e, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></div>
                <span>{e.title}</span>
                <span className="text-[#111111]/40">{e.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// MAIN PRODUCT SHOWCASE SECTION
// ------------------------------------------------------------
const showcaseBlocks = [
  {
    eyebrow: "AI-POWERED",
    heading: "Write faster, think deeper.",
    description:
      "Draft articles, reports, meeting summaries, and emails. Rewrite content for different tones, fix grammar, translate languages, and summarize long documents quickly.",
    benefits: [
      "Draft articles & emails",
      "Tone rewriting",
      "Grammar & clarity fixes",
      "Multi-language translation",
      "Document summarization",
    ],
    mockup: <AIAssistantMockup />,
    layout: "textLeft" as const,
  },
  {
    eyebrow: "COLLABORATIVE",
    heading: "Real-time editing, anywhere.",
    description:
      "Multiple teammates can edit the same document simultaneously. See cursors, leave comments, and resolve threads together.",
    benefits: ["Live cursors", "Threaded comments", "Version history"],
    mockup: <CollaborationMockup />,
    layout: "mockupLeft" as const,
  },
  {
    eyebrow: "ORGANIZED",
    heading: "Shared workspaces for every project.",
    description:
      "Create separate workspaces for departments, clients, or initiatives. Keep everything structured and accessible.",
    benefits: ["Nested pages", "Custom templates", "Quick search"],
    mockup: <WorkspaceMockup />,
    layout: "textLeft" as const,
  },
  {
    eyebrow: "TASK MANAGEMENT",
    heading: "From notes to actionable tasks.",
    description:
      "Turn any line in your document into a task. Assign it to teammates, set due dates, and track progress without leaving the page.",
    benefits: ["Inline task creation", "Assignee & due dates", "Kanban boards"],
    mockup: <TaskTrackingMockup />,
    layout: "mockupLeft" as const,
  },
  {
    eyebrow: "SCHEDULING",
    heading: "Meetings that actually work.",
    description:
      "Connect your calendar, find mutual availability, and let AI generate agenda and follow-up tasks automatically.",
    benefits: ["Google Calendar sync", "AI generated agendas", "Follow-up meetings"],
    mockup: <CalendarMockup />,
    layout: "textLeft" as const,
  },
];

export default function Products() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {showcaseBlocks.map((block, idx) => (
          <div
            key={block.heading}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
              idx !== 0 ? "mt-24 lg:mt-32" : ""
            }`}
          >
            {block.layout === "textLeft" ? (
              <>
                <div>
                  <span className="text-sm font-semibold text-[#4F46E5] tracking-wide uppercase">
                    {block.eyebrow}
                  </span>
                  <h3 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                    {block.heading}
                  </h3>
                  <p className="mt-5 text-lg text-[#111111]/60 leading-relaxed">
                    {block.description}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {block.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-[#111111]/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {block.mockup}
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {block.mockup}
                </motion.div>
                <div>
                  <span className="text-sm font-semibold text-[#4F46E5] tracking-wide uppercase">
                    {block.eyebrow}
                  </span>
                  <h3 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight text-[#111111]">
                    {block.heading}
                  </h3>
                  <p className="mt-5 text-lg text-[#111111]/60 leading-relaxed">
                    {block.description}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {block.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-[#111111]/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}