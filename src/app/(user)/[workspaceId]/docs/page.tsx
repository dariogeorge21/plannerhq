"use client";

import React from "react";
import { FileText } from "lucide-react";

export default function DocsEmptyState() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-white">
      <div className="max-w-md w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Select or Create a Note</h1>
        <p className="text-neutral-500 leading-relaxed text-sm">
          Select an existing page from the sidebar or create a new section and page to start writing.
        </p>
      </div>
    </div>
  );
}
