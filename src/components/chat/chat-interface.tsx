"use client";

import { useState, useRef, useEffect } from "react";
import { SendMessageInput, EditMessageInput } from "@/hooks/use-chat";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { RouterOutputs } from '@goscribe/server';

type Channel = RouterOutputs['chat']['getChannel'];
type ChatMessage = RouterOutputs['chat']['getChannel']['chats'][number];

interface ChatInterfaceProps {
  channel: Channel;
  messages: ChatMessage[];
  onSendMessage: (input: SendMessageInput) => Promise<void>;
  onEditMessage: (input: EditMessageInput) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
}

export function ChatInterface({
  channel,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
}: ChatInterfaceProps) {
  const [isConnected, setIsConnected] = useState(true); // This would come from Pusher hook
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      await onSendMessage({
        content: content.trim(),
        channelId: channel.id,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEditMessage = async (messageId: string, content: string) => {
    if (!content.trim()) return;

    try {
      await onEditMessage({
        id: messageId,
        content: content.trim(),
      });
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await onDeleteMessage(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">          
      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-card">
        <MessageInput
          onSendMessage={handleSendMessage}
          onTypingChange={setIsTyping}
          placeholder={`Message #${channel.name}`}
        />
      </div>
    </div>
  );
}
