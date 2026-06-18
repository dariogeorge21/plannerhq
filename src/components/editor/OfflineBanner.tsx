import React from "react";
import { WifiOff, Loader2 } from "lucide-react";

export default function OfflineBanner({ isOffline }: { isOffline: boolean }) {
  if (!isOffline) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-800 px-4 py-2 flex items-center justify-center text-sm font-medium">
      <WifiOff className="w-4 h-4 mr-2" />
      <span>You are offline — editing paused.</span>
      <span className="ml-2 flex items-center opacity-70 text-xs">
        <Loader2 className="w-3 h-3 animate-spin mr-1" /> Reconnecting...
      </span>
    </div>
  );
}
