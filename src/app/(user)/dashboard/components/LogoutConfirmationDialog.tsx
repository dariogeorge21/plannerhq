// features/dashboard/components/LogoutConfirmationDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LogoutConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
}

export function LogoutConfirmationDialog({ open, onOpenChange, onConfirm, isLoggingOut = false }: LogoutConfirmationDialogProps) {
  const router = useRouter();

  const handleConfirm = () => {
    onConfirm();
    router.push('/signin');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sorry to see you go</DialogTitle>
          <DialogDescription>
            You will be securely logged out of your account on this device. We hope to see you again soon!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoggingOut}>
            {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}