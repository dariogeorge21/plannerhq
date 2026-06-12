"use client";

import { motion } from "framer-motion";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import PageHero from "@/components/shared/PageHero";
import CTABanner from "@/components/shared/CTABanner";
import { AIAssistantMockup,
  CollaborationMockup,
  WorkspaceMockup,
  CalendarMockup,
  TaskTrackingMockup
 } from "@/components/productMockup/Mockups";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { pricingPageContent } from "@/data/data";
import { Cell, Group } from "@/types/types";

const featureBlocks = [
  {
    eyebrow: "AI Writing Assistant",
    title: "Write faster, think deeper.",
    description:
      "Draft, rewrite, summarize, and translate – all within your documents. Let AI handle the busywork.",
    benefits: [
      "Smart autocomplete",
      "Tone adjustment",
      "Grammar & clarity",
      "Summarization",
    ],
    mockup: <AIAssistantMockup />,
    layout: "textLeft" as const,
  },
  {
    eyebrow: "Real-Time Collaboration",
    title: "Co-create without chaos.",
    description:
      "Multiple teammates can edit the same document simultaneously. See cursors, leave comments, and resolve threads together.",
    benefits: ["Live cursors", "Threaded comments", "Version history"],
    mockup: <CollaborationMockup />,
    layout: "mockupLeft" as const,
  },
  {
    eyebrow: "Workspace Management",
    title: "Organize everything your way.",
    description:
      "Nested pages, custom templates, and powerful search. Keep your team's knowledge structured and accessible.",
    benefits: ["Nested pages", "Custom templates", "Quick search"],
    mockup: <WorkspaceMockup />,
    layout: "textLeft" as const,
  },
  {
    eyebrow: "Task Management",
    title: "Turn notes into action.",
    description:
      "Create tasks inline, assign owners, set due dates, and visualize progress with Kanban boards.",
    benefits: ["Inline task creation", "Assignee & due dates", "Kanban view"],
    mockup: <TaskTrackingMockup />,
    layout: "mockupLeft" as const,
  },
  {
    eyebrow: "Calendar & Meetings",
    title: "Meetings that actually work.",
    description:
      "Connect Google Calendar, schedule meetings, and let AI generate agenda and follow-up tasks automatically.",
    benefits: ["Calendar sync", "AI agendas", "Task extraction"],
    mockup: <CalendarMockup />,
    layout: "textLeft" as const,
  },
];

const comparisonFeatureLabels = [
  "Storage",
  "AI Usage",
  "Active Collaborators",
  "Real-time Collaboration",
  "Google Calendar Sync",
  "Tasks per Workspace",
  "AI Context Window",
  "Audit Logs",
] as const;

function findComparisonRow(label: string): Group["rows"][number] | undefined {
  const rows = pricingPageContent.groups.flatMap(
    (group) => group.rows as Group["rows"],
  );
  return rows.find((row) => row.label === label);
}

const comparisonRows = comparisonFeatureLabels
  .map((label) => findComparisonRow(label))
  .filter((row): row is Group["rows"][number] => row !== undefined);

function renderComparisonCell(cell: Cell): string {
  if (cell.kind === "check") return "✓";
  if (cell.kind === "blank") return "—";
  return cell.lines.join(" ");
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <PageHero
        eyebrow="Platform capabilities"
        title="Everything you need to build, write, and ship together."
        description="From AI-powered documents to real-time collaboration and task tracking – PlannerHQ is your team's single source of truth."
      />

      {featureBlocks.map((block, idx) => (
        <Section key={block.eyebrow} background={idx % 2 === 0 ? "white" : "gray"}>
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {block.layout === "textLeft" ? (
                <>
                  <div>
                    <span className="text-sm font-semibold text-[#4F46E5] tracking-wide uppercase">
                      {block.eyebrow}
                    </span>
                    <h2 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight">
                      {block.title}
                    </h2>
                    <p className="mt-5 text-lg text-[#111111]/60 leading-relaxed">
                      {block.description}
                    </p>
                    <ul className="mt-8 space-y-3">
                      {block.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          <span className="text-[#111111]/70">{benefit}</span>
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
                    <h2 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight">
                      {block.title}
                    </h2>
                    <p className="mt-5 text-lg text-[#111111]/60 leading-relaxed">
                      {block.description}
                    </p>
                    <ul className="mt-8 space-y-3">
                      {block.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          <span className="text-[#111111]/70">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </Container>
        </Section>
      ))}

      {/* Feature Comparison Table */}
      <Section background="gray">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">Compare plans & features</h2>
            <p className="mt-3 text-[#111111]/60">
              Everything you need to scale from a small team to enterprise.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#EAEAEA]">
                  <th className="text-left py-4 font-semibold">Feature</th>
                  {pricingPageContent.plans.map((plan) => (
                    <th key={plan.key} className="text-center py-4 font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-[#EAEAEA]">
                    <td className="py-3 font-medium">{row.label}</td>
                    {pricingPageContent.plans.map((plan) => (
                      <td
                        key={plan.key}
                        className="text-center py-3 text-[#111111]/70"
                      >
                        {renderComparisonCell(row.values[plan.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <CTABanner
        title="Ready to supercharge your team's productivity?"
        description="Start today and see how PlannerHQ can transform the way you work together."
        primaryText="Try PlannerHQ Free"
        primaryLink="/signup"
        secondaryText="Checkout pricing"
        secondaryLink="/pricing"
      />
      <Footer />
    </>
  );
}