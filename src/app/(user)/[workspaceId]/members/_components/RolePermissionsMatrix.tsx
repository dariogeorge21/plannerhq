"use client";

import React from "react";
import { Check, Minus } from "lucide-react";

export default function RolePermissionsMatrix() {
  const permissions = [
    { name: "View Workspace Content", owner: true, admin: true, member: true },
    { name: "Create & Edit Tasks", owner: true, admin: true, member: true },
    { name: "Create & Edit Documents", owner: true, admin: true, member: true },
    { name: "Chat & Collaborate", owner: true, admin: true, member: true },
    { name: "Invite New Members", owner: true, admin: true, member: false },
    { name: "Remove Members", owner: true, admin: true, member: false },
    { name: "Change Member Roles", owner: true, admin: true, member: false },
    { name: "Manage Workspace Settings", owner: true, admin: true, member: false },
    { name: "Delete Workspace", owner: true, admin: false, member: false },
    { name: "Transfer Ownership", owner: true, admin: false, member: false },
  ];

  return (
    <div className="bg-white border border-neutral-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
        <h3 className="text-sm font-bold text-neutral-900">Permissions Reference</h3>
        <p className="text-xs text-neutral-500 mt-1">Review what each role can do within this workspace.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 bg-white">
              <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider w-[40%]">Capability</th>
              <th className="py-4 px-6 text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50/30 text-center">Owner</th>
              <th className="py-4 px-6 text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50/30 text-center">Admin</th>
              <th className="py-4 px-6 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Member</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {permissions.map((perm, idx) => (
              <tr key={idx} className="hover:bg-neutral-50/30 transition-colors">
                <td className="py-3 px-6 text-sm font-medium text-neutral-700">{perm.name}</td>
                <td className="py-3 px-6 text-center bg-indigo-50/10">
                  {perm.owner ? <Check className="w-4 h-4 text-indigo-600 mx-auto" /> : <Minus className="w-4 h-4 text-neutral-300 mx-auto" />}
                </td>
                <td className="py-3 px-6 text-center bg-purple-50/10">
                  {perm.admin ? <Check className="w-4 h-4 text-purple-600 mx-auto" /> : <Minus className="w-4 h-4 text-neutral-300 mx-auto" />}
                </td>
                <td className="py-3 px-6 text-center">
                  {perm.member ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Minus className="w-4 h-4 text-neutral-300 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
