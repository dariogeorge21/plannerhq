"use client";

import React from "react";
import { FileText, Sparkles, PencilLine, Clock, Zap, Plus, Search, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useDocuments, useFavoriteDocuments } from "@/features/document/hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const templates = [
  { id: 'blank', name: 'Blank Document', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'meeting', name: 'Meeting Notes', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'prd', name: 'Product Spec', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

export default function DocsDashboard() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const { data: documents, isLoading } = useDocuments(workspaceId);
  const { data: favorites, isLoading: isFavoritesLoading } = useFavoriteDocuments(workspaceId);

  // We sort by an assumed updated_at or id, for now just slice
  const recentDocs = documents ? [...documents].reverse().slice(0, 4) : [];
  const favDocs = favorites?.map(f => f.document).filter(Boolean) || [];

  return (
    <div className="h-full w-full bg-background relative overflow-y-auto p-8 lg:p-12">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        <header className="space-y-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Notes
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-extrabold tracking-tight text-foreground">
            Good afternoon.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground text-lg max-w-xl">
            Pick up where you left off or start something new.
          </motion.p>
        </header>

        {/* Quick Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search notes, ideas, and decisions..." 
            className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
          />
        </motion.div>

        {/* Favorites */}
        {favDocs.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Favorite Documents
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {favDocs.slice(0, 4).map((doc) => doc && (
                <Link key={doc.id} href={`/${workspaceId}/docs/${doc.id}`} className="group relative bg-card hover:bg-accent/50 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-5 transition-all hover:shadow-md hover:shadow-amber-500/5 flex flex-col justify-between h-32">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PencilLine className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{doc.title || "Untitled"}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Continue Editing */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Continue Editing
            </h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-accent/50 animate-pulse rounded-2xl border border-border" />
              ))}
            </div>
          ) : recentDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentDocs.map((doc) => (
                <Link key={doc.id} href={`/${workspaceId}/docs/${doc.id}`} className="group relative bg-card hover:bg-accent/50 border border-border rounded-2xl p-5 transition-all hover:shadow-md flex flex-col justify-between h-32">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PencilLine className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{doc.title || "Untitled"}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-card border border-border rounded-2xl">
              <p className="text-muted-foreground text-sm">No recent documents found.</p>
            </div>
          )}
        </motion.section>

        {/* Templates */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-muted-foreground" />
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button key={template.id} className="group relative bg-card hover:bg-accent/50 border border-border rounded-2xl p-5 transition-all hover:shadow-md flex items-center gap-4 text-left">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${template.bg} ${template.color}`}>
                  <template.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Start with a template</p>
                </div>
              </button>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
