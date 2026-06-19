import React from "react";
import { WifiOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineBanner({ isOffline }: { isOffline: boolean }) {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed top-6 left-1/2 z-[60] flex items-center gap-3 bg-neutral-900 text-neutral-50 px-4 py-2.5 rounded-full shadow-2xl border border-neutral-700/50 text-sm font-medium backdrop-blur-md"
        >
          <WifiOff className="w-4 h-4 text-neutral-400" />
          <span>Offline — changes saved locally</span>
          <div className="w-px h-4 bg-neutral-700 mx-1" />
          <span className="flex items-center text-neutral-400 text-xs">
            <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> Reconnecting
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
