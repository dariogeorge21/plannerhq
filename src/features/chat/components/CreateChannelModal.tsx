import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { HashIcon, LockIcon } from "lucide-react";

interface CreateChannelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceMembers: any[];
  currentUserId: string | null;
  createChannel: (name: string, description?: string, isPrivate?: boolean, memberIds?: string[]) => Promise<{ success: boolean; error?: string }>;
}

export function CreateChannelModal({ open, onOpenChange, workspaceMembers, currentUserId, createChannel }: CreateChannelModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otherMembers = workspaceMembers.filter(m => m.user_id !== currentUserId);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Channel name is required");
      return;
    }
    setLoading(true);
    setError("");

    const result = await createChannel(name, description, isPrivate, selectedMembers);
    if (result.success) {
      onOpenChange(false);
      setName("");
      setDescription("");
      setIsPrivate(false);
      setSelectedMembers([]);
    } else {
      setError(result.error || "Failed to create channel");
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
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Channels are where your team communicates.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <HashIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="e.g. project-updates"
                className="pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between border rounded-lg p-3 mt-2">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <LockIcon className="w-4 h-4" />
                Make private
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Only specific people can view and join this channel.
              </p>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>

          {isPrivate && (
            <div className="space-y-2 mt-2">
              <Label>Select Members</Label>
              <ScrollArea className="h-[140px] border rounded-md p-2">
                {otherMembers.map((member) => (
                  <div key={member.user_id} className="flex items-center space-x-2 py-2">
                    <Checkbox 
                      id={`member-${member.user_id}`} 
                      checked={selectedMembers.includes(member.user_id)}
                      onCheckedChange={() => toggleMember(member.user_id)}
                    />
                    <label
                      htmlFor={`member-${member.user_id}`}
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
          )}

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
