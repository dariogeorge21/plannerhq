// features/dashboard/components/HoverDropdown.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HoverDropdownProps {
  trigger: React.ReactNode;
  dropdown: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function HoverDropdown({ trigger, dropdown, align = 'center', className = '' }: HoverDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-pointer group">{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute top-full pt-2 z-50 min-w-[220px] ${
              align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
            }`}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="rounded-xl border border-neutral-200/50 bg-white/90 p-2 shadow-xl backdrop-blur-md dark:border-neutral-700/50 dark:bg-neutral-900/90 dark:shadow-2xl">
              {dropdown}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}