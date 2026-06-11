// components/shared/FeatureGrid.tsx
"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FeatureItem {
  /** Icon component (e.g., from lucide-react) */
  icon: ReactNode;
  /** Feature title */
  title: string;
  /** Short description */
  description: string;
  /** Optional additional badge or metadata */
  badge?: string;
  /** Optional link for "Learn more" */
  link?: string;
}

export interface FeatureGridProps {
  /** Array of feature items to display */
  features: FeatureItem[];
  /** Number of columns on desktop (default: 3) */
  columns?: 2 | 3 | 4;
  /** Background color of cards – "white" (default) or "transparent" */
  cardBackground?: "white" | "transparent";
  /** Whether to show subtle border around each card (default: true) */
  bordered?: boolean;
  /** Whether to show shadow on hover (default: true) */
  hoverShadow?: boolean;
  /** Animation delay stagger in seconds (default: 0.05) */
  staggerDelay?: number;
  /** Additional class names for the grid container */
  className?: string;
}

const columnClasses = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

export default function FeatureGrid({
  features,
  columns = 3,
  cardBackground = "white",
  bordered = true,
  hoverShadow = true,
  staggerDelay = 0.05,
  className = "",
}: FeatureGridProps) {
  return (
    <div className={cn(columnClasses[columns], "gap-6 lg:gap-8", className)}>
      {features.map((feature, idx) => (
        <motion.div
          key={feature.title}
          custom={idx}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          className={cn(
            "rounded-2xl p-6 lg:p-8 transition-all duration-200",
            cardBackground === "white" && "bg-white",
            bordered && "border border-[#EAEAEA]",
            hoverShadow && "hover:shadow-md hover:border-[#EAEAEA]/80"
          )}
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mb-5">
            {feature.icon}
          </div>

          {/* Badge (optional) */}
          {feature.badge && (
            <span className="inline-block text-xs font-medium text-[#4F46E5] bg-[#4F46E5]/5 px-2 py-0.5 rounded-full mb-3">
              {feature.badge}
            </span>
          )}

          {/* Title */}
          <h3 className="text-xl font-semibold text-[#111111] mb-2">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-[#111111]/60 leading-relaxed">
            {feature.description}
          </p>

          {/* Optional "Learn more" link */}
          {feature.link && (
            <a
              href={feature.link}
              className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#4F46E5] hover:underline"
            >
              Learn more
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )}
        </motion.div>
      ))}
    </div>
  );
}