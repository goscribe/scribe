"use client";

import { useState } from "react";
import { EditChannelInput } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChannelEditModal } from "./channel-edit-modal";
import { MoreHorizontal, Hash, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RouterOutputs } from '@goscribe/server';

type Channel = RouterOutputs['chat']['getChannels'][number];

interface ChannelListProps {
  channels: Channel[];
  selectedChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
  onChannelEdit: (input: EditChannelInput) => Promise<void>;
  onChannelDelete: (channelId: string) => Promise<void>;
}

export function ChannelList({
  channels,
  selectedChannelId,
  onChannelSelect,
  onChannelEdit,
  onChannelDelete,
}: ChannelListProps) {
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditChannel = (channel: Channel) => {
    setEditingChannel(channel);
    setShowEditModal(true);
  };

  const handleDeleteChannel = async (channelId: string) => {
    if (confirm("Are you sure you want to delete this channel? This action cannot be undone.")) {
      try {
        await onChannelDelete(channelId);
      } catch (error) {
        console.error("Failed to delete channel:", error);
      }
    }
  };

  const handleEditSubmit = async (input: EditChannelInput) => {
    try {
      await onChannelEdit(input);
      setShowEditModal(false);
      setEditingChannel(null);
    } catch (error) {
      console.error("Failed to edit channel:", error);
    }
  };

  if (channels.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <Hash className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No channels yet</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-2 space-y-1">
        {channels.map((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            isSelected={channel.id === selectedChannelId}
            onSelect={() => onChannelSelect(channel.id)}
            onEdit={() => handleEditChannel(channel)}
            onDelete={() => handleDeleteChannel(channel.id)}
          />
        ))}
      </div>

      {/* Channel Edit Modal */}
      {editingChannel && (
        <ChannelEditModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          channel={editingChannel}
          onEditChannel={handleEditSubmit}
        />
      )}
    </>
  );
}

interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ChannelItem({
  channel,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: ChannelItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted/50"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <Hash className="h-4 w-4 flex-shrink-0" />
        <span className="truncate font-medium text-sm">{channel.name}</span>
      </div>

      {/* Channel Actions */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Channel
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Channel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
