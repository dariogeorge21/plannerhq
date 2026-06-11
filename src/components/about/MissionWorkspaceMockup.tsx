"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer2,
  MessageCircle,
  CheckCircle2,
  Calendar,
  Send,
  Circle,
  Clock,
  Flag,
} from "lucide-react";

const CHAT_MESSAGES = [
  {
    name: "Sarah J.",
    initials: "SJ",
    color: "bg-emerald-500",
    avatarBg: "bg-emerald-500/15 text-emerald-600",
    text: "Updated the Q3 roadmap section ✓",
    time: "2m ago",
  },
  {
    name: "Marcus D.",
    initials: "MD",
    color: "bg-blue-500",
    avatarBg: "bg-blue-500/15 text-blue-600",
    text: "I'll sync the task deadlines with calendar.",
    time: "Just now",
  },
  {
    name: "Elena R.",
    initials: "ER",
    color: "bg-violet-500",
    avatarBg: "bg-violet-500/15 text-violet-600",
    text: "Design review moved to Thursday 2pm.",
    time: "Now",
  },
];

const TASKS = [
  { label: "Finalize launch checklist", priority: "High", done: false },
  { label: "Sync Google Calendar events", priority: "Medium", done: false },
  { label: "Review API documentation", priority: "Low", done: false },
];

const CALENDAR_DAYS = [
  { day: "Mon", date: 9, events: 0 },
  { day: "Tue", date: 10, events: 1 },
  { day: "Wed", date: 11, events: 0, today: true },
  { day: "Thu", date: 12, events: 2 },
  { day: "Fri", date: 13, events: 1 },
];

