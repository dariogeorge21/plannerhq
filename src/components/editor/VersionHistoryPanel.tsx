import React, { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { listVersionsAction, createVersionAction, restoreVersionAction } from "@/features/document/actions";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";
import VersionRestoreDialog from "./VersionRestoreDialog";

export default function VersionHistoryPanel({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const supabase = useSupabase();
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

  const handleCreateVersion = async () => {
    if (!user) return;
    const label = newLabel || undefined;
    const res = await createVersionAction({ documentId, label }, user.id);
    if (res.success) {
      toast.success("Version created");
      setNewLabel("");
      fetchVersions();
    } else {
      toast.error(res.error || "Failed to create version");
    }
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
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
          <SheetHeader>
            <SheetTitle>Version History</SheetTitle>
          </SheetHeader>
          
          <div className="flex items-center gap-2 mt-6 mb-4">
            <Input 
              placeholder="Version label (optional)" 
              value={newLabel} 
              onChange={(e) => setNewLabel(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreateVersion} disabled={isPending}>
              <Plus className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 space-y-4">
            {loading ? (
              <p className="text-sm text-neutral-500">Loading versions...</p>
            ) : versions.length === 0 ? (
              <p className="text-sm text-neutral-500">No versions found.</p>
            ) : (
              versions.map((v) => (
                <div key={v.id} className="p-3 border rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-neutral-900">{v.label || `Version ${v.version_number}`}</h4>
                    <span className="text-xs font-mono text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">
                      v{v.version_number}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {format(new Date(v.created_at), "MMM d, yyyy h:mm a")}
                  </p>
                  <div className="flex justify-end mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => {
                        setSelectedVersion(v);
                        setRestoreOpen(true);
                      }}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <VersionRestoreDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        version={selectedVersion}
        onConfirm={handleRestore}
        isRestoring={isPending}
      />
    </>
  );
}
