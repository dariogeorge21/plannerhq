"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackAlertProps {
  title?: string
  message: string
  type?: "success" | "error" | "warning" | "info"
  isVisible: boolean
  onClose?: () => void
  className?: string
}

const icons = {
  success: <CheckCircle2 className="size-5 text-emerald-500" />,
  error: <XCircle className="size-5 text-destructive" />,
  warning: <AlertCircle className="size-5 text-amber-500" />,
  info: <Info className="size-5 text-blue-500" />
}

const backgrounds = {
  success: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900",
  error: "bg-destructive/10 border-destructive/20",
  warning: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900",
  info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
}

export function FeedbackAlert({
  title,
  message,
  type = "info",
  isVisible,
  onClose,
  className
}: FeedbackAlertProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "rounded-xl border p-4 shadow-sm backdrop-blur-sm",
            backgrounds[type],
            className
          )}
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">{icons[type]}</div>
            <div className="flex-1">
              {title && (
                <h5 className="mb-1 font-semibold leading-none tracking-tight">
                  {title}
                </h5>
              )}
              <div className="text-sm opacity-90">{message}</div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              >
                <XCircle className="size-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
