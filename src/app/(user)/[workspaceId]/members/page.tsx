// src/app/(user)/[workspaceId]/members/page.tsx
"use client";

import React, { useEffect, useState, useTransition, use } from "react";
import { GetWorkspace, GetWorkspaceMembers, UpdateMemberRole } from "@/features/workspace/workspace";
import { 
  RemoveUserFromWorkspace, 
  InviteUserToWorkspaceByEmail, 
  InviteUserToWorkspaceByHqid,
} from "@/features/workspace/invites";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Loader2, 
  UserPlus, 
  Trash2, 
  Mail, 
  Hash,
  ShieldCheck,
  MoreHorizontal
} from "lucide-react";
import { Workspace, WorkspaceMember } from "@/types/workspace";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function WorkspaceMembersPage({
  params: paramsPromise,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const params = use(paramsPromise);
  const workspaceId = params.workspaceId;
  const { user } = useSession();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Invite state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<"email" | "hqid">("email");
  const [inviteValue, setInviteValue] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isInvitePending, startInviteTransition] = useTransition();

  const loadData = async () => {
    try {
      const [wsRes, memRes] = await Promise.all([
        GetWorkspace(workspaceId),
        GetWorkspaceMembers(workspaceId)
      ]);
      if (wsRes.success && wsRes.data) setWorkspace(wsRes.data);
      if (memRes.success && memRes.data) {
        setMembers(memRes.data);
        if (user) {
          const currentMem = memRes.data.find(m => m.user_id === user.id);
          if (currentMem) setCurrentUserRole(currentMem.role);
        }
      }
    } catch (err) {
      toast.error("Failed to load members data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [workspaceId, user]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteValue.trim()) return toast.error("Value required");
    
    startInviteTransition(async () => {
      const formData = new FormData();
      formData.append("workspaceId", workspaceId);
      formData.append("role", inviteRole);
      
      let res;
      if (inviteMethod === "email") {
        formData.append("email", inviteValue);
        res = await InviteUserToWorkspaceByEmail(formData);
      } else {
        formData.append("hqid", inviteValue);
        res = await InviteUserToWorkspaceByHqid(formData);
      }

      if (res.success) {
        toast.success(res.message);
        setIsInviteOpen(false);
        setInviteValue("");
      } else {
        toast.error(res.message || "Failed to invite");
      }
    });
  };

  const handleUpdateRole = async (targetUserId: string, newRole: string) => {
    const formData = new FormData();
    formData.append("workspaceId", workspaceId);
    formData.append("targetUserId", targetUserId);
    formData.append("newRole", newRole);
    
    const res = await UpdateMemberRole(formData);
    if (res.success) {
      toast.success("Role updated");
      loadData();
    } else toast.error(res.message);
  };

  const handleRemoveMember = async (targetUserId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    const formData = new FormData();
    formData.append("workspaceId", workspaceId);
    formData.append("targetUserId", targetUserId);
    
    const res = await RemoveUserFromWorkspace(formData);
    if (res.success) {
      toast.success("Member removed");
      loadData();
    } else toast.error(res.message);
  };

  if (loading || !workspace) return <div className="flex h-[60vh] justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  const hasAdminPrivilege = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">Workspace Members</h1>
          <p className="text-neutral-500 mt-2 font-medium">Manage who has access to {workspace.name} and their roles.</p>
        </div>
        {hasAdminPrivilege && (
          <Button onClick={() => setIsInviteOpen(true)} className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm h-10 px-5 font-semibold">
            <UserPlus className="w-4 h-4 mr-2" /> Invite Member
          </Button>
        )}
      </div>

      <div className="bg-white border border-neutral-200/60 rounded-3xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow className="border-neutral-100 hover:bg-transparent">
              <TableHead className="w-[300px] font-semibold text-neutral-500 pl-6 uppercase text-xs tracking-wider">Member</TableHead>
              <TableHead className="font-semibold text-neutral-500 uppercase text-xs tracking-wider">Access Role</TableHead>
              <TableHead className="font-semibold text-neutral-500 uppercase text-xs tracking-wider">Joined Date</TableHead>
              {hasAdminPrivilege && <TableHead className="text-right pr-6 uppercase text-xs tracking-wider">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => {
              const isSelf = member.user_id === user?.id;
              const canEditRole = hasAdminPrivilege && !isSelf && member.role !== 'owner';
              const canRemove = hasAdminPrivilege && !isSelf && member.role !== 'owner';

              return (
                <TableRow key={member.user_id} className="border-neutral-100 hover:bg-neutral-50/30">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {member.display_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 flex items-center gap-2">
                          {member.display_name} 
                          {isSelf && <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] text-neutral-500 uppercase tracking-wider font-bold">You</span>}
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {canEditRole ? (
                      <Select defaultValue={member.role} onValueChange={(val) => handleUpdateRole(member.user_id, val)}>
                        <SelectTrigger className="w-[130px] h-8 text-xs font-bold uppercase tracking-wider rounded-lg border-neutral-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin" className="text-xs font-bold uppercase">Admin</SelectItem>
                          <SelectItem value="member" className="text-xs font-bold uppercase">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        member.role === 'owner' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        member.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-neutral-50 text-neutral-600 border-neutral-200'
                      }`}>
                        {member.role === 'owner' && <ShieldCheck className="w-3 h-3 mr-1" />}
                        {member.role}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-neutral-500">
                    {new Date(member.joined_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  {hasAdminPrivilege && (
                    <TableCell className="text-right pr-6">
                      {canRemove && (
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-400 hover:text-neutral-900">
                               <MoreHorizontal className="w-4 h-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-40 rounded-xl">
                             <DropdownMenuItem onClick={() => handleRemoveMember(member.user_id)} className="text-red-600 focus:text-red-700 focus:bg-red-50 font-semibold cursor-pointer">
                               <Trash2 className="w-4 h-4 mr-2" /> Remove
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-neutral-200 rounded-3xl">
          <div className="p-6 md:p-8 pb-4">
            <DialogTitle className="text-xl font-bold text-neutral-900">Invite New Member</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-neutral-500">Add someone to {workspace?.name} to start collaborating.</DialogDescription>
          </div>
          <form onSubmit={handleInvite}>
            <div className="px-6 md:px-8 pb-8 space-y-5">
              <div className="flex bg-neutral-100 p-1 rounded-xl">
                <button type="button" onClick={() => setInviteMethod("email")} className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${inviteMethod === 'email' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Email Address</button>
                <button type="button" onClick={() => setInviteMethod("hqid")} className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${inviteMethod === 'hqid' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>PlannerHQ ID</button>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{inviteMethod === "email" ? "Email Address" : "User HQID"}</Label>
                <div className="relative">
                  {inviteMethod === "email" ? <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" /> : <Hash className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />}
                  <Input 
                    value={inviteValue} 
                    onChange={e => setInviteValue(e.target.value)} 
                    placeholder={inviteMethod === "email" ? "colleague@acme.com" : "HQ-XXXX-XXXX"} 
                    className="pl-9 rounded-xl border-neutral-300 focus-visible:ring-indigo-500" 
                    disabled={isInvitePending} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Assign Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole} disabled={isInvitePending}>
                  <SelectTrigger className="rounded-xl border-neutral-300 focus:ring-indigo-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="member">Member - Can chat & collaborate</SelectItem>
                    <SelectItem value="admin">Admin - Can manage workspace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3">
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)} disabled={isInvitePending} className="flex-1 rounded-xl border-neutral-300 font-semibold">Cancel</Button>
              <Button type="submit" disabled={isInvitePending} className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm">
                {isInvitePending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invitation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}