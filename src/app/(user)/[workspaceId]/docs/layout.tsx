"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
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
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
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
    const sectionDocs = documents.filter(d => d.section_id === sectionId);
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
            sections?.map((section, sIndex) => (
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
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-0.5">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700" 
                      onClick={(e) => { e.stopPropagation(); moveSection(sIndex, 'up'); }}
                      disabled={sIndex === 0}
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700" 
                      onClick={(e) => { e.stopPropagation(); moveSection(sIndex, 'down'); }}
                      disabled={sIndex === sections.length - 1}
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600" 
                      onClick={(e) => { e.stopPropagation(); setSelectedSectionId(section.id); setIsDocModalOpen(true); }}
                      title="New Document"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditSectionId(section.id); setEditSectionName(section.name); setIsEditSectionModalOpen(true); }}>
                          <Edit2 className="w-4 h-4 mr-2" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: section.id, type: 'section', name: section.name }); setDeleteModalOpen(true); }} className="text-red-600 focus:text-red-700">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedSections[section.id] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-5 border-l border-neutral-200 pl-3 mt-1 space-y-0.5 overflow-hidden"
                    >
                      {documents?.filter(d => d.section_id === section.id).map((doc, dIndex, arr) => (
                        <div key={doc.id} className="flex items-center justify-between group p-1.5 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Link 
                            href={`/${workspaceId}/docs/${doc.id}`}
                            className="flex items-center gap-2.5 flex-1 min-w-0 text-sm text-neutral-600 group-hover:text-indigo-700"
                          >
                            <FileText className="w-4 h-4 text-neutral-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                            <span className="truncate">{doc.title}</span>
                          </Link>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-0.5">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-md hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700" 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveDocument(section.id, dIndex, 'up'); }}
                              disabled={dIndex === 0}
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-md hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700" 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveDocument(section.id, dIndex, 'down'); }}
                              disabled={dIndex === arr.length - 1}
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600" 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteTarget({ id: doc.id, type: 'document', name: doc.title }); setDeleteModalOpen(true); }}
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
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
      
      <Dialog open={isEditSectionModalOpen} onOpenChange={setIsEditSectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Section</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Section Name" 
              value={editSectionName} 
              onChange={(e) => setEditSectionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEditSectionSubmit()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditSectionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSectionSubmit} disabled={!editSectionName.trim()}>Save</Button>
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
