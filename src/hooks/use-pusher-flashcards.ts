import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Pusher from 'pusher-js';
import { RouterOutputs } from '@goscribe/server';

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

interface FlashcardEventHandlers {
  onNewCard?: (card: Flashcard) => void;
  onCardUpdate?: (card: Flashcard) => void;
  onCardDelete?: (cardId: string) => void;
  onGenerationStart?: () => void;
  onGenerationComplete?: (cards: Flashcard[]) => void;
  onGenerationError?: (error: string) => void;
}

export function usePusherFlashcards(workspaceId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<Pusher.Channel | null>(null);
  const eventHandlersRef = useRef<FlashcardEventHandlers>({});

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

    // Flashcard events
    channel.bind('flashcard_new', (data: { card: Flashcard }) => {
      eventHandlersRef.current.onNewCard?.(data.card);
    });

    channel.bind('flashcard_update', (data: { card: Flashcard }) => {
      eventHandlersRef.current.onCardUpdate?.(data.card);
    });

    channel.bind('flashcard_delete', (data: { cardId: string }) => {
      eventHandlersRef.current.onCardDelete?.(data.cardId);
    });

    // Generation events
    channel.bind('flashcard_generation_start', () => {
      setIsGenerating(true);
      setGenerationProgress(0);
      eventHandlersRef.current.onGenerationStart?.();
    });

    channel.bind('flashcard_generation_progress', (data: { progress: number }) => {
      setGenerationProgress(data.progress);
    });

    channel.bind('flashcard_generation_complete', (data: { cards: Flashcard[] }) => {
      setIsGenerating(false);
      setGenerationProgress(100);
      eventHandlersRef.current.onGenerationComplete?.(data.cards);
    });

    channel.bind('flashcard_generation_error', (data: { error: string }) => {
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

  const subscribeToFlashcards = (handlers: FlashcardEventHandlers) => {
    eventHandlersRef.current = handlers;
  };

  const unsubscribeFromFlashcards = () => {
    eventHandlersRef.current = {};
  };

  return {
    isConnected,
    isGenerating,
    generationProgress,
    subscribeToFlashcards,
    unsubscribeFromFlashcards,
  };
}
