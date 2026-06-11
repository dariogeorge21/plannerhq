import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "gray";
}

export default function Section({
  children,
  className = "",
  background = "white",
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 lg:py-24",
        background === "gray" ? "bg-[#FAFAFA]" : "bg-white",
        className
      )}
    >
      {children}
    </section>
  );
}