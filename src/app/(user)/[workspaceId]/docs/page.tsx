"use client";

import React from "react";
import { FileText, Sparkles, PencilLine } from "lucide-react";
import { motion } from "framer-motion";

export default function DocsEmptyState() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-white relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-md w-full flex flex-col items-center text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase border border-indigo-100/50 mb-8">
          <Sparkles className="w-3.5 h-3.5" /> Workspace Docs
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-100 blur-xl rounded-full opacity-50" />
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[2rem] flex items-center justify-center shadow-lg shadow-indigo-500/20 relative z-10">
            <PencilLine className="w-10 h-10" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-3 tracking-tight">Select or Create a Note</h1>
        <p className="text-neutral-500 font-medium leading-relaxed">
          Select an existing page from the sidebar or create a new section and page to start writing.
        </p>
      </motion.div>
    </div>
  );
}
