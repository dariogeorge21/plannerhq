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
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-border bg-muted/30">
        <h3 className="text-sm font-bold text-foreground">Permissions Reference</h3>
        <p className="text-xs text-muted-foreground mt-1">Review what each role can do within this workspace.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider w-[40%]">Capability</th>
              <th className="py-4 px-6 text-xs font-bold text-primary uppercase tracking-wider bg-primary/5 text-center">Owner</th>
              <th className="py-4 px-6 text-xs font-bold text-foreground uppercase tracking-wider bg-muted/10 text-center">Admin</th>
              <th className="py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Member</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {permissions.map((perm, idx) => (
              <tr key={idx} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-6 text-sm font-medium text-foreground">{perm.name}</td>
                <td className="py-3 px-6 text-center bg-primary/5">
                  {perm.owner ? <Check className="w-4 h-4 text-primary mx-auto" /> : <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                </td>
                <td className="py-3 px-6 text-center bg-muted/5">
                  {perm.admin ? <Check className="w-4 h-4 text-primary mx-auto" /> : <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                </td>
                <td className="py-3 px-6 text-center">
                  {perm.member ? <Check className="w-4 h-4 text-primary mx-auto" /> : <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
