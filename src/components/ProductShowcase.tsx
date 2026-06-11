import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

export function ProductShowcase({ theme }: { theme: "dark" | "light" }) {
  // ---------- Theme toggle (mockup only) ----------
    const [mockTheme, setMockTheme] = useState<"dark" | "light">(theme);    
//   theme would be based entirely on the prop passed in, but we can allow toggling for demo purposes
    const toggleTheme = useCallback(() => {
        setMockTheme((theme) => (theme === "dark" ? "dark" : "light"));
    }, []);

  // ---------- Window expansion ----------
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setExpanded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ---------- Sequence step (0‑7, loops) ----------
  const [step, setStep] = useState(0);
  const sequenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advanceStep = useCallback(() => {
    setStep((s) => (s >= 7 ? 0 : s + 1));
  }, []);

  // Orchestrate the entire loop with realistic delays
  useEffect(() => {
    if (!expanded) return;
    const delays: Record<number, number> = {
      0: 1000, // landing screen
      1: 1500, // cursor clicks open workspace
      2: 2000, // workspace view
      3: 2500, // calendar click
      4: 3000, // AI assistant
      5: 3500, // documents collaboration
      6: 4000, // close workspace
      7: 4500, // collapsed state before restart
    };
    sequenceTimer.current = setTimeout(() => {
      advanceStep();
    }, delays[step] || 2000);
    return () => {
      if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
    };
  }, [step, expanded, advanceStep]);

  // Reset step when window collapses
  useEffect(() => {
    if (!expanded) setStep(0);
  }, [expanded]);

  // ---------- Cursor movement (pre‑defined positions) ----------
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPositions = [
    { x: 35, y: 40 },  // landing: on "Open Workspace" button
    { x: 45, y: 40 },  // click
    { x: 30, y: 30 },  // workspace: sidebar
    { x: 55, y: 35 },  // calendar tab
    { x: 85, y: 35 },  // AI Assistant tab
    { x: 85, y: 45 },  // AI chat input
    { x: 55, y: 70 },  // documents list item
    { x: 10, y: 90 },  // close workspace button
  ];

  const currentCursor = cursorPositions[step] ?? cursorPositions[0];

  // ---------- Dynamic styles based on mock theme ----------
  const themeStyles = {
    dark: {
      windowBg: "bg-neutral-900/70 backdrop-blur-3xl",
      border: "border-white/10",
      text: "text-white",
      muted: "text-neutral-400",
      panelBg: "bg-white/5",
      inputBg: "bg-white/10",
    },
    light: {
      windowBg: "bg-white/80 backdrop-blur-3xl",
      border: "border-neutral-200/50",
      text: "text-neutral-900",
      muted: "text-neutral-500",
      panelBg: "bg-neutral-100/70",
      inputBg: "bg-neutral-200/50",
    },
  };
  const t = themeStyles[mockTheme];

  // ---------- Floating animation for the window ----------
  const windowVariants = {
    collapsed: { height: 80, opacity: 1, y: 0, rotateX: 0, scale: 1 },
    expanded: { height: "auto", opacity: 1, y: 0, rotateX: 0, scale: 1 },
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 lg:p-10">
      {/* Ambient background glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* macOS‑style application window */}
      <motion.div
        className={`relative z-10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden ${t.windowBg} ${t.border} border`}
        initial="collapsed"
        animate={expanded ? "expanded" : "collapsed"}
        variants={windowVariants}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
        whileHover={{ rotateX: -1, rotateY: 1, scale: 1.01 }}
      >
        {/* Window chrome (traffic lights + theme toggle) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className={`text-xs font-medium ${t.muted}`}>PlannerHQ Workspace</div>
          <button
            onClick={toggleTheme}
            className={`px-2 py-1 text-[10px] font-semibold rounded-full ${mockTheme === "dark" ? "bg-yellow-400/20 text-yellow-300" : "bg-indigo-100 text-indigo-700"} transition-colors`}
          >
            {mockTheme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Window content (dynamic based on step) */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 0: Landing screen (before workspace open) */}
            {step === 0 && expanded && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 flex flex-col items-center justify-center h-full"
              >
                <h2 className={`text-2xl font-bold ${t.text}`}>Welcome to PlannerHQ</h2>
                <p className={`mt-2 text-sm ${t.muted}`}>Your team's intelligent workspace</p>
                <div className="mt-6 flex -space-x-2">
                  {["SC", "JD", "MK"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white border-2 border-white/20"
                    >
                      {initials}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60">
                    +3
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <div className={`px-4 py-2 rounded-xl ${t.panelBg} ${t.text} text-sm font-medium`}>
                    📊 Project Overview
                  </div>
                  <div className={`px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-lg`}>
                    Open Workspace
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Cursor click transition (still landing, but cursor animates) */}
            {step === 1 && expanded && (
              <motion.div
                key="landing-click"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center justify-center h-full"
              >
                {/* Same as landing but with subtle scale animation on button */}
                <h2 className={`text-2xl font-bold ${t.text}`}>Welcome to PlannerHQ</h2>
                <p className={`mt-2 text-sm ${t.muted}`}>Your team's intelligent workspace</p>
                <div className="mt-6 flex -space-x-2">
                  {["SC", "JD", "MK"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white border-2 border-white/20"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-4">
                  <div className={`px-4 py-2 rounded-xl ${t.panelBg} ${t.text} text-sm font-medium`}>
                    📊 Project Overview
                  </div>
                  <motion.div
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-lg"
                    whileTap={{ scale: 0.95 }}
                  >
                    Open Workspace
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Workspace interface (sidebar + center + right) */}
            {step >= 2 && step <= 6 && expanded && (
              <motion.div
                key="workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-4 h-full min-h-[400px]"
              >
                {/* LEFT SIDEBAR */}
                <div className={`col-span-1 border-r ${t.border} p-4 space-y-6`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      P
                    </div>
                    <span className={`text-sm font-semibold ${t.text}`}>PlannerHQ</span>
                  </div>
                  <nav className="space-y-2 text-xs">
                    {["Sheets", "Tasks", "Calendar", "Documents", "AI Assistant", "Settings"].map(
                      (item, idx) => (
                        <div
                          key={item}
                          className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            step === 3 && item === "Calendar"
                              ? "bg-indigo-600 text-white"
                              : step === 4 && item === "AI Assistant"
                              ? "bg-indigo-600 text-white"
                              : `${t.muted} hover:${t.text} hover:bg-white/5`
                          }`}
                        >
                          {item}
                        </div>
                      )
                    )}
                  </nav>
                </div>

                {/* CENTER PANEL */}
                <div className="col-span-2 p-6 overflow-auto">
                  {step === 3 ? (
                    <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className={`text-lg font-semibold ${t.text}`}>Calendar</h3>
                      <div className="mt-4 grid grid-cols-7 gap-1 text-xs">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="text-center text-neutral-500"></div>
                        ))}
                        {Array.from({ length: 28 }).map((_, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded text-center ${
                              i === 14 ? "bg-indigo-600 text-white" : t.muted
                            }`}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : step === 5 ? (
                    <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className={`text-lg font-semibold ${t.text}`}>Collaborative Document</h3>
                      <div className={`mt-4 p-4 rounded-xl ${t.panelBg} text-sm ${t.text} space-y-2`}>
                        <p># Project Roadmap</p>
                        <p>🔹 Q1 Goals <span className="text-indigo-400">(in progress)</span></p>
                        <p>🔹 Q2 Milestones</p>
                        <p className="text-emerald-400">✔ Finalize design system</p>
                        {/* Simulated collaborator cursors */}
                        <div className="mt-4 flex gap-3">
                          <div className="flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-blue-500" />
                            <span className="text-xs">Jane</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-emerald-500" />
                            <span className="text-xs">Mike</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-orange-500" />
                            <span className="text-xs">Sarah</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className={`text-lg font-semibold ${t.text}`}>Task Dashboard</h3>
                      <div className="mt-4 space-y-3">
                        {["Design sprint", "API integration", "QA testing"].map((task, i) => (
                          <div key={task} className={`flex items-center gap-3 p-3 rounded-xl ${t.panelBg}`}>
                            <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-indigo-500" : "bg-emerald-500"}`} />
                            <span className={`text-sm ${t.text}`}>{task}</span>
                            <span className="ml-auto text-xs text-neutral-500">{i === 0 ? "In progress" : "Completed"}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* RIGHT PANEL (AI Assistant chat when step 4) */}
                <div className={`col-span-1 border-l ${t.border} p-4`}>
                  {step === 4 ? (
                    <motion.div key="ai-chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                      <h4 className={`text-sm font-semibold ${t.text}`}>AI Assistant</h4>
                      <div className="flex-1 mt-3 space-y-3 overflow-auto">
                        <div className={`p-2 rounded-lg ${t.panelBg} text-xs ${t.text}`}>
                          👤 Create a project roadmap
                        </div>
                        <motion.div
                          className={`p-2 rounded-lg bg-indigo-600/20 text-xs ${t.text}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          🤖 Sure! Here's a draft:
                          <br />• Research phase (W1‑2)
                          <br />• Design sprints (W3‑4)
                          <br />• Development (W5‑8)
                        </motion.div>
                        <div className={`p-2 rounded-lg ${t.panelBg} text-xs text-neutral-400`}>
                          ⏳ Generating document...
                        </div>
                      </div>
                      <div className={`mt-2 ${t.inputBg} rounded-lg p-2 text-xs text-neutral-400`}>
                        Type a message...
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-xs text-neutral-500 p-2">{step === 5 ? "📄 Documents" : "AI chat closed"}</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 6: Close workspace – show closing animation */}
            {step === 6 && expanded && (
              <motion.div
                key="closing"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center justify-center h-full"
              >
                <motion.p className={`text-lg font-semibold ${t.text}`} animate={{ scale: [1, 1.1, 1] }}>
                  Closing Workspace...
                </motion.p>
                <div className="mt-4 w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 7: Window collapsed – invisible content, restarts loop */}
            {step === 7 && (
              <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 0 }} />
            )}
          </AnimatePresence>
        </div>

        {/* Animated cursor */}
        <motion.div
          ref={cursorRef}
          className="absolute z-20 pointer-events-none"
          animate={{
            left: `${currentCursor.x}%`,
            top: `${currentCursor.y}%`,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`drop-shadow-lg ${mockTheme === "dark" ? "text-white" : "text-neutral-800"}`}
          >
            <path
              d="M5.5 3.5L16.5 12.5L11 14L8.5 20L5.5 3.5Z"
              fill="currentColor"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          {/* Click ripple effect on step transitions */}
          {(step === 1 || step === 3 || step === 4 || step === 5 || step === 6) && (
            <motion.div
              className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-indigo-400/40"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
