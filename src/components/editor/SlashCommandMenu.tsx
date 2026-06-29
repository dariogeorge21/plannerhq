"use client";

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { CommandItem, COMMAND_GROUPS } from "@/lib/editor/slash-commands";

interface SlashCommandMenuProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

const GROUP_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  ai: { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20" },
  text: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  lists: { bg: "bg-sky-500/10", text: "text-sky-500", border: "border-sky-500/20" },
  advanced: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
};

export const SlashCommandMenu = forwardRef<
  { onKeyDown: (props: { event: KeyboardEvent }) => boolean },
  SlashCommandMenuProps
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  // Scroll selected item into view
  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) =>
          (prev - 1 + props.items.length) % props.items.length
        );
        return true;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % props.items.length);
        return true;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        selectItem(selectedIndex);
        return true;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % props.items.length);
        return true;
      }
      return false;
    },
  }));

  if (!props.items.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="z-50 w-72 rounded-xl border border-border bg-popover backdrop-blur-xl shadow-2xl shadow-black/10 p-4 text-center"
      >
        <Search className="w-5 h-5 text-muted-foreground mx-auto mb-1.5" />
        <p className="text-sm text-muted-foreground">No results found</p>
      </motion.div>
    );
  }

  // Group items by category
  const grouped = COMMAND_GROUPS.map((group) => ({
    ...group,
    items: props.items
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => item.group === group.key),
  })).filter((g) => g.items.length > 0);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="z-50 w-80 rounded-2xl border border-border bg-popover backdrop-blur-xl shadow-2xl shadow-black/15 overflow-hidden flex flex-col"
      style={{ maxHeight: "380px" }}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border flex items-center gap-2 bg-muted/30">
        <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center shadow-sm">
          <span className="text-primary-foreground text-[10px] font-bold leading-none">/</span>
        </div>
        <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
          Commands
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground bg-accent rounded px-1.5 py-0.5 font-medium">
          ↑↓ navigate · ↵ select
        </span>
      </div>

      {/* Items */}
      <div className="overflow-y-auto flex-1 p-1.5 space-y-0.5">
        {grouped.map((group) => (
          <div key={group.key}>
            <div className="px-2 py-1.5 flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  GROUP_COLORS[group.key]?.text ?? "text-muted-foreground"
                }`}
              >
                {group.label}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {group.items.map(({ item, originalIndex }) => {
              const colors = GROUP_COLORS[item.group] ?? GROUP_COLORS.text;
              const isSelected = originalIndex === selectedIndex;

              return (
                <button
                  key={originalIndex}
                  ref={(el) => { itemRefs.current[originalIndex] = el; }}
                  onClick={() => selectItem(originalIndex)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left text-sm transition-all duration-100 group ${
                    isSelected
                      ? "bg-primary/10 shadow-sm"
                      : "hover:bg-accent"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg border shadow-sm shrink-0 transition-all duration-100 ${
                      isSelected
                        ? `${colors.bg} ${colors.border} ${colors.text}`
                        : "bg-background border-border text-muted-foreground group-hover:border-primary/50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-medium leading-none mb-0.5 ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`text-xs truncate ${
                        isSelected ? "text-primary/80" : "text-muted-foreground"
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="slash-selection-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-border bg-muted/30">
        <p className="text-[10px] text-muted-foreground">
          Type to filter · <kbd className="font-mono bg-accent rounded px-1 py-px text-foreground">Esc</kbd> to close
        </p>
      </div>
    </motion.div>
  );
});

SlashCommandMenu.displayName = "SlashCommandMenu";
