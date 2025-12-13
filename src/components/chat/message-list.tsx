"use client";

import { useState, useRef, useEffect } from "react";
import { EditMessageInput } from "@/hooks/use-chat";
import { MessageItem } from "./message-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { RouterOutputs } from '@goscribe/server';
import { useSession } from '@/lib/useSession';

type ChatMessage = RouterOutputs['chat']['getChannel']['chats'][number];

interface MessageListProps {
  messages: ChatMessage[];
  onEditMessage: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
}

interface GroupedMessages {
  date: string;
  messages: ChatMessage[];
}

export function MessageList({
  messages,
  onEditMessage,
  onDeleteMessage,
}: MessageListProps) {
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessages[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  // Group messages by date
  useEffect(() => {
    const grouped = messages.reduce((groups: GroupedMessages[], message) => {
      const date = new Date(message.createdAt).toDateString();
      const existingGroup = groups.find(group => group.date === date);
      
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({
          date,
          messages: [message],
        });
      }
      
      return groups;
    }, []);

    // Sort messages within each group by creation time
    grouped.forEach(group => {
      group.messages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    setGroupedMessages(grouped);
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      if (scrollAreaRef.current) {
        // Find the viewport element inside the ScrollArea
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (viewport) {
          // Scroll to bottom smoothly
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  }, [messages, groupedMessages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
          <p className="text-muted-foreground">
            Be the first to start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
      <div className="p-4 space-y-1">
        {groupedMessages.map((group) => (
          <div key={group.date} className="space-y-4">
            {/* Date Separator */}
            <div className="flex items-center justify-center">
              <div className="bg-muted px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-muted-foreground">
                  {formatDate(group.date)}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-2">
              {group.messages.map((message, index) => {
                const previousMessage = index > 0 ? group.messages[index - 1] : null;
                const isOwnMessage = message.userId === session?.user?.id;
                const previousIsOwnMessage = previousMessage ? previousMessage.userId === session?.user?.id : null;
                
                // Show header if:
                // 1. First message in group
                // 2. Different user than previous message
                // 3. More than 5 minutes apart
                // 4. Different message ownership (own vs others)
                const showHeader = !previousMessage || 
                  previousMessage.userId !== message.userId ||
                  new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() > 5 * 60 * 1000 ||
                  isOwnMessage !== previousIsOwnMessage;

                return (
                  <MessageItem
                    key={index}
                    message={message}
                    showHeader={showHeader}
                    onEditMessage={onEditMessage}
                    onDeleteMessage={onDeleteMessage}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
