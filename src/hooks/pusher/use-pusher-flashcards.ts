import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Pusher, { Channel } from 'pusher-js';
import { RouterOutputs } from '@goscribe/server';

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

interface FlashcardEventHandlers {
  onNewCard?: (card: Flashcard) => void;
  onCardUpdate?: (card: Flashcard) => void;
  onCardDelete?: (cardId: string) => void;
  onGenerationStart?: () => void;
  onGenerationComplete?: (cards: Flashcard[]) => void;
  onGenerationError?: (error: string) => void;
  onFlashcardInfoComplete?: () => void;
}

export function usePusherFlashcards(workspaceId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // const [generationProgress, setGenerationProgress] = useState(0);
  const [generatingMetadata, setGeneratingMetadata] = useState<{ quantity: number; topic?: string } | null>(null);
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<Channel | null>(null);
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
    });

    channel.bind('pusher:subscription_error', () => {
      setIsConnected(false);
      toast.error('Flashcard realtime connection error');
    });

    // Flashcard events : specific non-generative events
    channel.bind(`flash_card_new`, (data: { card: Flashcard }) => {
      eventHandlersRef.current.onNewCard?.(data.card);
    });

    channel.bind(`flash_card_update`, (data: { card: Flashcard }) => {
      eventHandlersRef.current.onCardUpdate?.(data.card);
    });

    channel.bind(`flash_card_delete`, (data: { cardId: string }) => {
      eventHandlersRef.current.onCardDelete?.(data.cardId);
    });

    // Generation events
    channel.bind(`flash_card_generation_start`, () => {
      setIsGenerating(true);
      // setGenerationProgress(0);
      eventHandlersRef.current.onGenerationStart?.();
    });

    channel.bind(`flash_card_generation_complete`, (data: { cards: Flashcard[] }) => {
      setIsGenerating(false);
      // setGenerationProgress(100);
      eventHandlersRef.current.onGenerationComplete?.(data.cards);
    });

    channel.bind(`flash_card_generation_error`, (data: { error: string }) => {
      setIsGenerating(false);
      // setGenerationProgress(0);
      eventHandlersRef.current.onFlashcardInfoComplete?.();
      eventHandlersRef.current.onGenerationError?.(data.error);
    });

    // Task refetch
    channel.bind(`flash_card_info`, () => {
      eventHandlersRef.current.onFlashcardInfoComplete?.();
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
      // setGenerationProgress(0);
      setGeneratingMetadata(null);
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
    // generationProgress,
    generatingMetadata,
    subscribeToFlashcards,
    unsubscribeFromFlashcards,
  };
}
