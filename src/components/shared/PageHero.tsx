import { ReactNode } from "react";
import Container from "./Container";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeroProps) {
  return (
    <div className={cn("py-16 lg:py-24 text-center", className)}>
      <Container>
        {eyebrow && (
          <span className="text-sm font-semibold text-[#4F46E5] tracking-wide uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-4xl lg:text-6xl font-bold tracking-tight text-[#111111] max-w-4xl mx-auto">
          {title}
        </h1>
        <p className="mt-6 text-lg lg:text-xl text-[#111111]/60 max-w-2xl mx-auto">
          {description}
        </p>
        {children && <div className="mt-10">{children}</div>}
      </Container>
    </div>
  );
}