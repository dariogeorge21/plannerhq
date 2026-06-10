// components/ProductShowcase.tsx
import { Sparkles, Users, Layers, Calendar } from "lucide-react";

const blocks = [
  {
    eyebrow: "AI-POWERED",
    heading: "Write faster, think deeper.",
    description:
      "PlannerHQ's AI assistant helps you draft, edit, and summarize content. Generate meeting notes, action items, and creative briefs in seconds.",
    benefits: ["Smart autocomplete", "One-click summaries", "Tone adjustment"],
    icon: Sparkles,
    imageColor: "bg-gradient-to-br from-[#4F46E5]/10 to-transparent",
  },
  {
    eyebrow: "COLLABORATIVE",
    heading: "Real-time editing, anywhere.",
    description:
      "Multiple teammates can edit the same document simultaneously. See cursors, leave comments, and resolve threads together.",
    benefits: ["Live cursors", "Threaded comments", "Version history"],
    icon: Users,
    imageColor: "bg-gradient-to-br from-[#10B981]/10 to-transparent",
  },
  {
    eyebrow: "ORGANIZED",
    heading: "Shared workspaces for every project.",
    description:
      "Create separate workspaces for departments, clients, or initiatives. Keep everything structured and accessible.",
    benefits: ["Nested pages", "Custom templates", "Quick search"],
    icon: Layers,
    imageColor: "bg-gradient-to-br from-[#4F46E5]/10 to-transparent",
  },
  {
    eyebrow: "SCHEDULING",
    heading: "Meetings that actually work.",
    description:
      "Connect your calendar, find mutual availability, and let AI generate agenda and follow-up tasks automatically.",
    benefits: ["Calendar sync", "AI agendas", "Task extraction"],
    icon: Calendar,
    imageColor: "bg-gradient-to-br from-[#10B981]/10 to-transparent",
  },
];

export default function Products() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {blocks.map((block, idx) => (
          <div
            key={block.heading}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
              idx !== 0 ? "mt-24 lg:mt-32" : ""
            }`}
          >
            {/* Content */}
            <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
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

            {/* Mockup Screenshot */}
            <div
              className={`relative rounded-2xl border border-[#EAEAEA] shadow-lg overflow-hidden bg-[#FAFAFA] ${
                idx % 2 === 1 ? "lg:order-1" : ""
              }`}
            >
              <div className={`p-6 ${block.imageColor}`}>
                <div className="bg-white rounded-xl border border-[#EAEAEA] shadow-sm p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center">
                      <block.icon className="w-4 h-4 text-[#4F46E5]" />
                    </div>
                    <div className="h-2 w-24 bg-[#EAEAEA] rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-[#EAEAEA] rounded-full"></div>
                    <div className="h-3 w-5/6 bg-[#EAEAEA] rounded-full"></div>
                    <div className="h-3 w-4/6 bg-[#EAEAEA] rounded-full"></div>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#EAEAEA]"></div>
                    <div className="h-8 w-8 rounded-full bg-[#EAEAEA]"></div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 text-xs font-medium shadow-md border border-[#EAEAEA]">
                ✨ Interactive demo
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}