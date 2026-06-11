import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileText,
  Command,
  MessageSquare,
  LayoutDashboard,
  Clock,
  Flag,
  Send,
  MousePointer2,
  ChevronRight,
  Plus,
  CheckSquare,
  GripVertical,
  MoreHorizontal,
  Folder,
  Search
} from "lucide-react";

export function AIAssistantMockup() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-100 lg:h-120 bg-white rounded-2xl overflow-hidden flex flex-col font-sans">
      {/* MacOS Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/80 backdrop-blur-md">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
        </div>
        <div className="mx-auto flex items-center gap-2 text-xs font-medium text-neutral-500">
          <FileText className="w-3.5 h-3.5" /> Product_Launch_Q3.md
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-6 md:p-8 relative">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4 tracking-tight">Q3 Feature Announcement</h2>
        
        <div className="space-y-3 relative text-sm md:text-base text-neutral-600 leading-relaxed">
          <p>We are thrilled to announce the upcoming release of our new platform features designed to accelerate team velocity.</p>
          
          <motion.div
            className="relative"
            animate={{ 
              opacity: step >= 1 ? 1 : 0.5,
              filter: step === 1 ? "blur(1px)" : "blur(0px)" 
            }}
          >
            {step < 2 ? (
              <p>This update includes several improvements to our core workflow engine.</p>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-neutral-900 font-medium bg-indigo-50/50 py-1 -mx-1 px-1 rounded"
              >
                Our completely re-engineered workflow engine now automates up to 40% of routine tasks, freeing your team to focus on strategic initiatives.
              </motion.p>
            )}

            {/* AI Command Menu Overlay */}
            <AnimatePresence>
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-neutral-200/80 p-2 z-20"
                >
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-100 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-medium text-neutral-500">AI Actions</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg text-indigo-700 text-sm font-medium cursor-default">
                      Make it punchier
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-600 text-sm cursor-default">
                      Expand with examples
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 rounded-lg text-neutral-600 text-sm cursor-default">
                      Translate to French
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <p>Read on to see the full breakdown of features and integration timelines.</p>
        </div>

        {/* Floating AI Button */}
        <motion.div 
          className="absolute bottom-6 right-6 flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-full shadow-lg"
          animate={{ scale: step === 1 ? 1.05 : 1 }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Ask AI</span>
          <Command className="w-3 h-3 text-neutral-400 ml-2" />
        </motion.div>
      </div>
    </div>
  );
}

