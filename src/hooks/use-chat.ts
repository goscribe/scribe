import { useState, useEffect, useCallback } from 'react';
import { usePusherChat } from './use-pusher-chat';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { RouterOutputs } from '@goscribe/server';

type Channel = RouterOutputs['chat']['getChannels'][number];
type ChatMessage = RouterOutputs['chat']['getChannel']['chats'][number];

export interface Message {
  id: string;
  content: string;
  channelId: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export interface CreateChannelInput {
  name: string;
  description?: string;
  workspaceId: string;
}

export interface SendMessageInput {
  content: string;
  channelId: string;
}

export interface EditMessageInput {
  id: string;
  content: string;
}

export interface EditChannelInput {
  id: string;
  name: string;
  description?: string;
}

export function useChat(workspaceId: string) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  // Real-time updates via Pusher
  const { 
    subscribeToChannel, 
    unsubscribeFromChannel,
    isConnected 
  } = usePusherChat(workspaceId);

  // tRPC queries and mutations
  const { data: workspaceChannelsData, isLoading: channelsLoading, error: channelsError, refetch: refetchChannels } = trpc.chat.getChannels.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );

  const { data: selectedChannelData, refetch: refetchSelectedChannel } = trpc.chat.getChannel.useQuery(
    { workspaceId, channelId: selectedChannelId || undefined },
    { enabled: !!selectedChannelId }
  );

  const createChannelMutation = trpc.chat.createChannel.useMutation({
    onSuccess: (data) => {
      setChannels(prev => [...prev, data]);
      setSelectedChannelId(data.id);
      toast.success('Channel created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create channel');
    }
  });

  const editChannelMutation = trpc.chat.editChannel.useMutation({
    onSuccess: (data) => {
      setChannels(prev => 
        prev.map(channel => 
          channel.id === data.id ? data : channel
        )
      );
      toast.success('Channel updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to edit channel');
    }
  });

  const removeChannelMutation = trpc.chat.removeChannel.useMutation({
    onSuccess: (data) => {
      setChannels(prev => prev.filter(channel => channel.id !== data.channelId));
      if (selectedChannelId === data.channelId) {
        setSelectedChannelId(null);
      }
      toast.success('Channel deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete channel');
    }
  });

  const postMessageMutation = trpc.chat.postMessage.useMutation({
    onSuccess: (data) => {
      // Message will be added via real-time update
      return data;
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send message');
    }
  });

  const editMessageMutation = trpc.chat.editMessage.useMutation({
    onSuccess: (data) => {
      // Message will be updated via real-time update
      toast.success('Message updated successfully');
      return data;
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to edit message');
    }
  });

  const deleteMessageMutation = trpc.chat.deleteMessage.useMutation({
    onSuccess: (data) => {
      // Message will be removed via real-time update
      toast.success('Message deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete message');
    }
  });

  // Load initial data
  useEffect(() => {
    if (workspaceChannelsData) {
      setChannels(workspaceChannelsData);
      setIsLoading(false);
      
      // Auto-select first channel if none selected
      if (workspaceChannelsData.length > 0 && !selectedChannelId) {
        setSelectedChannelId(workspaceChannelsData[0].id);
      }
    }
  }, [workspaceChannelsData, selectedChannelId]);

  // Update messages when selected channel changes
  useEffect(() => {
    if (selectedChannelData?.chats) {
      setMessages(selectedChannelData.chats);
    } else {
      setMessages([]);
    }
  }, [selectedChannelData]);

  // Handle loading and error states
  useEffect(() => {
    setIsLoading(channelsLoading);
    if (channelsError) {
      setError(channelsError.message);
    } else {
      setError(null);
    }
  }, [channelsLoading, channelsError]);

  // Subscribe to real-time updates for the selected channel
  useEffect(() => {
    if (isConnected && selectedChannelId) {
      subscribeToChannel(workspaceId, selectedChannelId, {
        onNewChannel: (channel) => {
          setChannels(prev => [...prev, channel]);
        },
        onChannelEdit: (updatedChannel) => {
          setChannels(prev => 
            prev.map(channel => 
              channel.id === updatedChannel.id ? updatedChannel : channel
            )
          );
        },
        onChannelDelete: (channelId) => {
          setChannels(prev => prev.filter(channel => channel.id !== channelId));
          if (selectedChannelId === channelId) {
            setSelectedChannelId(null);
          }
        },
        onNewMessage: (message) => {
          setMessages(prev => [...prev, message]);
        },
        onMessageEdit: (updatedMessage) => {
          setMessages(prev => 
            prev.map(message => 
              message.id === updatedMessage.id ? updatedMessage : message
            )
          );
        },
        onMessageDelete: (messageId) => {
          setMessages(prev => prev.filter(message => message.id !== messageId));
        },
      });
    }

    return () => {
      if (selectedChannelId) {
        unsubscribeFromChannel(selectedChannelId);
      }
    };
  }, [isConnected, selectedChannelId]);

  const createChannel = async (input: CreateChannelInput) => {
    try {
      await createChannelMutation.mutateAsync({
        workspaceId: input.workspaceId,
        name: input.name,
      });
    } catch (err) {
      throw err;
    }
  };

  const editChannel = async (input: EditChannelInput) => {
    try {
      await editChannelMutation.mutateAsync({
        workspaceId: workspaceId,
        channelId: input.id,
        name: input.name,
      });
    } catch (err) {
      throw err;
    }
  };

  const deleteChannel = async (channelId: string) => {
    try {
      await removeChannelMutation.mutateAsync({
        workspaceId: workspaceId,
        channelId: channelId,
      });
    } catch (err) {
      throw err;
    }
  };

  const sendMessage = async (input: SendMessageInput) => {
    try {
      await postMessageMutation.mutateAsync({
        channelId: input.channelId,
        message: input.content,
      });
    } catch (err) {
      throw err;
    }
  };

  const editMessage = async (input: EditMessageInput) => {
    try {
      await editMessageMutation.mutateAsync({
        chatId: input.id,
        message: input.content,
      });
    } catch (err) {
      throw err;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteMessageMutation.mutateAsync({
        chatId: messageId,
      });
    } catch (err) {
      throw err;
    }
  };

  const selectChannel = useCallback((channelId: string) => {
    setSelectedChannelId(channelId);
  }, []);

  const loadChannels = useCallback(() => {
    refetchChannels();
  }, [refetchChannels]);

  return {
    channels,
    messages,
    isLoading,
    error,
    selectedChannelId,
    isConnected,
    createChannel,
    editChannel,
    deleteChannel,
    sendMessage,
    editMessage,
    deleteMessage,
    selectChannel,
    loadChannels,
  };
}
