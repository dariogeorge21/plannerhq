"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-[#FAFAFA] transition"
          >
            <span className="font-medium text-[#111111]">{item.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-[#111111]/40 transition-transform ${
                openIndex === idx ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openIndex === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-[#EAEAEA]"
              >
                <div className="px-6 py-4 text-[#111111]/60">{item.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}