import { ReactNode } from "react";
import Container from "./Container";

interface LegalLayoutProps {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="bg-white dark:bg-neutral-950 py-16 lg:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
          {lastUpdated && (
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Last updated: {lastUpdated}</p>
          )}
          <div className="mt-8 prose prose-slate dark:prose-invert max-w-none prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-neutral-600 dark:prose-p:text-neutral-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-strong:text-neutral-900 dark:prose-strong:text-white">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}