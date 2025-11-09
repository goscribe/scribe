import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Pusher, { Channel as PusherChannel } from 'pusher-js';
import { RouterOutputs } from '@goscribe/server';

type Channel = RouterOutputs['chat']['getChannels'][number];
type ChatMessage = RouterOutputs['chat']['getChannel']['chats'][number];

interface WorkspaceEventHandlers {
  onNewChannel?: (channel: Channel) => void;
  onChannelEdit?: (channel: Channel) => void;
  onChannelDelete?: (channelId: string) => void;
}

interface ChannelEventHandlers {
  onNewMessage?: (message: ChatMessage) => void;
  onMessageEdit?: (message: ChatMessage) => void;
  onMessageDelete?: (messageId: string) => void;
}

export function usePusherChat(workspaceId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const pusherRef = useRef<Pusher | null>(null);
  const channelsRef = useRef<Map<string, PusherChannel>>(new Map());
  const workspaceHandlersRef = useRef<WorkspaceEventHandlers>({});
  const channelHandlersRef = useRef<Map<string, ChannelEventHandlers>>(new Map());

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
    });

    workspaceChannel.bind('pusher:subscription_error', () => {
      setIsConnected(false);
      toast.error('Chat realtime connection error');
    });

    workspaceChannel.bind('new_channel', (data: Channel) => {
      workspaceHandlersRef.current.onNewChannel?.(data);
    });

    workspaceChannel.bind('edit_channel', (data: Channel) => {
      workspaceHandlersRef.current.onChannelEdit?.(data);
    });

    workspaceChannel.bind('delete_channel', (data: { channelId: string }) => {
      workspaceHandlersRef.current.onChannelDelete?.(data.channelId);
    });

    return () => {
      // Clean up all channel subscriptions
      const channels = channelsRef.current;
      const channelHandlers = channelHandlersRef.current;
      
      channels.forEach((channel) => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
      channels.clear();
      channelHandlers.clear();
      
      // Clean up workspace channel
      workspaceChannel.unbind_all();
      pusher.unsubscribe(`workspace_${workspaceId}`);
      
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
      setIsConnected(false);
    };
  }, [workspaceId]);

  const setWorkspaceHandlers = (handlers: WorkspaceEventHandlers) => {
    workspaceHandlersRef.current = handlers;
  };

  const subscribeToChannel = (channelId: string | null, handlers: ChannelEventHandlers) => {
    if (!pusherRef.current || !channelId) return;

    const channelName = channelId;
    
    // Store handlers for this channel
    channelHandlersRef.current.set(channelName, handlers);
    
    // Subscribe to channel if not already subscribed
    if (!channelsRef.current.has(channelName)) {
      const channel = pusherRef.current.subscribe(channelName);
      channelsRef.current.set(channelName, channel);
      
      // Bind message events
      channel.bind('new_message', (data: ChatMessage) => {
        const channelHandlers = channelHandlersRef.current.get(channelName);
        channelHandlers?.onNewMessage?.(data);
      });

      channel.bind('edit_message', (data: ChatMessage) => {
        const channelHandlers = channelHandlersRef.current.get(channelName);
        channelHandlers?.onMessageEdit?.(data);
      });

      channel.bind('delete_message', (data: ChatMessage) => {
        const channelHandlers = channelHandlersRef.current.get(channelName);
        channelHandlers?.onMessageDelete?.(data.id);
      });
    } else {
      // Update handlers for already subscribed channel
      const channelHandlers = channelHandlersRef.current.get(channelName);
      if (channelHandlers) {
        channelHandlersRef.current.set(channelName, handlers);
      }
    }
  };

  const unsubscribeFromChannel = (channelId: string) => {
    if (!pusherRef.current) return;
    
    const channelName = `channel_${channelId}`;
    const channel = channelsRef.current.get(channelName);
    
    if (channel) {
      channel.unbind_all();
      pusherRef.current.unsubscribe(channelName);
      channelsRef.current.delete(channelName);
      channelHandlersRef.current.delete(channelName);
    }
  };

  return {
    isConnected,
    setWorkspaceHandlers,
    subscribeToChannel,
    unsubscribeFromChannel,
  };
}
