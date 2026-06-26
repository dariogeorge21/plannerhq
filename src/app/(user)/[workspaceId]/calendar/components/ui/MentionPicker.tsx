"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WorkspaceMemberOption } from "@/features/calendar/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MentionPickerProps {
  members: WorkspaceMemberOption[];
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
  mentionAll: boolean;
  onMentionAllChange: (mentionAll: boolean) => void;
  disabled?: boolean;
}

export function MentionPicker({
  members,
  selectedUserIds,
  onChange,
  mentionAll,
  onMentionAllChange,
  disabled
}: MentionPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (userId: string) => {
    if (mentionAll) return; // Disabled individual picking when mention all is checked

    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-3">
      {/* <div className="flex items-center space-x-2">
        <Switch
          id="mention-all"
          checked={mentionAll}
          onCheckedChange={(checked) => {
            onMentionAllChange(checked);
            if (checked) {
              onChange([]); // Clear individual selections
            }
          }}
          disabled={disabled}
        />
        <Label htmlFor="mention-all" className="cursor-pointer font-medium text-sm text-neutral-700">
          Mention all workspace members (@all)
        </Label>
      </div> */}

      {!mentionAll && (
        <div className="flex flex-col gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-auto min-h-10 border-neutral-200"
                disabled={disabled}
              >
                <div className="flex flex-wrap gap-1 py-1 text-left items-center">
                  {selectedUserIds.length === 0 ? (
                    <span className="text-neutral-500 font-normal">Select members to mention...</span>
                  ) : (
                    members
                      .filter((m) => selectedUserIds.includes(m.user_id))
                      .map((member) => (
                        <Badge variant="secondary" key={member.user_id} className="rounded-md px-1.5 py-0.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none font-medium">
                          <Avatar className="h-4 w-4 mr-1.5 inline-block">
                            <AvatarImage src={member.avatar_url || ""} />
                            <AvatarFallback className="text-[9px]">{getInitials(member.display_name)}</AvatarFallback>
                          </Avatar>
                          {member.display_name || member.email}
                        </Badge>
                      ))
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search members..." />
                <CommandList>
                  <CommandEmpty>No members found.</CommandEmpty>
                  <CommandGroup>
                    {members.map((member) => (
                      <CommandItem
                        key={member.user_id}
                        value={`${member.display_name} ${member.email} ${member.hqid}`}
                        onSelect={() => handleSelect(member.user_id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedUserIds.includes(member.user_id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={member.avatar_url || ""} />
                          <AvatarFallback className="text-[10px]">{getInitials(member.display_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{member.display_name || "Unknown"}</span>
                          <span className="text-xs text-neutral-500">{member.email}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
