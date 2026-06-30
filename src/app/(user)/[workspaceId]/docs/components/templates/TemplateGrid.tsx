"use client";

import React from "react";
import { Zap } from "lucide-react";
import { Section, Document } from "@/features/document/types";
import { useTemplateCreator } from "../../hooks/useTemplateCreator";
import BlankDocumentTemplate from "./BlankDocumentTemplate";
import MeetingNotesTemplate from "./MeetingNotesTemplate";
import ProductSpecTemplate from "./ProductSpecTemplate";
import TemplateGeneratingModal from "./TemplateGeneratingModal";

interface TemplateGridProps {
  workspaceId: string;
  sections: Section[] | undefined;
  documents: Document[] | undefined;
}

export default function TemplateGrid({
  workspaceId,
  sections,
  documents,
}: TemplateGridProps) {
  const { isGenerating, activeTemplate, createFromTemplate } = useTemplateCreator({
    workspaceId,
    sections,
    documents,
  });

  return (
    <>
      {/* ── Section header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Quick Start
        </h2>
      </div>

      {/* ── Template cards grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BlankDocumentTemplate
          onClick={() => createFromTemplate("blank")}
          disabled={isGenerating}
        />
        <MeetingNotesTemplate
          onClick={() => createFromTemplate("meeting")}
          disabled={isGenerating}
        />
        <ProductSpecTemplate
          onClick={() => createFromTemplate("prd")}
          disabled={isGenerating}
        />
      </div>

      {/* ── Generating modal ───────────────────────────────────────────────── */}
      <TemplateGeneratingModal
        isOpen={isGenerating}
        templateId={activeTemplate}
      />
    </>
  );
}
