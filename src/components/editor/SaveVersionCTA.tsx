import React, { useState, useTransition } from "react";
import { Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createVersionAction } from "@/features/document/actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface SaveVersionCTAProps {
  documentId: string;
}

export default function SaveVersionCTA({ documentId }: SaveVersionCTAProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  
  const handleSave = async () => {
    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to save a version");
        return;
      }

      const res = await createVersionAction({ documentId, label: label || undefined }, user.id);
      if (res.success) {
        toast.success("Version saved successfully");
        setLabel("");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to save version");
      }
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm" className="h-8 gap-2 shadow-sm font-medium">
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save Version</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h4 className="font-medium text-sm leading-none">Save Document Version</h4>
            <p className="text-xs text-muted-foreground">
              Create a snapshot of this document to restore later.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="version-label"
              placeholder="Version name (optional)"
              className="h-8 text-sm"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isPending) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
            <Button size="sm" className="h-8 px-3" onClick={handleSave} disabled={isPending}>
              {isPending ? <Plus className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
