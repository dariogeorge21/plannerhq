import { ReactNode } from "react";
import Container from "./Container";

interface LegalLayoutProps {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="bg-white py-16 lg:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">{title}</h1>
          {lastUpdated && (
            <p className="mt-2 text-sm text-[#111111]/40">Last updated: {lastUpdated}</p>
          )}
          <div className="mt-8 prose prose-slate max-w-none prose-headings:text-[#111111] prose-p:text-[#111111]/70 prose-a:text-[#4F46E5] prose-strong:text-[#111111]">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}