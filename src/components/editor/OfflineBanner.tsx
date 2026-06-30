import React from "react";
import { WifiOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineBanner({ isOffline }: { isOffline: boolean }) {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          // Spring physics make the entrance feel snappy and premium
          initial={{ opacity: 0, y: -30, x: "-50%", scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            x: "-50%",
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 25 }
          }}
          exit={{
            opacity: 0,
            y: -20,
            x: "-50%",
            scale: 0.95,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          // Elevated dark-mode styling with a subtle radial gradient, glow, and border
          className="fixed top-6 left-1/2 z-[60] flex items-center gap-3 bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-100 px-5 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-neutral-800/80 text-sm font-medium backdrop-blur-xl select-none"
        >
          {/* Main Status Icon with a slight shake/pulse feeling via layout */}
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="tracking-wide">Offline</span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-neutral-800" />

          {/* Local State Message */}
          <span className="text-neutral-400 text-xs font-normal">
            Changes saved locally
          </span>

          {/* Divider */}
          <div className="w-px h-4 bg-neutral-800" />

          {/* Reconnecting Status with continuous subtle pulse */}
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex items-center text-amber-500/90 text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-semibold"
          >
            <Loader2 className="w-3 h-3 animate-spin mr-1.5 shrink-0" />
            Reconnecting
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}