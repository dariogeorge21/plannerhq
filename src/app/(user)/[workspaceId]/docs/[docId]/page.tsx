import React from "react";
import DocumentEditor from "@/components/editor/DocumentEditor";

export default async function DocumentPage({ 
  params 
}: { 
  params: Promise<{ workspaceId: string, docId: string }> 
}) {
  const resolvedParams = await params;
  return (
    <DocumentEditor 
      workspaceId={resolvedParams.workspaceId} 
      documentId={resolvedParams.docId} 
    />
  );
}
