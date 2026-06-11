import {
  Users,
  FileText,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  MousePointer2,
  Database,
  Lock,
} from "lucide-react";

const features = [
  {
    name: "AI-Powered Workflows",
    description: "Generate, summarize, and refine content instantly with context-aware AI that adapts to your team's unique voice.",
    icon: Sparkles,
    visual: (
      <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-50/80 to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-indigo-500/20 group-hover:scale-110" />
        <div className="relative flex w-56 flex-col gap-2.5 rounded-xl border border-indigo-100/60 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
              <Sparkles className="h-3 w-3" />
            </div>
            <div className="h-2 w-20 rounded-full bg-indigo-100" />
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-neutral-100" />
          <div className="h-2 w-4/5 rounded-full bg-neutral-100" />
          <div className="h-2 w-11/12 rounded-full bg-neutral-100" />
        </div>
      </div>
    )
  },
  {
    name: "Multiplayer by Default",
    description: "Work together flawlessly. See cursors, active edits, and immediate feedback without friction or sync conflicts.",
    icon: Users,
    visual: (
      <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-50/80 to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-emerald-500/20 group-hover:scale-110" />
        <div className="relative w-full max-w-[220px]">
          {/* Mock Text Block */}
          <div className="space-y-3 rounded-xl border border-neutral-100 bg-white/60 p-4 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1">
             <div className="h-2.5 w-full rounded-full bg-neutral-200/80" />
             <div className="h-2.5 w-3/4 rounded-full bg-neutral-200/80" />
             <div className="h-2.5 w-5/6 rounded-full bg-neutral-200/80" />
          </div>
          {/* Cursors */}
          <div className="absolute -top-3 left-1/4 flex flex-col items-start animate-[float-slow_3s_ease-in-out_infinite_alternate]">
             <MousePointer2 className="h-5 w-5 fill-emerald-500 text-emerald-500 drop-shadow-sm" />
             <span className="ml-2.5 mt-0.5 rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">Sarah</span>
          </div>
          <div className="absolute -bottom-3 right-1/4 flex flex-col items-start animate-[float-slow_4s_ease-in-out_infinite_alternate_reverse]">
             <MousePointer2 className="h-5 w-5 fill-amber-500 text-amber-500 drop-shadow-sm" />
             <span className="ml-2.5 mt-0.5 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">Alex</span>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Living Documents",
    description: "Craft beautiful, rich documents. Embed dynamic databases, nested pages, and interactive blocks with absolute ease.",
    icon: FileText,
    visual: (
      <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/80 to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-blue-500/20 group-hover:scale-110" />
        <div className="relative flex h-36 w-56 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-md">
          <div className="w-14 border-r border-neutral-100 bg-neutral-50 p-2.5 space-y-2">
            <div className="h-1.5 w-full rounded-full bg-neutral-200" />
            <div className="h-1.5 w-3/4 rounded-full bg-neutral-200" />
            <div className="h-1.5 w-5/6 rounded-full bg-neutral-200" />
          </div>
          <div className="flex-1 p-3.5 flex flex-col">
             <div className="h-3 w-20 rounded-full bg-neutral-800 mb-3" />
             <div className="flex-1 w-full rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center relative overflow-hidden">
                <Database className="h-5 w-5 text-blue-400" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f612_1px,transparent_1px),linear-gradient(to_bottom,#3b82f612_1px,transparent_1px)] bg-[size:8px_8px]" />
             </div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Integrated Tracking",
    description: "Turn strategies into action. Prioritize work, track dependencies, set due dates, and celebrate milestones together.",
    icon: CheckCircle2,
    visual: (
      <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-50/80 to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-orange-500/20 group-hover:scale-110" />
        <div className="relative flex w-56 flex-col gap-2.5 rounded-xl border border-neutral-100 bg-white/80 p-3 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1">
          <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-2.5 transition-colors group-hover:border-neutral-200">
             <div className="flex h-4 w-4 items-center justify-center rounded border border-neutral-300 bg-white" />
             <div className="h-1.5 w-24 rounded-full bg-neutral-300" />
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-orange-200/60 bg-orange-50/80 p-2.5 shadow-sm">
             <div className="flex h-4 w-4 items-center justify-center rounded bg-orange-500">
               <CheckCircle2 className="h-3 w-3 text-white" />
             </div>
             <div className="flex-1 flex justify-between items-center">
               <div className="h-1.5 w-20 rounded-full bg-orange-400" />
               <div className="h-1.5 w-8 rounded-full bg-orange-200" />
             </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-2.5 transition-colors group-hover:border-neutral-200">
             <div className="flex h-4 w-4 items-center justify-center rounded border border-neutral-300 bg-white" />
             <div className="h-1.5 w-28 rounded-full bg-neutral-300" />
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Smart Meeting Hub",
    description: "Sync calendars, auto-generate structured agendas, and capture intelligent action items without lifting a finger.",
    icon: CalendarDays,
    visual: (
      <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-50/80 to-transparent">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-rose-500/20 group-hover:scale-110" />
         <div className="relative w-56 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm transition-transform duration-500 group-hover:-translate-y-1">
            <div className="border-b border-neutral-100 bg-neutral-50 px-3 py-2.5 flex items-center justify-between">
              <div className="h-2.5 w-16 rounded-full bg-neutral-300" />
              <div className="flex gap-1.5">
                 <div className="h-2 w-2 rounded-full bg-rose-400" />
                 <div className="h-2 w-2 rounded-full bg-neutral-300" />
              </div>
            </div>
            <div className="p-2.5 grid grid-cols-3 gap-1.5">
              <div className="h-14 rounded-md bg-neutral-50" />
              <div className="h-14 rounded-md bg-rose-100/80 border border-rose-200 flex flex-col items-center justify-center gap-1.5 shadow-sm">
                 <div className="h-1 w-8 rounded-full bg-rose-400" />
                 <div className="h-1 w-5 rounded-full bg-rose-300" />
              </div>
              <div className="h-14 rounded-md bg-neutral-50" />
            </div>
         </div>
      </div>
    )
  },
  {
    name: "Enterprise Security",
    description: "Protect your data with granular access controls, automatic backups, SSO integration, and comprehensive audit trails.",
    icon: ShieldCheck,
    visual: (
      <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-100/80 to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-slate-400/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-slate-400/20 group-hover:scale-110" />
        <div className="relative flex w-56 flex-col gap-0 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm transition-transform duration-500 group-hover:-translate-y-1">
           <div className="flex items-center justify-between border-b border-neutral-100 p-3 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-full bg-neutral-200" />
                <div className="h-2.5 w-20 rounded-full bg-neutral-800" />
              </div>
              <div className="rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 flex items-center justify-center">
                 <span className="text-[8px] font-bold tracking-wider text-indigo-600">ADMIN</span>
              </div>
           </div>
           <div className="flex items-center justify-between bg-neutral-50/80 p-3">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-full bg-neutral-200" />
                <div className="h-2.5 w-16 rounded-full bg-neutral-400" />
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500">
                 <Lock className="h-3 w-3" />
                 <span className="text-[8px] font-bold tracking-wider">VIEW</span>
              </div>
           </div>
        </div>
      </div>
    )
  }
];

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#FAFAFA] py-24 sm:py-32 selection:bg-indigo-500/30">
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/10 bg-indigo-50/50 px-3 py-1 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              Platform Capabilities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 text-balance mb-6">
            Everything your team needs to move faster.
          </h2>
          <p className="text-lg text-neutral-500 leading-relaxed text-balance max-w-2xl mx-auto">
            Replace your disjointed toolchain with a single, uncompromising workspace. Beautifully designed, blazingly fast, and infused with intelligent automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
            >
              {/* Feature Abstract Visual Area */}
              <div className="relative h-56 w-full border-b border-neutral-100 bg-neutral-50/30 overflow-hidden">
                {feature.visual}
              </div>
              
              {/* Feature Content Area */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 shadow-md transition-all duration-300 group-hover:bg-indigo-600 group-hover:shadow-indigo-500/20 group-hover:scale-110">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-neutral-900">
                  {feature.name}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500 flex-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Style for Float Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }
      `}} />
    </section>
  );
}