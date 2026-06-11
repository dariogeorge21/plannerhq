// components/FAQ.tsx
"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Mail, MessageCircle } from "lucide-react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white to-muted/30 py-24 lg:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute -top-80 -left-80 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-80 -right-80 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-[900px] mx-auto px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Support Center</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-5">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about PlannerHQ. Can't find the answer you're looking for? Reach out to our team.
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const itemId = `faq-item-${idx}`;
            const answerId = `faq-answer-${idx}`;

            return (
              <div
                key={faq.question}
                className="group relative rounded-2xl border border-border bg-card transition-all duration-200 hover:shadow-lg hover:border-primary/20"
              >
                <button
                  id={itemId}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="w-full px-6 py-5 flex justify-between items-center text-left cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background rounded-2xl"
                >
                  <span className="font-semibold text-foreground text-lg pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180" : "group-hover:scale-110"
                    }`}
                  />
                </button>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={itemId}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 pt-1 text-muted-foreground leading-relaxed border-t border-border/60">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact support CTA */}
        <div className="mt-20 text-center">
          <div className="relative rounded-2xl border border-border bg-gradient-to-br from-card to-muted/20 p-8 lg:p-10 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl" />
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our support team is ready to help you with any specific questions about PlannerHQ.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:support@plannerhq.com"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                >
                  <Mail className="w-4 h-4" />
                  Email support
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Live chat
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Average response time: &lt; 2 hours during business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}