import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Channel } from "../types";
import { createClient } from "@/lib/supabase/client";

interface EditChannelMembersModalProps {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceMembers: any[];
  currentUserId: string | null;
  updateChannelMembers: (channelId: string, addedIds: string[], removedIds: string[]) => Promise<{ success: boolean; error?: string }>;
}

export function EditChannelMembersModal({ channel, open, onOpenChange, workspaceMembers, currentUserId, updateChannelMembers }: EditChannelMembersModalProps) {
  const [initialMembers, setInitialMembers] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const otherMembers = workspaceMembers.filter(m => m.user_id !== currentUserId);

  useEffect(() => {
    if (open && channel) {
      setLoading(true);
      // Fetch current members
      supabase.from('chat_channel_members')
        .select('user_id')
        .eq('channel_id', channel.id)
        .then(({ data, error }) => {
          if (!error && data) {
            const memberIds = data.map(d => d.user_id);
            setInitialMembers(memberIds);
            setSelectedMembers(memberIds.filter(id => id !== currentUserId));
          }
          setLoading(false);
        });
    }
  }, [open, channel, supabase, currentUserId]);

  const handleSave = async () => {
    if (!channel) return;
    setLoading(true);
    setError("");

    // Calculate added and removed
    const added = selectedMembers.filter(id => !initialMembers.includes(id));
    const removed = initialMembers.filter(id => id !== currentUserId && !selectedMembers.includes(id));

    if (added.length === 0 && removed.length === 0) {
      onOpenChange(false);
      setLoading(false);
      return;
    }

    const result = await updateChannelMembers(channel.id, added, removed);
    if (result.success) {
      onOpenChange(false);
    } else {
      setError(result.error || "Failed to update members");
    }
    setLoading(false);
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Members: {channel?.name}</DialogTitle>
          <DialogDescription>
            Manage who has access to this private channel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2 mt-2">
            <ScrollArea className="h-[200px] border rounded-md p-2">
              {loading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Loading members...</div>
              ) : otherMembers.map((member) => (
                <div key={member.user_id} className="flex items-center space-x-2 py-2">
                  <Checkbox 
                    id={`edit-member-${member.user_id}`} 
                    checked={selectedMembers.includes(member.user_id)}
                    onCheckedChange={() => toggleMember(member.user_id)}
                  />
                  <label
                    htmlFor={`edit-member-${member.user_id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                  >
                    {member.avatar_url ? (
                      <img src={member.avatar_url} className="w-6 h-6 rounded-full" alt="" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px]">
                        {member.display_name?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    {member.display_name}
                  </label>
                </div>
              ))}
            </ScrollArea>
          </div>
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
