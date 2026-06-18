import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VersionRestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: any;
  onConfirm: () => void;
  isRestoring: boolean;
}

export default function VersionRestoreDialog({
  open,
  onOpenChange,
  version,
  onConfirm,
  isRestoring,
}: VersionRestoreDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore to {version?.label}?</DialogTitle>
          <DialogDescription>
            This will overwrite the current document with the contents of this version. This action cannot be undone, though you can create a new version beforehand.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRestoring}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isRestoring}>
            {isRestoring ? "Restoring..." : "Restore Version"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