export function CollaborationMockup() {
  return (
    <div className="relative w-full h-100 lg:h-120 bg-white rounded-2xl overflow-hidden flex font-sans">
      {/* Sidebar - Comments */}
      <div className="w-64 border-r border-neutral-100 bg-neutral-50/50 hidden md:flex flex-col">
        <div className="p-4 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-neutral-400" />
            Comments
          </h3>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-900">Sarah Jenkins</span>
              <span className="text-[10px] text-neutral-400">2m ago</span>
            </div>
            <p className="text-xs text-neutral-600 bg-white p-2.5 rounded-lg border border-neutral-200 shadow-sm leading-relaxed">
              Let's make sure we update the pricing tiers before this goes live next week.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-900">Marcus Doe</span>
              <span className="text-[10px] text-neutral-400">Just now</span>
            </div>
            <p className="text-xs text-neutral-600 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 leading-relaxed">
              I'll add the new tables to section 3.
            </p>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-neutral-100">
          <div className="relative">
            <input type="text" placeholder="Reply..." className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2 pr-8 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
            <Send className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Main Document Area */}
      <div className="flex-1 p-8 relative overflow-hidden">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-8 w-3/4 bg-neutral-100 rounded-lg" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-5/6 bg-neutral-100 rounded" />
          </div>
          
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 space-y-3">
            <div className="h-4 w-1/3 bg-indigo-100 rounded" />
            <div className="h-4 w-full bg-indigo-100/50 rounded" />
            <div className="h-4 w-4/5 bg-indigo-100/50 rounded" />
          </div>

          <div className="space-y-3">
            <div className="h-4 w-full bg-neutral-100 rounded" />
            <div className="h-4 w-3/4 bg-neutral-100 rounded" />
          </div>
        </div>

        {/* Animated Cursors */}
        <motion.div
          animate={{
            x: [0, 100, 50, 120, 0],
            y: [0, 50, 150, 80, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-1/4 flex flex-col items-start pointer-events-none drop-shadow-md z-10"
        >
          <MousePointer2 className="w-5 h-5 text-emerald-500 fill-emerald-500 -ml-2 -mt-2" />
          <div className="bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md rounded-tl-none whitespace-nowrap shadow-sm mt-1">
            Sarah J.
          </div>
        </motion.div>

        <motion.div
          animate={{
            x: [200, 50, 180, 250, 200],
            y: [150, 250, 100, 200, 150],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/4 right-1/4 flex flex-col items-start pointer-events-none drop-shadow-md z-10"
        >
          <MousePointer2 className="w-5 h-5 text-indigo-500 fill-indigo-500 -ml-2 -mt-2" />
          <div className="bg-indigo-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md rounded-tl-none whitespace-nowrap shadow-sm mt-1">
            Marcus D.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function WorkspaceMockup() {
  return (
    <div className="relative w-full h-100 lg:h-120 bg-[#FAFAFA] rounded-2xl border border-neutral-200/60 shadow-xl flex font-sans overflow-hidden">
      {/* Glass Sidebar */}
      <div className="w-56 bg-neutral-50/80 backdrop-blur-xl border-r border-neutral-200/50 flex flex-col">
        <div className="p-4 border-b border-neutral-200/50">
          <div className="flex items-center gap-2 w-full bg-white border border-neutral-200 rounded-md px-3 py-1.5 shadow-sm">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-400 font-medium">Search...</span>
          </div>
        </div>
        <div className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          <div className="px-2 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-900 bg-white rounded-md shadow-sm border border-neutral-200/50">
            <LayoutDashboard className="w-4 h-4 text-indigo-500" />
            Dashboard
          </div>
          <div className="px-2 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">
            <Folder className="w-4 h-4 text-neutral-400" />
            Engineering
          </div>
          <div className="pl-8 pr-2 py-1.5 flex items-center gap-2 text-xs font-medium text-neutral-500 hover:bg-neutral-100 rounded-md transition-colors">
            <FileText className="w-3.5 h-3.5" /> Architecture.md
          </div>
          <div className="pl-8 pr-2 py-1.5 flex items-center gap-2 text-xs font-medium text-neutral-500 hover:bg-neutral-100 rounded-md transition-colors">
            <FileText className="w-3.5 h-3.5" /> API_v2_Specs.md
          </div>
          <div className="px-2 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors mt-2">
            <Folder className="w-4 h-4 text-neutral-400" />
            Product Design
          </div>
          <div className="px-2 py-1.5 flex items-center gap-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors">
            <Folder className="w-4 h-4 text-neutral-400" />
            Marketing
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white flex flex-col relative">
        <div className="h-14 border-b border-neutral-100 flex items-center px-6 justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
            <span>PlannerHQ</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-900">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">JD</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">SM</div>
            </div>
            <button className="bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm">
              Share
            </button>
          </div>
        </div>
        <div className="p-8 flex-1 overflow-y-auto">
           <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-8">Welcome back, Team.</h1>
           <div className="grid grid-cols-2 gap-4">
             <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
               <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                 <FileText className="w-5 h-5 text-indigo-600" />
               </div>
               <h3 className="font-semibold text-neutral-900">Q3 Roadmap</h3>
               <p className="text-xs text-neutral-500 mt-1">Edited 2 hrs ago by Sarah</p>
             </div>
             <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
               <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                 <CheckSquare className="w-5 h-5 text-emerald-600" />
               </div>
               <h3 className="font-semibold text-neutral-900">Launch Checklist</h3>
               <p className="text-xs text-neutral-500 mt-1">3/12 tasks completed</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export function TaskTrackingMockup() {
  return (
    <div className="relative w-full h-100 lg:h-120 bg-neutral-50 rounded-2xl border border-neutral-200/60 shadow-xl flex flex-col font-sans overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200/80 bg-white flex justify-between items-center">
        <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-indigo-600" />
          Frontend Overhaul
        </h3>
        <div className="flex items-center gap-2">
          <button className="text-xs font-medium bg-white border border-neutral-200 px-3 py-1.5 rounded-md shadow-sm hover:bg-neutral-50">Filter</button>
          <button className="text-xs font-medium bg-neutral-900 text-white px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1 hover:bg-neutral-800">
            <Plus className="w-3.5 h-3.5" /> New Task
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-6 min-w-max h-full">
          {/* Column 1 */}
          <div className="w-72 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-400" />
                <span className="text-sm font-semibold text-neutral-700">To Do</span>
                <span className="text-xs font-medium text-neutral-400 bg-neutral-200/50 px-2 rounded-full">3</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow cursor-grab">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">DESIGN</span>
                  <GripVertical className="w-3.5 h-3.5 text-neutral-300" />
                </div>
                <h4 className="text-sm font-medium text-neutral-900 mb-3">Update component library styles</h4>
                <div className="flex items-center justify-between text-neutral-400">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5" /> Mar 12
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-600 border border-white ring-1 ring-neutral-200">
                    JD
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow cursor-grab">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">CORE</span>
                  <GripVertical className="w-3.5 h-3.5 text-neutral-300" />
                </div>
                <h4 className="text-sm font-medium text-neutral-900 mb-3">Implement RBAC middleware</h4>
                <div className="flex items-center justify-between text-neutral-400">
                  <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
                    <Flag className="w-3.5 h-3.5" /> High
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-600 border border-white ring-1 ring-neutral-200">
                    AS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="w-72 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-semibold text-neutral-700">In Progress</span>
                <span className="text-xs font-medium text-neutral-400 bg-neutral-200/50 px-2 rounded-full">1</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex-1 space-y-3">
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white p-3.5 rounded-xl border-2 border-indigo-500/20 shadow-md cursor-grab relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <div className="flex items-start justify-between mb-2 ml-1">
                  <span className="text-[10px] font-bold tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">BUG</span>
                </div>
                <h4 className="text-sm font-medium text-neutral-900 mb-3 ml-1">Fix socket connection drops</h4>
                <div className="flex items-center justify-between text-neutral-400 ml-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <CheckSquare className="w-3.5 h-3.5" /> 2/5
                  </div>
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 border border-white ring-1 ring-neutral-200 z-10">JD</div>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 border border-white ring-1 ring-neutral-200">MK</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalendarMockup() {
  return (
    <div className="relative w-full h-100 lg:h-120 bg-white rounded-2xl border border-neutral-200/60 shadow-xl flex flex-col font-sans overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-white z-10">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-neutral-900">October 2026</h3>
          <div className="flex items-center gap-1 bg-neutral-100 rounded-md p-1">
            <button className="px-3 py-1 text-xs font-medium bg-white rounded shadow-sm text-neutral-900">Month</button>
            <button className="px-3 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-900">Week</button>
          </div>
        </div>
        <button className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col bg-neutral-50/50">
        <div className="grid grid-cols-7 border-b border-neutral-100 bg-white">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {day}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-neutral-100">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 2; // Offset for start of month
            const isCurrentMonth = dayNum > 0 && dayNum <= 31;
            const isToday = dayNum === 14;
            
            return (
              <div key={i} className={`bg-white p-2 flex flex-col gap-1 min-h-15 ${!isCurrentMonth ? 'opacity-40' : 'hover:bg-neutral-50 transition-colors cursor-pointer'}`}>
                <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-neutral-700'}`}>
                  {dayNum > 0 ? (dayNum > 31 ? dayNum - 31 : dayNum) : 30 + dayNum}
                </div>
                
                {/* Events */}
                {dayNum === 12 && (
                  <div className="text-[10px] font-medium bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded truncate">
                    Product Sync
                  </div>
                )}
                {dayNum === 14 && (
                  <>
                    <div className="text-[10px] font-medium bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded truncate">
                      Design Review
                    </div>
                    <div className="text-[10px] font-medium bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded truncate">
                      All Hands
                    </div>
                  </>
                )}
                {dayNum >= 18 && dayNum <= 20 && (
                  <div className="text-[10px] font-medium bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded truncate">
                    Offsite
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}