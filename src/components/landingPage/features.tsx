// components/Features.tsx
import {
    MessageSquare,
    Users,
    FileText,
    CheckSquare,
    Calendar,
    Shield,
  } from "lucide-react";
  
  const features = [
    {
      name: "AI Writing Assistant",
      description:
        "Generate, summarize, and improve your writing with contextual AI that learns your team's voice.",
      icon: MessageSquare,
    },
    {
      name: "Real-Time Collaboration",
      description:
        "See cursors, edits, and comments as they happen. Co-create documents without the chaos.",
      icon: Users,
    },
    {
      name: "Workspace Documents",
      description:
        "Rich, flexible documents that support embeds, databases, and nested pages for deep knowledge.",
      icon: FileText,
    },
    {
      name: "Tasks & Project Tracking",
      description:
        "Assign, prioritize, and track work across teams with due dates, statuses, and dependencies.",
      icon: CheckSquare,
    },
    {
      name: "Calendar & Meetings",
      description:
        "Connect calendars, schedule meetings, and auto-generate agendas with AI-powered notes.",
      icon: Calendar,
    },
    {
      name: "Secure Team Sharing",
      description:
        "Granular permissions, SSO, and audit logs to keep your sensitive information protected.",
      icon: Shield,
    },
  ];
  
  export default function Features() {
    return (
      <section id="features" className="bg-[#FAFAFA] py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <span className="text-sm font-semibold text-[#4F46E5] tracking-wide uppercase">
              Features
            </span>
            <h2 className="mt-4 text-3xl lg:text-5xl font-bold tracking-tight text-[#111111]">
              Everything your team needs in one place.
            </h2>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="bg-white rounded-2xl border border-[#EAEAEA] p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/5 flex items-center justify-center mb-5">
                  <feature.icon className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111111] mb-2">
                  {feature.name}
                </h3>
                <p className="text-[#111111]/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }