import { useState, useEffect, useRef, useCallback } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';

// Podcast event data interfaces
export interface PodcastInfoData {
  artifactId: string;
  title: string;
  description?: string;
  status: string;
  [key: string]: unknown;
}

export interface PodcastCompleteData {
  artifactId: string;
  title: string;
  message?: string;
}

export interface PodcastErrorData {
  error: string;
  artifactId?: string;
}

export interface PodcastPusherState {
  latestPodcastInfo: PodcastInfoData | null;
  lastCompleted: PodcastCompleteData | null;
  lastError: PodcastErrorData | null;
}

export function usePusherPodcast(workspaceId: string, onRefetch?: () => void) {
  const [state, setState] = useState<PodcastPusherState>({
    latestPodcastInfo: null,
    lastCompleted: null,
    lastError: null,
  });

  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<ReturnType<Pusher['subscribe']> | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    // Initialize Pusher
    pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    });

    const channelName = `workspace_${workspaceId}`;
    channelRef.current = pusherRef.current.subscribe(channelName);

    // Podcast info event - triggers refetch
    channelRef.current.bind(`podcast_info`, (data: PodcastInfoData) => {
      console.log('Podcast info received:', data);
      setState(prev => ({
        ...prev,
        latestPodcastInfo: data,
      }));
      // Refetch on info update
      if (onRefetch) {
        onRefetch();
      }
    });

    // Podcast complete event - triggers refetch with success message
    channelRef.current.bind(`podcast_complete`, (data: PodcastCompleteData) => {
      console.log('Podcast completed:', data);
      setState(prev => ({
        ...prev,
        lastCompleted: data,
      }));
      // Show success message
      toast.success(data.message || `Podcast "${data.title}" completed successfully!`);
      // Refetch on completion
      if (onRefetch) {
        onRefetch();
      }
    });

    // Podcast error event - shows error toast
    channelRef.current.bind(`podcast_error`, (data: PodcastErrorData) => {
      console.error('Podcast error:', data);
      setState(prev => ({
        ...prev,
        lastError: data,
      }));
      // Show error message
      toast.error(data.error || 'An error occurred with the podcast');
    });

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };
  }, [workspaceId, onRefetch]);

  const resetState = () => {
    setState({
      latestPodcastInfo: null,
      lastCompleted: null,
      lastError: null,
    });
  };

  return {
    state,
    latestPodcastInfo: state.latestPodcastInfo,
    lastCompleted: state.lastCompleted,
    lastError: state.lastError,
    resetState,
  };
}
