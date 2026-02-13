"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChannelList } from "@/components/chat/channel-list";
import { ChannelCreateModal } from "@/components/chat/channel-create-modal";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Hash, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { id: workspaceId } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isChannelPopoverOpen, setIsChannelPopoverOpen] = useState(false);
  
  const {
    channels,
    messages,
    isLoading,
    error,
    selectedChannelId,
    createChannel,
    sendMessage,
    editMessage,
    deleteMessage,
    editChannel,
    deleteChannel,
    selectChannel,
  } = useChat(workspaceId as string);

  const selectedChannel = channels.find(channel => channel.id === selectedChannelId);

  const handleChannelSelect = (channelId: string) => {
    selectChannel(channelId);
    setIsChannelPopoverOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
        <div className="p-4 border-b bg-card">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] w-full">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load chat</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-background">
      {/* Channel Header with Popover */}
      <div className="p-4 border-b bg-card flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Popover open={isChannelPopoverOpen} onOpenChange={setIsChannelPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-muted/50"
                >
                  <Hash className="h-4 w-4" />
                  <span className="font-medium">
                    {selectedChannel ? `${selectedChannel.name}` : 'Select Channel'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Channels</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowCreateModal(true);
                        setIsChannelPopoverOpen(false);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {channels.length} channel{channels.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <ChannelList
                    channels={channels}
                    selectedChannelId={selectedChannelId}
                    onChannelSelect={handleChannelSelect}
                    onChannelEdit={editChannel}
                    onChannelDelete={deleteChannel}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedChannel ? (
          <ChatInterface
            channel={{
              ...selectedChannel,
              chats: []
            }}
            messages={messages}
            onSendMessage={sendMessage}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
          />
        ) : (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No channel selected</h3>
              <p className="text-muted-foreground mb-4">
                Select a channel to start chatting
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Channel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Channel Create Modal */}
      <ChannelCreateModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateChannel={createChannel}
        workspaceId={workspaceId as string}
      />
    </div>
  );
}
