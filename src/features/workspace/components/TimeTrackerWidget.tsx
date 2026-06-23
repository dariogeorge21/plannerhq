"use client";

import React from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimeTrackerWidgetProps {
    workspaceId: string;
}

export function TimeTrackerWidget({ workspaceId }: TimeTrackerWidgetProps) {
    const { formattedTime, isInitialized } = useTimeTracking({ workspaceId, syncIntervalSeconds: 30 });

    if (!isInitialized) {
        return null; // or a skeleton loader if preferred
    }

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50/80 border border-indigo-100 rounded-full text-indigo-700 shadow-sm backdrop-blur-sm transition-all hover:bg-indigo-100/80 hover:shadow"
            title="Time spent active in this workspace"
        >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-bold tracking-tight">{formattedTime}</span>
        </motion.div>
    );
}
