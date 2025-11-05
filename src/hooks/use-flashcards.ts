"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { usePusherFlashcards } from "./pusher/use-pusher-flashcards";
import { RouterOutputs } from "@goscribe/server";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

/**
 * Custom hook for flashcard operations with real-time updates
 * 
 * Features:
 * - CRUD operations for flashcards
 * - Real-time updates via Pusher
 * - Loading states and error handling
 * - Toast notifications
 * 
 * @param workspaceId - The workspace ID
 * @returns Object containing flashcard data and operations
 */
export const useFlashcards = (workspaceId: string) => {
  // State management
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [globalFilter, setGlobalFilter] = useState("");

  // Pusher integration for real-time updates
  const { 
    isConnected, 
    // generationProgress,
    generatingMetadata,
    subscribeToFlashcards 
  } = usePusherFlashcards(workspaceId);

  // tRPC queries and mutations
  const { data: cards = [], isLoading, error, refetch } = trpc.flashcards.listCards.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );
  
  // @todo: what the sigma
  const { data: isGenerating, isLoading: isGeneratingLoading, error: isGeneratingError, refetch: refetchIsGenerating } = trpc.flashcards.isGenerating.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );

  const createMutation = trpc.flashcards.createCard.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Flashcard created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create flashcard");
    },
  });

  const deleteMutation = trpc.flashcards.deleteCard.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Flashcard deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete flashcard");
    },
  });

  const updateMutation = trpc.flashcards.updateCard.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Flashcard updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update flashcard");
    },
  });

  const generateFromPromptMutation = trpc.flashcards.generateFromPrompt.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Flashcards generated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate flashcards");
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (isConnected) {
      subscribeToFlashcards({
        onNewCard: (card) => {
          toast.success("New flashcard added!");
        },
        onCardUpdate: (card) => {
          toast.success("Flashcard updated!");
        },
        onCardDelete: (cardId) => {
          toast.success("Flashcard deleted!");
        },
        onGenerationStart: () => {
          toast.info("Starting flashcard generation...");
        },
        onGenerationComplete: (cards) => {
          toast.success(`Generated ${cards.length} flashcards!`);
          refetch();
        },
        onGenerationError: (error) => {
          toast.error(`Generation failed: ${error}`);
        },
        onFlashcardInfoComplete: (data) => {
          refetch();
          refetchIsGenerating();
        },
      });
    }
  }, [isConnected, subscribeToFlashcards, refetch]);

  /**
   * Creates a new flashcard
   * @param front - The front text of the card
   * @param back - The back text of the card
   */
  const createCard = (front: string, back: string) => {
    createMutation.mutate({
      workspaceId,
      front,
      back,
    });
  };

  /**
   * Updates an existing flashcard
   * @param id - The ID of the card to update
   * @param front - The new front text
   * @param back - The new back text
   */
  const updateCard = (id: string, front: string, back: string) => {
    updateMutation.mutate({
      cardId: id,
      front,
      back,
    });
  };

  /**
   * Deletes a flashcard
   * @param cardId - The ID of the card to delete
   */
  const deleteCard = (cardId: string) => {
    deleteMutation.mutate({ cardId });
  };

  /**
   * Selects a card for detailed view
   * @param card - The card to select, or null to deselect
   */
  const selectCard = (card: Flashcard | null) => {
    setSelectedCard(card);
  };

  /**
   * Changes the view mode between grid and list
   * @param mode - The new view mode
   */
  const changeViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  /**
   * Updates the global search filter
   * @param filter - The new filter value
   */
  const updateGlobalFilter = (filter: string) => {
    setGlobalFilter(filter);
  };

  /**
   * Generates flashcards from a prompt
   * @param prompt - The prompt to generate flashcards from
   */
  const generateFromPrompt = (prompt: string) => {
    generateFromPromptMutation.mutate({
      workspaceId,
      prompt,
    });
  };

  return {
    // Data
    cards,
    selectedCard,
    viewMode,
    globalFilter,
    
    // Loading states
    isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isGenerating: isGenerating || generateFromPromptMutation.isPending,    
    // generationProgress,
    generatingMetadata,
    
    // Error state
    error,
    
    // Pusher state
    isConnected,
    
    // Actions
    createCard,
    updateCard,
    deleteCard,
    selectCard,
    changeViewMode,
    updateGlobalFilter,
    generateFromPrompt,
    refetch,
  };
};
