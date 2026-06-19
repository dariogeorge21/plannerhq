"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { 
  useSections, 
  useDocuments, 
  useCreateSection, 
  useCreateDocument,
  useUpdateSection,
  useDeleteSection,
  useReorderSections,
  useDeleteDocument,
  useReorderDocuments
} from "@/features/document/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { 
  Plus, 
  Folder, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params?.workspaceId as string;
  const { data: sections, isLoading: sectionsLoading } = useSections(workspaceId);
  const { data: documents } = useDocuments(workspaceId);
  const createSection = useCreateSection(workspaceId);
  const createDocument = useCreateDocument(workspaceId);
  const updateSection = useUpdateSection(workspaceId);
  const deleteSection = useDeleteSection(workspaceId);
  const reorderSections = useReorderSections(workspaceId);
  const deleteDocument = useDeleteDocument(workspaceId);
  const reorderDocuments = useReorderDocuments(workspaceId);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");
  
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [editSectionId, setEditSectionId] = useState<string | null>(null);
  const [editSectionName, setEditSectionName] = useState("");

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: 'section' | 'document', name: string } | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: prev[id] === undefined ? false : !prev[id] }));
  };

  // Initialize expanded state for all sections (default true)
  React.useEffect(() => {
    if (sections && Object.keys(expandedSections).length === 0) {
      const initial: Record<string, boolean> = {};
      sections.forEach(s => initial[s.id] = true);
      setExpandedSections(initial);
    }
  }, [sections]);

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

  const handleEditSectionSubmit = () => {
    if (editSectionName.trim() && editSectionId) {
      updateSection.mutate({ sectionId: editSectionId, name: editSectionName.trim() });
      setEditSectionName("");
      setEditSectionId(null);
      setIsEditSectionModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'section') {
      deleteSection.mutate(deleteTarget.id);
    } else {
      deleteDocument.mutate(deleteTarget.id);
    }
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!sections) return;
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
    } else if (direction === 'down' && index < newSections.length - 1) {
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;
    } else {
      return;
    }
    
    const updates = newSections.map((s, i) => ({ id: s.id, position: (i + 1) * 1024 }));
    reorderSections.mutate(updates);
  };

  const moveDocument = (sectionId: string, docIndex: number, direction: 'up' | 'down') => {
    if (!documents) return;
    const sectionDocs = documents.filter(d => d.section_id === sectionId).sort((a,b) => a.position - b.position);
    if (direction === 'up' && docIndex > 0) {
      const temp = sectionDocs[docIndex];
      sectionDocs[docIndex] = sectionDocs[docIndex - 1];
      sectionDocs[docIndex - 1] = temp;
    } else if (direction === 'down' && docIndex < sectionDocs.length - 1) {
      const temp = sectionDocs[docIndex];
      sectionDocs[docIndex] = sectionDocs[docIndex + 1];
      sectionDocs[docIndex + 1] = temp;
    } else {
      return;
    }

    const updates = sectionDocs.map((d, i) => ({ id: d.id, position: (i + 1) * 1024, sectionId }));
    reorderDocuments.mutate(updates);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen w-full overflow-hidden bg-[#FAFAFA]">
      {/* Secondary Sidebar for Notes */}
      <aside className="w-[300px] border-r border-neutral-200/60 bg-white flex flex-col h-full flex-shrink-0 relative z-10 shadow-sm">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-white">
          <h2 className="font-extrabold tracking-tight text-neutral-900 text-lg">Docs</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSectionModalOpen(true)} className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 rounded-lg">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-200">
          {sectionsLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            sections?.map((section, sIndex) => {
              const isExpanded = expandedSections[section.id];
              const sectionDocs = documents?.filter(d => d.section_id === section.id).sort((a,b) => a.position - b.position) || [];

              return (
                <div key={section.id} className="flex flex-col">
                  <div 
                    className="flex items-center justify-between group cursor-pointer mb-1"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md">
                        {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </Button>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 truncate group-hover:text-neutral-900 transition-colors">
                        {section.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700" 
                        onClick={(e) => { e.stopPropagation(); moveSection(sIndex, 'up'); }}
                        disabled={sIndex === 0}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700" 
                        onClick={(e) => { e.stopPropagation(); moveSection(sIndex, 'down'); }}
                        disabled={sIndex === sections.length - 1}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-md hover:bg-indigo-50 hover:text-indigo-600" 
                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(section.id); setIsDocModalOpen(true); }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditSectionId(section.id); setEditSectionName(section.name); setIsEditSectionModalOpen(true); }} className="rounded-lg">
                            <Edit2 className="w-4 h-4 mr-2" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: section.id, type: 'section', name: section.name }); setDeleteModalOpen(true); }} className="text-red-600 focus:text-red-700 rounded-lg">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col gap-0.5 overflow-hidden ml-2 border-l border-neutral-100 pl-2"
                      >
                        {sectionDocs.map((doc, dIndex, arr) => {
                          const isActive = pathname.includes(`/docs/${doc.id}`);
                          return (
                            <div key={doc.id} className="flex items-center justify-between group rounded-lg transition-colors">
                              <Link 
                                href={`/${workspaceId}/docs/${doc.id}`}
                                className={`flex items-center gap-2.5 flex-1 min-w-0 text-sm py-1.5 px-2 rounded-lg transition-colors ${
                                  isActive 
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                }`}
                              >
                                <FileText className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-neutral-400'}`} />
                                <span className="truncate">{doc.title}</span>
                              </Link>
                              
                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-0.5 pr-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700">
                                      <MoreHorizontal className="w-3.5 h-3.5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                    <DropdownMenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveDocument(section.id, dIndex, 'up'); }} disabled={dIndex === 0} className="rounded-lg">
                                      <ArrowUp className="w-4 h-4 mr-2" /> Move Up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveDocument(section.id, dIndex, 'down'); }} disabled={dIndex === arr.length - 1} className="rounded-lg">
                                      <ArrowDown className="w-4 h-4 mr-2" /> Move Down
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteTarget({ id: doc.id, type: 'document', name: doc.title }); setDeleteModalOpen(true); }} className="text-red-600 focus:text-red-700 rounded-lg">
                                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          );
                        })}
                        {sectionDocs.length === 0 && (
                          <div className="py-1 px-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs font-medium text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 justify-start w-full rounded-md"
                              onClick={() => { setSelectedSectionId(section.id); setIsDocModalOpen(true); }}
                            >
                              <Plus className="w-3 h-3 mr-1.5" /> Add page
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
          {sections?.length === 0 && !sectionsLoading && (
            <div className="text-center p-8 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 mt-4">
              <Folder className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-900 mb-1">No sections yet</p>
              <p className="text-xs text-neutral-500 mb-4">Create a section to organize your docs</p>
              <Button variant="default" size="sm" onClick={() => setIsSectionModalOpen(true)} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                Create Section
              </Button>
            </div>
          )}
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto bg-white z-20">
        {children}
      </main>

      {/* Modals */}
      <Dialog open={isSectionModalOpen} onOpenChange={setIsSectionModalOpen}>
        <DialogContent className="rounded-2xl border-neutral-200/60 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Create New Section</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Section Name" 
              value={sectionName} 
              onChange={(e) => setSectionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateSectionSubmit()}
              autoFocus
              className="rounded-xl border-neutral-200/60 focus-visible:ring-indigo-500"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSectionModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreateSectionSubmit} disabled={!sectionName.trim()} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">Create Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditSectionModalOpen} onOpenChange={setIsEditSectionModalOpen}>
        <DialogContent className="rounded-2xl border-neutral-200/60 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Rename Section</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Section Name" 
              value={editSectionName} 
              onChange={(e) => setEditSectionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEditSectionSubmit()}
              autoFocus
              className="rounded-xl border-neutral-200/60 focus-visible:ring-indigo-500"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditSectionModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleEditSectionSubmit} disabled={!editSectionName.trim()} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
        <DialogContent className="rounded-2xl border-neutral-200/60 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Create New Document</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Document Title" 
              value={docTitle} 
              onChange={(e) => setDocTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateDocSubmit()}
              autoFocus
              className="rounded-xl border-neutral-200/60 focus-visible:ring-indigo-500"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDocModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreateDocSubmit} disabled={!docTitle.trim()} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">Create Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteTarget?.type === 'section' ? 'Section' : 'Document'}`}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? ${deleteTarget?.type === 'section' ? 'This will also delete all documents inside this section.' : ''} This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteSection.isPending || deleteDocument.isPending}
      />
    </div>
  );
}
