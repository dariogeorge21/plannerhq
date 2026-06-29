"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GetUserProfileOverview } from "@/features/dashboard/services";

export function LoadingScreen({ 
  children,
  messages = [
    "Connecting to your workspace...",
    "Syncing data...",
    "Loading content...",
    "Organising information...",
  ],
  fullScreen = true
}: { 
  children: React.ReactNode,
  messages?: string[],
  fullScreen?: boolean
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  const { data: profileRes } = useQuery({
    queryKey: ["userProfileOverview"],
    queryFn: () => GetUserProfileOverview(),
    staleTime: 1000 * 60 * 5,
  });

  const userName = profileRes?.data?.displayName;

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className={`relative w-full h-full flex flex-col animate-in fade-in duration-700 ${fullScreen ? 'min-h-[50vh]' : ''}`}>
      {/* Personalized Greeting */}
      {userName && fullScreen && (
        <div className="absolute top-4 right-4 md:top-6 md:right-8 text-sm text-muted-foreground/30 font-medium z-10 pointer-events-none select-none transition-opacity duration-1000">
          Welcome back, {userName}
        </div>
      )}
      
      {/* Skeleton Content */}
      <div className="flex-1 w-full opacity-80 transition-opacity duration-1000">
        {children}
      </div>

      {/* Rotating Status Message */}
      <div className={`${fullScreen ? 'fixed bottom-6 right-6 md:bottom-8 md:right-8' : 'absolute bottom-4 right-4'} z-50 pointer-events-none select-none`}>
        <div className="flex items-center gap-3 bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg px-5 py-2.5 rounded-full transition-all duration-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <div className="overflow-hidden h-5 flex items-center min-w-[160px]">
             <AnimatePresence mode="wait">
               <motion.p
                 key={messageIndex}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.4, ease: "easeInOut" }}
                 className="text-sm font-semibold text-foreground/80 whitespace-nowrap"
               >
                 {messages[messageIndex]}
               </motion.p>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
