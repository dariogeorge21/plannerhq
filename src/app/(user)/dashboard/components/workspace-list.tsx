// src/app/(user)/dashboard/_components/workspaces-list.tsx
"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MOCK_WORKSPACES } from "@/data/mock-dashboard";
import { FileEdit, Trash2, Archive, Plus } from "lucide-react";

export function WorkspacesList() {
  if (MOCK_WORKSPACES.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/10">
        <h3 className="mt-4 text-lg font-semibold">No workspaces found</h3>
        <p className="mb-4 text-sm text-muted-foreground">Get started by creating your first workspace.</p>
        <Button><Plus className="w-4 h-4 mr-2" /> Create Workspace</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent Workspaces</h2>
        <Button><Plus className="w-4 h-4 mr-2" /> New Workspace</Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">S.No</TableHead>
              <TableHead>Workspace Name</TableHead>
              <TableHead>Last Accessed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_WORKSPACES.map((ws, index) => (
              <TableRow key={ws.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{ws.name}</TableCell>
                <TableCell>{new Date(ws.lastAccessed).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><FileEdit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Archive className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}