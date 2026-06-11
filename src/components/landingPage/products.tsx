"use client";

import { motion} from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { AIAssistantMockup } from "../productMockup/Mockups";
import { CollaborationMockup } from "../productMockup/Mockups";
import { WorkspaceMockup } from "../productMockup/Mockups";
import { TaskTrackingMockup } from "../productMockup/Mockups";
import { CalendarMockup } from "../productMockup/Mockups";


const showcaseBlocks = [
  {
    eyebrow: "AI-Powered",
    heading: "Write faster, think deeper.",
    description:
      "Draft articles, reports, meeting summaries, and emails instantly. Rewrite content for different tones, fix grammar, translate languages, and summarize long documents without leaving your editor.",
    benefits: [
      "Context-aware drafting",
      "Tone adjustment & rewriting",
      "Multi-language translation",
      "Instant document summarization",
    ],
    mockup: <AIAssistantMockup />,
    layout: "textLeft" as const,
  },
  {
    eyebrow: "Multiplayer",
    heading: "Real-time editing, everywhere.",
    description:
      "Work together without stepping on toes. Multiple teammates can edit the same document simultaneously with zero latency. See live cursors, leave threaded comments, and resolve discussions instantly.",
    benefits: [
      "Zero-latency live cursors",
      "Threaded inline comments",
      "Granular version history",
      "Presence indicators"
    ],
    mockup: <CollaborationMockup />,
    layout: "textRight" as const,
  },
  {
    eyebrow: "Knowledge Hub",
    heading: "A single source of truth.",
    description:
      "Organize everything from high-level architecture docs to daily meeting notes. Create nested pages, embed rich media, and utilize powerful search to find exactly what you need in milliseconds.",
    benefits: [
      "Infinite nested hierarchies",
      "Blazing fast global search",
      "Rich media embedding",
      "Granular access controls"
    ],
    mockup: <WorkspaceMockup />,
    layout: "textLeft" as const,
  },
  {
    eyebrow: "Project Management",
    heading: "Turn strategy into execution.",
    description:
      "Bridge the gap between documents and action. Create tasks directly from your notes, organize them in customizable Kanban boards, and track progress with automated status updates.",
    benefits: [
      "Customizable Kanban boards",
      "Automated task progress tracking",
      "Priority and custom tags",
      "Assignee workload views"
    ],
    mockup: <TaskTrackingMockup />,
    layout: "textRight" as const,
  },
  {
    eyebrow: "Calendar Sync",
    heading: "Your schedule, unified.",
    description:
      "Stop switching tabs to check your availability. View your entire team's schedule, drag and drop tasks onto your calendar to time-block, and automatically attach relevant documents to upcoming meetings.",
    benefits: [
      "Two-way calendar syncing",
      "Drag-and-drop time blocking",
      "Auto-attach meeting notes",
      "Team availability view"
    ],
    mockup: <CalendarMockup />,
    layout: "textLeft" as const,
  },
];

export default function ProductShowcase() {
  return (
    <section className="relative bg-white py-24 lg:py-32 overflow-hidden selection:bg-indigo-500/30">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/10 bg-indigo-50/50 px-3 py-1 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              Core Capabilities
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 text-balance"
          >
            A unified workspace built for modern velocity.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg lg:text-xl text-neutral-500 max-w-2xl mx-auto text-balance leading-relaxed"
          >
            Stop fragmenting your work across specialized tools. PlannerHQ brings your documents, tasks, and team together in one fluid, beautiful interface.
          </motion.p>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-32 lg:space-y-48">
          {showcaseBlocks.map((block, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center ${
                block.layout === "textRight" ? "lg:rtl" : ""
              }`}
            >
              {/* Text Side */}
              <motion.div
                initial={{ opacity: 0, x: block.layout === "textLeft" ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={block.layout === "textRight" ? "lg:ltr" : ""}
                dir="ltr"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-4">
                    {block.eyebrow}
                  </span>
                  <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 mb-6 text-balance">
                    {block.heading}
                  </h3>
                  <p className="text-lg text-neutral-500 leading-relaxed mb-8">
                    {block.description}
                  </p>
                  
                  <ul className="space-y-4 mb-10 w-full">
                    {block.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-neutral-700 font-medium">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <button className="group flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-indigo-600 transition-colors">
                    Explore {block.eyebrow.toLowerCase()} features
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>

              {/* Mockup Side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative lg:ltr"
                dir="ltr"
              >
                {/* Abstract Decorative Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-500/10 via-transparent to-emerald-500/10 blur-3xl rounded-full -z-10 pointer-events-none" />
                
                {/* Device Frame */}
                <div className="relative rounded-[1.5rem] bg-neutral-100/50 p-2 lg:p-3 border border-neutral-200/50 shadow-sm backdrop-blur-sm">
                   <div className="relative rounded-2xl overflow-hidden ring-1 ring-neutral-200/50 bg-white">
                      {block.mockup}
                   </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}