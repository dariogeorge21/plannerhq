import {
  Sparkles,
  Users,
  BookOpen,
  ChevronRight,
  Command,
  Calendar,
  CheckCircle2,
  MoreHorizontal,
  PenTool,
  MessageSquare,
  ArrowRight
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAFAFA] pt-24 pb-20 lg:pt-32 lg:pb-28 selection:bg-indigo-500/30">
      {/* Background Gradients & Grids */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-0 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl rounded-full opacity-50 translate-y-[-50%]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-8">
          <div className="group flex items-center gap-2 rounded-full border border-black/5 bg-white/50 backdrop-blur-md py-1.5 px-4 text-xs font-medium text-neutral-600 shadow-sm transition-all hover:bg-white hover:shadow-md cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            Introducing PlannerHQ AI 2.0
            <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
          </div>
        </div>

        {/* Headline & Subhead */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-[5rem] lg:leading-[1.05] font-extrabold tracking-[-0.02em] text-neutral-950 text-balance">
            The workspace where teams{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
                think & build
              </span>
            </span>{" "}
            together.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed text-balance">
            Unify your documents, tasks, meetings, and roadmaps. Powered by intelligent AI assistance and real-time collaboration in a single, fluid workspace.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 py-3.5 text-sm font-medium text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all hover:bg-neutral-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-95"
            >
              Start for free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-neutral-200 px-8 py-3.5 text-sm font-medium text-neutral-900 shadow-sm transition-all hover:bg-neutral-50 hover:border-neutral-300 active:scale-95"
            >
              Compare pricing
            </a>
          </div>
          
          <p className="mt-4 text-xs font-medium text-neutral-400">
            No credit card required • Free forever plan available
          </p>
        </div>

        {/* Product Showcase Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 to-emerald-500/20 rounded-[2.5rem] blur-2xl opacity-50" />
          
          <div className="relative rounded-[2rem] border border-neutral-200/60 bg-white/40 p-2 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-neutral-200/80 bg-white shadow-sm overflow-hidden flex flex-col h-[600px]">
              
              {/* Mockup MacOS Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mx-auto flex items-center gap-2 px-3 py-1 bg-white rounded-md border border-neutral-200 shadow-sm text-[11px] font-medium text-neutral-500">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  All changes saved
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                {/* Sidebar */}
                <div className="hidden md:block col-span-3 border-r border-neutral-100 bg-neutral-50/50 p-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 font-semibold text-sm text-neutral-900">
                      <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      Acme Corp
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3 px-2">FAVORITES</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 text-sm font-medium text-indigo-600 bg-indigo-50/80 rounded-lg px-2 py-1.5">
                          <BookOpen className="w-4 h-4" />
                          Product Roadmap
                        </div>
                        <div className="flex items-center gap-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors rounded-lg px-2 py-1.5 cursor-pointer">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          Q3 Planning
                        </div>
                        <div className="flex items-center gap-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors rounded-lg px-2 py-1.5 cursor-pointer">
                          <Users className="w-4 h-4 text-neutral-400" />
                          Team Directory
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="col-span-1 md:col-span-9 bg-white p-6 lg:p-10 overflow-y-auto relative">
                  {/* Document Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">Product Roadmap 2026</h2>
                      <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Done
                        </span>
                        <span>•</span>
                        <span>Updated 2m ago</span>
                      </div>
                    </div>
                    
                    {/* Live Collaboration Avatars */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        2 viewing
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 z-20">
                          JD
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 z-10">
                          MK
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 max-w-3xl">
                    {/* AI Generation Block */}
                    <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5 shadow-sm">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                      <div className="flex items-start gap-4">
                        <div className="mt-1 rounded-full bg-indigo-100 p-1.5 text-indigo-600">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-sm font-semibold text-neutral-900">AI Assistant generated a summary</div>
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            Based on yesterday's sync, the main priority for Q2 is launching the new real-time collaboration features. Engineering will need 3 weeks for infrastructure scaling.
                          </p>
                          <div className="flex gap-2 pt-2">
                            <button className="text-xs font-medium px-3 py-1.5 rounded-md bg-white border border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors">
                              Insert to document
                            </button>
                            <button className="text-xs font-medium px-3 py-1.5 rounded-md text-neutral-500 hover:bg-neutral-50 transition-colors">
                              Regenerate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rich Text Elements */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-neutral-900 mt-8">Q2 Deliverables</h3>
                      
                      {/* Task List */}
                      <div className="space-y-3">
                        <div className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                          <div className="w-5 h-5 mt-0.5 rounded-md border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-400 line-through">Finalize WebSocket architecture</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">Done</span>
                            </div>
                          </div>
                        </div>

                        <div className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer relative">
                          <div className="w-5 h-5 mt-0.5 rounded-md border-2 border-neutral-300"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">Launch real-time cursor tracking</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">In Progress</span>
                              <span className="text-xs text-neutral-400">Due Mar 15</span>
                            </div>
                          </div>
                          
                          {/* Simulated active cursor */}
                          <div className="absolute top-8 left-[180px] z-50 animate-bounce">
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.58046 0L0 18.2384L5.61713 14.898L9.2088 19.3496L11.8315 17.2285L8.14088 12.8711L13.8821 11.2319L2.58046 0Z" fill="#10B981" stroke="white" strokeWidth="1.5"/>
                            </svg>
                            <div className="ml-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-semibold rounded rounded-tl-none shadow-sm inline-block">
                              Sarah
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating UI Badges - Tablet & Desktop only */}
            <div className="absolute -top-6 -right-6 lg:-top-8 lg:-right-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-neutral-200/60 p-4 hidden md:flex items-center gap-3 animate-[y-axis_3s_ease-in-out_infinite_alternate] hover:scale-105 transition-transform" style={{ animationName: 'float' }}>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900">Multiplayer</div>
                <div className="text-xs font-medium text-neutral-500">Zero latency</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 lg:-bottom-8 lg:-left-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-neutral-200/60 p-4 hidden md:flex items-center gap-3 animate-[y-axis_4s_ease-in-out_infinite_alternate_reverse] hover:scale-105 transition-transform" style={{ animationName: 'float' }}>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900">AI Enabled</div>
                <div className="text-xs font-medium text-neutral-500">Drafts & Summaries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition Micro-Features */}
        <div className="mt-16 border-t border-neutral-200/60 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-neutral-500">
            <div className="flex items-center gap-2">
              <Command className="w-4 h-4 text-neutral-400" />
              <span>Keyboard first</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-400" />
              <span>Real-time sync</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-neutral-400" />
              <span>Inline comments</span>
            </div>
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-neutral-400" />
              <span>Rich formatting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Style for Keyframe Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }
      `}} />
    </section>
  );
}