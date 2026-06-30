"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquareIcon,
  SquareKanban,
  CalendarDays,
  FolderOpen,
  Users,
  Settings,
} from "lucide-react";

const navLinks = [
  { name: "Overview", href: "", icon: LayoutDashboard, exact: true },
  { name: "Notes", href: "/docs", icon: FileText, exact: false },
  { name: "Chat", href: "/chat", icon: MessageSquareIcon, exact: false },
  { name: "Tasks", href: "/tasks", icon: SquareKanban, exact: false },
  { name: "Calendar", href: "/calendar", icon: CalendarDays, exact: false },
  { name: "Files", href: "/files", icon: FolderOpen, exact: false },
  { name: "Members", href: "/members", icon: Users, exact: false },
  { name: "Settings", href: "/settings", icon: Settings, exact: false },
];

export function NavigationMatrix({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
      {navLinks.map((link) => {
        const fullHref = `/${workspaceId}${link.href}`;
        const isActive = link.exact ? pathname === fullHref : pathname.startsWith(fullHref);
        
        return (
          <Link key={link.name} href={fullHref} className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-card border hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-md transition-all duration-300 group ${isActive ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-background border-transparent' : 'border-neutral-200/60 dark:border-neutral-800'}`}>
             <link.icon className={`w-6 h-6 mb-2 transition-colors ${isActive ? 'text-indigo-500' : 'text-muted-foreground group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`} />
             <span className={`text-xs font-bold tracking-wide transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground group-hover:text-foreground'}`}>{link.name}</span>
          </Link>
        )
      })}
    </div>
  );
}
