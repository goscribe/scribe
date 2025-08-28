"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RouterOutputs } from '@goscribe/server';
import { useSession } from '@/lib/useSession';

type ChatMessage = RouterOutputs['chat']['getChannel']['chats'][number];

interface MessageItemProps {
  message: ChatMessage;
  showHeader: boolean;
  onEditMessage: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
  profilePicture?: string;
}

export function MessageItem({
  message,
  showHeader,
  onEditMessage,
  onDeleteMessage,
  profilePicture,
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.message);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleEdit = () => {
    setEditContent(message.message);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editContent.trim() === message.message) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await onEditMessage(message.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditContent(message.message);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await onDeleteMessage(message.id);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    }
  };

  const formatTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserProfilePicture = () => {
    if (profilePicture) {
      return profilePicture;
    }
    if (message.user?.image) {
      return message.user.image;
    }
    return '';
  };

  const userProfilePicture = getUserProfilePicture();
  const isOwnMessage = message.userId === session?.user?.id;

  return (
    <div className={cn(
      "group flex items-start gap-3 hover:bg-muted/50 rounded-lg p-2 transition-colors",
      showHeader && "mt-4",
      isOwnMessage && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showHeader ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfilePicture} alt={message.user?.name || 'Unknown'} />
            <AvatarFallback className="text-xs">
              {getInitials(message.user?.name || 'UK')}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
          </div>
        )}
      </div>

      {/* Message Content and Actions Container */}
      <div className={cn(
        "flex-1 min-w-0",
        isOwnMessage && "flex flex-col items-end"
      )}>
        {/* Message Header */}
        {showHeader && (
          <div className={cn(
            "flex items-center gap-2 mb-1",
            isOwnMessage && "flex-row-reverse"
          )}>
            <span className="font-medium text-sm">{message.user?.name || 'Unknown User'}</span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
            {message.updatedAt.toLocaleString() != message.createdAt.toLocaleString() && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
        )}

        {/* Message Body and Actions Row */}
        <div className={cn(
          "flex items-end gap-2",
          isOwnMessage && "flex-row-reverse"
        )}>
          {/* Message Actions - Only show for own messages */}
          {isOwnMessage && (
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Message Body */}
          <div className="relative">
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[60px] resize-none"
                  placeholder="Edit your message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSave();
                    } else if (e.key === "Escape") {
                      handleCancel();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSubmitting || !editContent.trim()}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className={cn(
                "text-sm leading-relaxed break-words rounded-lg px-3 py-2 max-w-xs lg:max-w-md",
                isOwnMessage 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}>
                {message.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