export function MissionWorkspaceMockup() {
  const [visibleMessages, setVisibleMessages] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [checkedCount, setCheckedCount] = useState(1);
  const [justSaved, setJustSaved] = useState(false);
  const [activeDay, setActiveDay] = useState(2);

  useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout>;

    const chatCycle = setInterval(() => {
      setIsTyping(true);
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) =>
          prev >= CHAT_MESSAGES.length ? 1 : prev + 1
        );
      }, 1200);
    }, 4500);

    const taskCycle = setInterval(() => {
      setCheckedCount((prev) => (prev >= TASKS.length ? 0 : prev + 1));
    }, 3200);

    const saveCycle = setInterval(() => {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
    }, 6000);

    const dayCycle = setInterval(() => {
      setActiveDay((prev) => (prev + 1) % CALENDAR_DAYS.length);
    }, 2800);

    return () => {
      clearInterval(chatCycle);
      clearInterval(taskCycle);
      clearInterval(saveCycle);
      clearInterval(dayCycle);
      clearTimeout(typingTimeout);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-2xl" />
      <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/40">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="text-foreground/80">Product Roadmap</span>
            <span className="text-muted-foreground/50">·</span>
            <span>PlannerHQ</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: justSaved ? [1, 0.5, 1] : 1 }}
              className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600"
            >
              <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500" />
              {justSaved ? "Saved" : "Live"}
            </motion.div>
            <div className="flex -space-x-1.5">
              {["SJ", "MD", "ER"].map((initials, i) => (
                <div
                  key={initials}
                  className="w-5 h-5 rounded-full border-2 border-card bg-primary/15 flex items-center justify-center text-[8px] font-bold text-primary"
                  style={{ zIndex: 3 - i }}
                >
                  {initials}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 min-h-[380px] lg:min-h-[420px]">
          {/* Document + live cursors */}
          <div className="sm:col-span-3 p-5 border-b sm:border-b-0 sm:border-r border-border relative overflow-hidden bg-background/50">
            <div className="space-y-3 relative z-0">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-bold text-foreground tracking-tight"
              >
                Q3 Product Roadmap
              </motion.h3>
              <div className="space-y-2 text-[11px] leading-relaxed text-muted-foreground">
                <p>
                  Our mission is to unify documents, tasks, and team communication
                  into one seamless workspace.
                </p>
                <motion.p
                  animate={{ opacity: justSaved ? [1, 0.85, 1] : 1 }}
                  className={`rounded px-1 -mx-1 text-foreground/90 font-medium transition-colors ${
                    justSaved ? "bg-primary/10" : ""
                  }`}
                >
                  Key deliverables include real-time collaboration, AI-assisted
                  writing, and calendar sync.
                </motion.p>
                <div className="flex gap-1.5 pt-1">
                  <div className="h-1.5 flex-1 bg-muted rounded-full" />
                  <div className="h-1.5 w-1/3 bg-primary/25 rounded-full" />
                </div>
              </div>

              {/* Mini table */}
              <div className="rounded-lg border border-border overflow-hidden mt-3">
                <div className="grid grid-cols-3 gap-px bg-border text-[9px]">
                  <div className="bg-muted/60 px-2 py-1.5 font-semibold text-foreground">
                    Feature
                  </div>
                  <div className="bg-muted/60 px-2 py-1.5 font-semibold text-foreground">
                    Owner
                  </div>
                  <div className="bg-muted/60 px-2 py-1.5 font-semibold text-foreground">
                    Status
                  </div>
                  {[
                    ["Live cursors", "Sarah", "Done"],
                    ["Workspace chat", "Marcus", "Active"],
                    ["Calendar sync", "Elena", "In progress"],
                  ].map(([feature, owner, status], i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="contents"
                    >
                      <div className="bg-background px-2 py-1.5 text-foreground">
                        {feature}
                      </div>
                      <div className="bg-background px-2 py-1.5 text-muted-foreground">
                        {owner}
                      </div>
                      <div className="bg-background px-2 py-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-medium ${
                            status === "Done"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : status === "Active"
                                ? "bg-primary/10 text-primary"
                                : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Animated cursors */}
            <motion.div
              animate={{
                x: [0, 80, 40, 100, 0],
                y: [0, 30, 80, 50, 0],
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 left-8 flex flex-col items-start pointer-events-none z-20"
            >
              <MousePointer2 className="w-4 h-4 text-emerald-500 fill-emerald-500 -ml-1.5 -mt-1.5 drop-shadow-sm" />
              <div className="bg-emerald-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md rounded-tl-none shadow-sm">
                Sarah J.
              </div>
            </motion.div>

            <motion.div
              animate={{
                x: [120, 60, 140, 90, 120],
                y: [60, 120, 40, 100, 60],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
              className="absolute top-24 right-12 flex flex-col items-start pointer-events-none z-20"
            >
              <MousePointer2 className="w-4 h-4 text-blue-500 fill-blue-500 -ml-1.5 -mt-1.5 drop-shadow-sm" />
              <div className="bg-blue-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md rounded-tl-none shadow-sm">
                Marcus D.
              </div>
            </motion.div>

            {/* Selection highlight */}
            <motion.div
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scaleX: [0.95, 1, 0.95],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute top-[88px] left-5 right-16 h-4 bg-primary/10 border border-primary/20 rounded pointer-events-none z-10"
            />
          </div>

          {/* Workspace chat */}
          <div className="sm:col-span-2 flex flex-col bg-muted/20">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <MessageCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Workspace chat
              </span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
              />
            </div>

            <div className="flex-1 p-3 space-y-2.5 overflow-hidden min-h-[140px]">
              <AnimatePresence mode="popLayout">
                {CHAT_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
                  <motion.div
                    key={msg.name + i}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold ${msg.avatarBg}`}
                        >
                          {msg.initials}
                        </div>
                        <span className="text-[10px] font-semibold text-foreground">
                          {msg.name}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground">
                        {msg.time}
                      </span>
                    </div>
                    <div className="ml-5 text-[10px] leading-relaxed text-muted-foreground bg-background rounded-lg px-2.5 py-2 border border-border shadow-sm">
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 ml-5"
                  >
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: dot * 0.15,
                          }}
                          className="w-1 h-1 rounded-full bg-muted-foreground/50"
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-muted-foreground">
                      Elena is typing...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border-t border-border bg-background/60">
              <div className="relative">
                <div className="w-full text-[10px] bg-muted/50 border border-border rounded-full px-3 py-2 pr-8 text-muted-foreground">
                  Message the team...
                </div>
                <Send className="w-3 h-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks & Calendar strip */}
        <div className="border-t border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Tasks & Calendar
            </span>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {checkedCount}/{TASKS.length} completed today
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tasks */}
            <div className="space-y-1.5">
              {TASKS.map((task, i) => {
                const isChecked = i < checkedCount;
                return (
                  <motion.div
                    key={task.label}
                    layout
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 border transition-colors ${
                      isChecked
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-background border-border"
                    }`}
                  >
                    <motion.div
                      animate={{
                        scale: isChecked ? [1, 1.2, 1] : 1,
                        backgroundColor: isChecked
                          ? "rgb(16 185 129)"
                          : "transparent",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 ${
                        isChecked
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isChecked && (
                        <motion.svg
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          viewBox="0 0 12 12"
                          className="w-2 h-2 text-white"
                        >
                          <motion.path
                            d="M2 6l3 3 5-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </motion.svg>
                      )}
                    </motion.div>
                    <span
                      className={`text-[10px] font-medium flex-1 truncate ${
                        isChecked
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {task.label}
                    </span>
                    {!isChecked && (
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                          task.priority === "High"
                            ? "bg-rose-500/10 text-rose-600"
                            : task.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {task.priority === "High" && (
                          <Flag className="w-2 h-2" />
                        )}
                        {task.priority}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Mini calendar */}
            <div className="rounded-lg border border-border bg-background p-2.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-foreground">
                    June 2026
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5" />
                  Synced
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {CALENDAR_DAYS.map((d, i) => (
                  <motion.div
                    key={d.day}
                    animate={{ scale: activeDay === i ? 1.05 : 1 }}
                    className={`flex flex-col items-center rounded-md py-1.5 px-1 border transition-colors ${
                      activeDay === i
                        ? "bg-primary/10 border-primary/20"
                        : d.today
                          ? "bg-primary/5 border-primary/30"
                          : "border-transparent"
                    }`}
                  >
                    <span className="text-[8px] text-muted-foreground uppercase">
                      {d.day}
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        d.today ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {d.date}
                    </span>
                    {d.events > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {Array.from({ length: Math.min(d.events, 2) }).map(
                          (_, j) => (
                            <motion.div
                              key={j}
                              animate={
                                activeDay === i
                                  ? { scale: [1, 1.3, 1] }
                                  : { scale: 1 }
                              }
                              transition={{ duration: 0.5 }}
                              className="w-1 h-1 rounded-full bg-primary"
                            />
                          )
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDay}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 text-[9px] text-muted-foreground bg-primary/5 rounded px-2 py-1 border border-primary/10"
                >
                  {activeDay === 2 && "Today: 2 meetings · 3 tasks due"}
                  {activeDay === 3 && "Thu: Design review · All hands"}
                  {activeDay === 4 && "Fri: Sprint planning"}
                  {activeDay === 0 && "Mon: Team standup 9am"}
                  {activeDay === 1 && "Tue: Product sync 2pm"}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
