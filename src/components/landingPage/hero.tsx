// components/Hero.tsx
import { Sparkles, Users, BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl lg:leading-[1.2] font-bold tracking-tight text-[#111111]">
            The workspaces where teams think, write, and build together.
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-[#111111]/60 max-w-2xl mx-auto">
            Documents, tasks, meetings, AI assistance, and real-time
            collaboration — all inside a single shared workspace.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="/signup"
              className="rounded-full bg-[#111111] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#111111]/90 transition-all"
            >
              Start Free
            </a>
            <a
              href="/pricing"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-[#111111] border border-[#EAEAEA] hover:bg-[#FAFAFA] transition-all"
            >
              Compare Pricing
            </a>
          </div>
        </div>

        {/* Product Screenshot Mockup */}
        <div className="mt-16 lg:mt-20 relative">
          <div className="relative rounded-2xl border border-[#EAEAEA] shadow-xl bg-[#FAFAFA]">
            {/* Mockup UI */}
            <div className="grid grid-cols-12 h-[500px] lg:h-[600px]">
              {/* Sidebar */}
              <div className="col-span-3 border-r border-[#EAEAEA] bg-white p-4">
                <div className="space-y-4">
                  <div className="font-medium text-sm text-[#111111]/40">WORKSPACE</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#4F46E5] bg-[#4F46E5]/5 rounded-lg px-3 py-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Product Roadmap</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#111111]/60 px-3 py-2">
                      <Users className="w-4 h-4" />
                      <span>Design Review</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#111111]/60 px-3 py-2">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Meeting Notes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="col-span-9 bg-white p-6">
                <div className="border-b border-[#EAEAEA] pb-4 flex justify-between items-center">
                  <h2 className="font-semibold text-[#111111]">Product Roadmap 2026</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-xs">
                      JD
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xs">
                      MK
                    </div>
                    {/* Live cursor indicator */}
                    <div className="flex items-center gap-1 text-xs text-[#111111]/40">
                      <div className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
                      <span>2 editing</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="bg-[#FAFAFA] rounded-xl p-4 border border-[#EAEAEA]">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                      <span className="text-sm font-medium text-[#111111]">AI Assistant</span>
                    </div>
                    <p className="text-sm text-[#111111]/70">
                      Draft Q2 initiatives based on last quarter's performance metrics...
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-1 rounded-full border-2 border-[#EAEAEA]"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#111111]">Launch beta testing</p>
                        <p className="text-xs text-[#111111]/40">Due Mar 15</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-1 rounded-full border-2 border-[#EAEAEA] bg-[#10B981]"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#111111]">Finalize UI designs</p>
                        <p className="text-xs text-[#111111]/40">Completed</p>
                      </div>
                    </div>
                  </div>
                  {/* Calendar mini */}
                  <div className="mt-6 pt-4 border-t border-[#EAEAEA]">
                    <div className="text-xs font-medium text-[#111111]/60 mb-2">Upcoming</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Mar 20</span>
                      <span className="text-[#111111]/60">Design review</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating UI elements */}
            <div className="absolute -top-3 -right-3 lg:-top-5 lg:-right-5 bg-white rounded-xl shadow-lg border border-[#EAEAEA] p-3 hidden sm:block">
              <div className="flex items-center gap-2 text-xs">
                <Users className="w-3 h-3 text-[#4F46E5]" />
                <span>3 team members online</span>
              </div>
            </div>
            <div className="absolute -bottom-3 -left-3 lg:-bottom-5 lg:-left-5 bg-white rounded-xl shadow-lg border border-[#EAEAEA] p-3 hidden sm:block">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="w-3 h-3 text-[#4F46E5]" />
                <span>AI writing...</span>
              </div>
            </div>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-[#111111]/60">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
              <span>✓ Real-time collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
              <span>✓ AI-assisted writing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
              <span>✓ Rich text editing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}