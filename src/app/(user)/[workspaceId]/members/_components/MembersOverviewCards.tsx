"use client";

import React from "react";
import { Users, UserCheck, Mail, ShieldCheck } from "lucide-react";

interface MembersOverviewCardsProps {
  totalMembers: number;
  activeToday: number;
  pendingInvites: number;
  adminCount: number;
}

export default function MembersOverviewCards({ totalMembers, activeToday, pendingInvites, adminCount }: MembersOverviewCardsProps) {
  const cards = [
    { title: "Total Members", value: totalMembers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Today", value: activeToday, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Pending Invites", value: pendingInvites, icon: Mail, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Workspace Admins", value: adminCount, icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col relative overflow-hidden">
          {/* Subtle Background Graphic */}
          <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <card.icon className={`w-32 h-32 ${card.color}`} />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{card.title}</span>
          </div>
          <div className="text-3xl font-extrabold text-foreground tracking-tight">{card.value}</div>
        </div>
      ))}
    </div>
  );
}