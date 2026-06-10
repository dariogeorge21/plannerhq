// components/FAQ.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does PlannerHQ work?",
    answer:
      "PlannerHQ combines documents, tasks, calendars, and AI assistance into a single workspace. Create pages, invite teammates, and start collaborating instantly. Everything is real-time and cloud-synced.",
  },
  {
    question: "Is collaboration real-time?",
    answer:
      "Yes, absolutely. Multiple team members can edit the same document simultaneously. You'll see their cursors, selections, and changes as they happen.",
  },
  {
    question: "Can I invite external guests?",
    answer:
      "Yes, you can invite external collaborators with view or edit permissions. Great for clients, freelancers, or partners.",
  },
  {
    question: "How does AI assistance work?",
    answer:
      "Our AI assistant can generate content, summarize long documents, extract action items from meetings, and help with brainstorming. Just type /ai or use the assistant panel.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We use enterprise-grade encryption (AES-256 at rest, TLS 1.3 in transit). Regular backups, SSO options, and compliance with SOC 2 and GDPR standards.",
  },
  {
    question: "Do you support enterprise plans?",
    answer:
      "Yes, our Enterprise plan includes SSO, advanced permissions, audit logs, dedicated support, and custom SLAs. Contact our sales team for a tailored quote.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[#FAFAFA] py-24 lg:py-32">
      <div className="max-w-[900px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={faq.question}
              className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-[#FAFAFA] transition-colors"
              >
                <span className="font-semibold text-[#111111]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#111111]/40 transition-transform ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-5 pt-1 text-[#111111]/60 border-t border-[#EAEAEA] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}