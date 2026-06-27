import React, { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { listVersionsAction, createVersionAction, restoreVersionAction } from "@/features/document/actions";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import VersionViewerDialog from "./VersionViewerDialog";

export default function VersionHistoryPanel({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  const [restoreOpen, setRestoreOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  useEffect(() => {
    if (open) {
      fetchVersions();
    }
  }, [open, documentId]);

  const fetchVersions = async () => {
    setLoading(true);
    const res = await listVersionsAction(documentId);
    if (res.success) {
      setVersions(res.data || []);
    }
    setLoading(false);
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;
    const res = await restoreVersionAction({ documentId, versionId: selectedVersion.id });
    if (res.success) {
      toast.success("Version restored");
      setRestoreOpen(false);
      // Reload window to apply restored content via Yjs
      window.location.reload();
    } else {
      toast.error(res.error || "Failed to restore version");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col border-border bg-card">
          <SheetHeader className="mb-4">
            <SheetTitle>Version History</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto pr-4 space-y-6">
            {loading ? (
              <p className="text-sm text-muted-foreground ml-4">Loading versions...</p>
            ) : versions.length === 0 ? (
              <p className="text-sm text-muted-foreground ml-4">No versions found.</p>
            ) : (
              <div className="relative border-l border-border ml-3 pl-6 space-y-8 pb-8">
                {versions.map((v) => (
                  <div key={v.id} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-muted-foreground group-hover:border-primary transition-colors" />
                    <div className="p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground">{v.label || `Version ${v.version_number}`}</h4>
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          v{v.version_number}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        {format(new Date(v.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 text-xs font-medium"
                          onClick={() => {
                            setSelectedVersion(v);
                            setRestoreOpen(true);
                          }}
                        >
                          View & Restore
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <VersionViewerDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        version={selectedVersion}
        onRestore={handleRestore}
        isRestoring={isPending}
      />
    </>
  );
}
