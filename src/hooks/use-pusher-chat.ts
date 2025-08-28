import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Pusher from 'pusher-js';
import { RouterOutputs } from '@goscribe/server';

type Channel = RouterOutputs['chat']['getChannels'][number];
type ChatMessage = RouterOutputs['chat']['getChannel']['chats'][number];

interface ChatEventHandlers {
  onNewChannel?: (channel: Channel) => void;
  onChannelEdit?: (channel: Channel) => void;
  onChannelDelete?: (channelId: string) => void;
  onNewMessage?: (message: ChatMessage) => void;
  onMessageEdit?: (message: ChatMessage) => void;
  onMessageDelete?: (messageId: string) => void;
}

export function usePusherChat(workspaceId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const pusherRef = useRef<Pusher | null>(null);
  const channelsRef = useRef<Map<string, Pusher.Channel>>(new Map());
  const eventHandlersRef = useRef<ChatEventHandlers>({});

  useEffect(() => {
    if (!workspaceId) return;

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    pusherRef.current = pusher;

    // Subscribe to workspace channel for general events
    const workspaceChannel = pusher.subscribe(`workspace_${workspaceId}`);
    
    // Set up workspace event listeners
    workspaceChannel.bind('pusher:subscription_succeeded', () => {
      setIsConnected(true);
      toast.success('Connected to realtime');
    });

    workspaceChannel.bind('pusher:subscription_error', (error: any) => {
      setIsConnected(false);
      toast.error('Realtime connection error');
    });

    return () => {
      // Clean up all channel subscriptions
      channelsRef.current.forEach((channel) => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
      channelsRef.current.clear();
      
      // Clean up workspace channel
      workspaceChannel.unbind_all();
      pusher.unsubscribe(`workspace_${workspaceId}`);
      
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
      setIsConnected(false);
    };
  }, [workspaceId]);

  const subscribeToChannel = (workspaceId: string, channelId: string, handlers: ChatEventHandlers) => {
    if (!workspaceId || !channelId) return;

    eventHandlersRef.current = handlers;
    
    // Subscribe to individual channel events
    if (pusherRef.current) {
      // Subscribe to channel-specific events
      const channelName = `${channelId}`;
      
      if (!channelsRef.current.has(channelName)) {
        const channel = pusherRef.current.subscribe(channelName);
        channelsRef.current.set(channelName, channel);

        // Channel events
        channel.bind(`${workspaceId}_new_channel`, (data: any) => {
          eventHandlersRef.current.onNewChannel?.(data);
        });

        channel.bind(`${workspaceId}_edit_channel`, (data: any) => {
          eventHandlersRef.current.onChannelEdit?.(data);
        });

        channel.bind(`${workspaceId}_remove_channel`, (data: any) => {
          eventHandlersRef.current.onChannelDelete?.(data.channelId);
        });

        // Message events
        channel.bind(`${channelId}_new_message`, (data: any) => {
          eventHandlersRef.current.onNewMessage?.(data);
        });

        channel.bind(`${channelId}_edit_message`, (data: any) => {
          eventHandlersRef.current.onMessageEdit?.(data);
        });

        channel.bind(`${channelId}_delete_message`, (data: any) => {
          eventHandlersRef.current.onMessageDelete?.(data.chatId);
        });
      }
    }
  };

  const unsubscribeFromChannel = (channelId: string) => {
    eventHandlersRef.current = {};
    
    // Clean up channel subscriptions
    if (pusherRef.current) {
      const channelName = `channel_${workspaceId}`;
      const channel = channelsRef.current.get(channelName);
      
      if (channel) {
        channel.unbind_all();
        pusherRef.current.unsubscribe(channelName);
        channelsRef.current.delete(channelName);
      }
    }
  };

  return {
    isConnected,
    subscribeToChannel,
    unsubscribeFromChannel,
  };
}
