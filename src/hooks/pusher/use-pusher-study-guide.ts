import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Pusher, { Channel } from 'pusher-js';
import { RouterOutputs } from '@goscribe/server';

type StudyGuide = RouterOutputs['studyguide']['get'];

interface StudyGuideEventHandlers {
  onGuideInfoComplete?: () => void;
  onGenerationStart?: () => void;
  onGenerationProgress?: (progress: number) => void;
  onGenerationComplete?: (guide: StudyGuide) => void;
  onGenerationError?: (error: string) => void;
}

export function usePusherStudyGuide(workspaceId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<Channel | null>(null);
  const eventHandlersRef = useRef<StudyGuideEventHandlers>({});

  useEffect(() => {
    if (!workspaceId) return;

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    pusherRef.current = pusher;

    // Subscribe to workspace channel
    const channel = pusher.subscribe(`workspace_${workspaceId}`);
    channelRef.current = channel;

    // Set up event listeners
    channel.bind('pusher:subscription_succeeded', () => {
      setIsConnected(true);
    });

    channel.bind('pusher:subscription_error', () => {
      setIsConnected(false);
      toast.error('Study guide realtime connection error');
    });

    // Study guide events
    channel.bind(`study_guide_info`, () => {
      eventHandlersRef.current.onGuideInfoComplete?.();
    });

    // Generation events
    channel.bind(`study_guide_generation_start`, () => {
      setIsGenerating(true);
      setGenerationProgress(0);
      eventHandlersRef.current.onGenerationStart?.();
    });

    channel.bind(`study_guide_generation_progress`, (data: { progress: number }) => {
      setGenerationProgress(data.progress);
      eventHandlersRef.current.onGenerationProgress?.(data.progress);
    });

    channel.bind(`study_guide_generation_complete`, (data: { guide: StudyGuide }) => {
      setIsGenerating(false);
      setGenerationProgress(100);
      eventHandlersRef.current.onGenerationComplete?.(data.guide);
    });

    channel.bind(`study_guide_generation_error`, (data: { error: string }) => {
      setIsGenerating(false);
      setGenerationProgress(0);
      eventHandlersRef.current.onGuideInfoComplete?.();
      eventHandlersRef.current.onGenerationError?.(data.error);
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        pusher.unsubscribe(`workspace_${workspaceId}`);
      }
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
      setIsConnected(false);
      setIsGenerating(false);
      setGenerationProgress(0);
    };
  }, [workspaceId]);

  const subscribeToStudyGuide = (handlers: StudyGuideEventHandlers) => {
    eventHandlersRef.current = handlers;
  };

  const unsubscribeFromStudyGuide = () => {
    eventHandlersRef.current = {};
  };

  return {
    isConnected,
    isGenerating,
    generationProgress,
    subscribeToStudyGuide,
    unsubscribeFromStudyGuide,
  };
}
