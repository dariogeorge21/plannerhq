"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldAlert } from "lucide-react"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border border-neutral-100 bg-white/95 backdrop-blur-md rounded-3xl p-8 text-center flex flex-col items-center">
        <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>

        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle className="text-xl font-extrabold text-neutral-950 tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-neutral-500 font-medium max-w-[280px] sm:max-w-none">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="w-full flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold py-2.5 transition-all cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 transition-all shadow-md shadow-red-600/10 cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
