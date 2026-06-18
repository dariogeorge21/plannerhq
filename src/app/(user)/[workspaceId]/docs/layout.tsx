"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useSections, useDocuments, useCreateSection, useCreateDocument } from "@/features/document/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Folder, FileText, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const { data: sections, isLoading: sectionsLoading } = useSections(workspaceId);
  const { data: documents } = useDocuments(workspaceId);
  const createSection = useCreateSection(workspaceId);
  const createDocument = useCreateDocument(workspaceId);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");
  
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateSectionSubmit = () => {
    if (sectionName.trim()) {
      createSection.mutate(sectionName.trim());
      setSectionName("");
      setIsSectionModalOpen(false);
    }
  };

  const handleCreateDocSubmit = () => {
    if (docTitle.trim() && selectedSectionId) {
      createDocument.mutate({ sectionId: selectedSectionId, title: docTitle.trim() });
      setDocTitle("");
      setIsDocModalOpen(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen w-full overflow-hidden">
      {/* Secondary Sidebar for Notes */}
      <aside className="w-72 border-r border-neutral-200 bg-neutral-50/50 flex flex-col h-full flex-shrink-0 relative">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white shadow-sm z-10">
          <h2 className="font-bold text-neutral-800">Notes & Docs</h2>
          <Button variant="outline" size="sm" onClick={() => setIsSectionModalOpen(true)} className="h-8 gap-1 rounded-lg">
            <Plus className="w-3.5 h-3.5" />
            <span className="text-xs">Section</span>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-neutral-200">
          {sectionsLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            sections?.map(section => (
              <div key={section.id} className="mb-2">
                <div 
                  className="flex items-center justify-between p-2 hover:bg-neutral-100 rounded-xl cursor-pointer group transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-700">
                    <motion.div animate={{ rotate: expandedSections[section.id] ? 90 : 0 }}>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </motion.div>
                    <Folder className="w-4.5 h-4.5 text-indigo-500" />
                    <span className="truncate max-w-[120px]">{section.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all" 
                    onClick={(e) => { e.stopPropagation(); setSelectedSectionId(section.id); setIsDocModalOpen(true); }}
                    title="New Document"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
                
                <AnimatePresence>
                  {expandedSections[section.id] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-5 border-l border-neutral-200 pl-3 mt-1 space-y-0.5 overflow-hidden"
                    >
                      {documents?.filter(d => d.section_id === section.id).map(doc => (
                        <Link 
                          key={doc.id} 
                          href={`/${workspaceId}/docs/${doc.id}`}
                          className="flex items-center gap-2.5 p-2 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg text-sm text-neutral-600 transition-colors group"
                        >
                          <FileText className="w-4 h-4 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="truncate">{doc.title}</span>
                        </Link>
                      ))}
                      {documents?.filter(d => d.section_id === section.id).length === 0 && (
                        <div className="p-2 flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs text-neutral-400 hover:text-indigo-600 justify-start w-full"
                            onClick={() => { setSelectedSectionId(section.id); setIsDocModalOpen(true); }}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Page
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
          {sections?.length === 0 && (
            <div className="text-center p-8">
              <Folder className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm text-neutral-500 mb-4">No sections yet</p>
              <Button variant="default" size="sm" onClick={() => setIsSectionModalOpen(true)} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                Create Section
              </Button>
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-white shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] z-20">
        {children}
      </main>

      {/* Modals */}
      <Dialog open={isSectionModalOpen} onOpenChange={setIsSectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Section Name" 
              value={sectionName} 
              onChange={(e) => setSectionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateSectionSubmit()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSectionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSectionSubmit} disabled={!sectionName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Document Title" 
              value={docTitle} 
              onChange={(e) => setDocTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateDocSubmit()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDocModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateDocSubmit} disabled={!docTitle.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
