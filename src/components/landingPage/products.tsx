// components/ProductShowcase.tsx
"use client";

import { motion } from "framer-motion";
import { AIAssistantMockup } from "@/components/productMockup/AIAssistantMockup";
import { WorkspaceMockup } from "@/components/productMockup/WorkspaceMockup";
import { TaskTrackingMockup } from "@/components/productMockup/TaskTrackingMockup";
import { CollaborationMockup } from "@/components/productMockup/CollaborationMockup";
import { CalendarMockup } from "@/components/productMockup/CalendarMockup";

const mockupComponents = {
  WorkspaceMockup,
  TaskTrackingMockup,
  CollaborationMockup,
  CalendarMockup,
};

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