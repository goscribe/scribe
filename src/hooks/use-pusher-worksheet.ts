import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Pusher from 'pusher-js';
import { RouterOutputs } from '@goscribe/server';

type Worksheet = RouterOutputs['worksheets']['get'];

interface WorksheetEventHandlers {
  onNewWorksheet?: (worksheet: Worksheet) => void;
  onWorksheetUpdate?: (worksheet: Worksheet) => void;
  onWorksheetDelete?: (worksheetId: string) => void;
  onGenerationStart?: () => void;
  onGenerationProgress?: (progress: number) => void;
  onGenerationComplete?: (worksheet: Worksheet) => void;
  onGenerationError?: (error: string) => void;
}

export function usePusherWorksheet(workspaceId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<Pusher.Channel | null>(null);
  const eventHandlersRef = useRef<WorksheetEventHandlers>({});

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
      toast.success('Connected to realtime');
    });

    channel.bind('pusher:subscription_error', (error: any) => {
      setIsConnected(false);
      toast.error('Realtime connection error');
    });

    // Worksheet events
    channel.bind('worksheet_new', (data: { worksheet: Worksheet }) => {
      eventHandlersRef.current.onNewWorksheet?.(data.worksheet);
    });

    channel.bind('worksheet_update', (data: { worksheet: Worksheet }) => {
      eventHandlersRef.current.onWorksheetUpdate?.(data.worksheet);
    });

    channel.bind('worksheet_delete', (data: { worksheetId: string }) => {
      eventHandlersRef.current.onWorksheetDelete?.(data.worksheetId);
    });

    // Generation events
    channel.bind('worksheet_generation_start', () => {
      setIsGenerating(true);
      setGenerationProgress(0);
      eventHandlersRef.current.onGenerationStart?.();
    });

    channel.bind('worksheet_generation_progress', (data: { progress: number }) => {
      setGenerationProgress(data.progress);
      eventHandlersRef.current.onGenerationProgress?.(data.progress);
    });

    channel.bind('worksheet_generation_complete', (data: { worksheet: Worksheet }) => {
      setIsGenerating(false);
      setGenerationProgress(100);
      eventHandlersRef.current.onGenerationComplete?.(data.worksheet);
    });

    channel.bind('worksheet_generation_error', (data: { error: string }) => {
      setIsGenerating(false);
      setGenerationProgress(0);
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

  const subscribeToWorksheets = (handlers: WorksheetEventHandlers) => {
    eventHandlersRef.current = handlers;
  };

  const unsubscribeFromWorksheets = () => {
    eventHandlersRef.current = {};
  };

  return {
    isConnected,
    isGenerating,
    generationProgress,
    subscribeToWorksheets,
    unsubscribeFromWorksheets,
  };
}
