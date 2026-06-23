"use client";

import React from "react";
import { Users, UserCheck, Mail, ShieldCheck } from "lucide-react";

interface MembersOverviewCardsProps {
  totalMembers: number;
  activeToday: number;
  pendingInvites: number;
  adminCount: number;
}

export default function MembersOverviewCards({
  totalMembers,
  activeToday,
  pendingInvites,
  adminCount
}: MembersOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Members */}
      <div className="bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-sm flex flex-col relative overflow-hidden group hover:border-neutral-300 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Users className="w-16 h-16 text-indigo-600" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Total Members</span>
        </div>
        <div className="text-4xl font-extrabold text-neutral-900 tracking-tight">{totalMembers}</div>
      </div>

      {/* Active Today */}
      <div className="bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-sm flex flex-col relative overflow-hidden group hover:border-neutral-300 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <UserCheck className="w-16 h-16 text-emerald-600" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Active Today</span>
        </div>
        <div className="text-4xl font-extrabold text-neutral-900 tracking-tight">{activeToday}</div>
      </div>

      {/* Pending Invites */}
      <div className="bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-sm flex flex-col relative overflow-hidden group hover:border-neutral-300 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Mail className="w-16 h-16 text-amber-600" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Pending Invites</span>
        </div>
        <div className="text-4xl font-extrabold text-neutral-900 tracking-tight">{pendingInvites}</div>
      </div>

      {/* Admin Count */}
      <div className="bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-sm flex flex-col relative overflow-hidden group hover:border-neutral-300 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldCheck className="w-16 h-16 text-purple-600" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Admins & Owners</span>
        </div>
        <div className="text-4xl font-extrabold text-neutral-900 tracking-tight">{adminCount}</div>
      </div>
    </div>
  );
}
