"use client";

import { useState } from "react";
import { Plus, Brain, Play, ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlashcardCreateModal } from "@/components/flashcard-create-modal";
import { FlashcardEditModal } from "@/components/flashcard-edit-modal";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useParams, useRouter } from "next/navigation";
import { useFlashcards } from "@/hooks/use-flashcards";
import { RouterOutputs } from "@goscribe/server";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];
import { FlashcardHeader } from "@/components/flashcard/flashcard-header";
import { FlashcardSearch } from "@/components/flashcard/flashcard-search";
import { FlashcardTable } from "@/components/flashcard/flashcard-table";
import { FlashcardDetailSheet } from "@/components/flashcard/flashcard-detail-sheet";
import { FlashcardCardOverview } from "@/components/flashcard/flashcard-card-overview";
import { FlashcardGenerateModal } from "@/components/flashcard/flashcard-generate-modal";

/**
 * Flashcards panel component for managing and studying flashcards
 * 
 * Features:
 * - List and grid view modes
 * - Create, edit, and delete flashcards
 * - Interactive study mode with flip cards
 * - Real-time updates via Pusher
 * - Search and pagination
 * 
 * @returns JSX element containing the flashcards panel
 */
export default function FlashcardsPanel() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  // Custom hook for flashcard operations
  const { 
    cards,
    selectedCard,
    viewMode,
    globalFilter,
    isLoading,
    isCreating,
    isUpdating,
    isGenerating, 
    generatingMetadata,
    error,
    createCard,
    updateCard,
    deleteCard,
    selectCard,
    changeViewMode,
    updateGlobalFilter,
    generateFromPrompt,
    refetch,
  } = useFlashcards(workspaceId);

  /**
   * Handles creating a new flashcard
   * @param front - The front text
   * @param back - The back text
   */
  const handleCreateCard = (front: string, back: string) => {
    createCard(front, back);
    setIsCreateModalOpen(false);
  };

  /**
   * Handles updating a flashcard
   * @param id - The card ID
   * @param front - The new front text
   * @param back - The new back text
   */
  const handleUpdateCard = (id: string, front: string, back: string) => {
    updateCard(id, front, back);
    setIsEditModalOpen(false);
    setEditingCard(null);
  };

  /**
   * Opens the edit modal for a card
   * @param card - The card to edit
   */
  const openEditModal = (card: Flashcard) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  /**
   * Handles card deletion
   * @param cardId - The ID of the card to delete
   */
  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
    if (selectedCard?.id === cardId) {
      selectCard(null);
    }
  };

  /**
   * Handles generating flashcards from prompt
   * @param prompt - The prompt to generate flashcards from
   */
  const handleGenerateFromPrompt = (prompt: string) => {
    generateFromPrompt(prompt);
    setIsGenerateModalOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <LoadingSkeleton 
        type="flashcards" 
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Flashcards</h3>
            <p className="text-sm text-muted-foreground">
              Interactive study cards for quick review
            </p>
          </div>
        </div>
        <Card className="border-destructive">
          <CardContent className="p-8 text-center">
            <p className="text-destructive">Error loading flashcards: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-2" variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <FlashcardHeader
        cardCount={cards.length}
        viewMode={viewMode}
        onViewModeChange={changeViewMode}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onGenerateClick={() => setIsGenerateModalOpen(true)}
        isCreating={isCreating}
        isGenerating={isGenerating}
        generatingMetadata={generatingMetadata || null}
      />

      {/* Action Bar */}
      {cards.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => router.push(`/workspace/${workspaceId}/flashcards/learn`)}
          >
            <Brain className="w-4 h-4" />
            Learn
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {/* TODO: Implement play mode */}}
          >
            <Play className="w-4 h-4" />
            Play
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {/* TODO: Implement test mode */}}
          >
            <ClipboardCheck className="w-4 h-4" />
            Test
          </Button>
        </div>
      )}

      {/* Search Bar for List View */}
      {viewMode === "list" && cards.length > 0 && (
        <FlashcardSearch
          searchValue={globalFilter}
          onSearchChange={updateGlobalFilter}
        />
      )}

      {/* Modals */}
      <FlashcardCreateModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateCard={handleCreateCard}
        isLoading={isCreating}
      />

      <FlashcardEditModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUpdateCard={handleUpdateCard}
        flashcard={editingCard}
        isLoading={isUpdating}
      />

      <FlashcardGenerateModal
        isOpen={isGenerateModalOpen}
        onOpenChange={setIsGenerateModalOpen}
        onGenerate={handleGenerateFromPrompt}
        isLoading={isGenerating}
      />

      {/* Content */}
      {cards.length === 0 && !isGenerating ? (
        <EmptyState
          icon={Plus}
          title="No flashcards yet"
          description="Create your first flashcard to start studying"
          action={{
            label: "New Card",
            onClick: () => setIsCreateModalOpen(true)
          }}
        />
      ) : viewMode === "list" ? (
        <>
          {/* Table View */}
          <FlashcardTable
            cards={cards}
            globalFilter={globalFilter}
            onGlobalFilterChange={updateGlobalFilter}
            selectedCard={selectedCard}
            onCardSelect={selectCard}
          />

          {/* Card Detail Sheet */}
          <FlashcardDetailSheet
            selectedCard={selectedCard}
            onClose={() => selectCard(null)}
            onUpdateCard={updateCard}
            onDeleteCard={handleDeleteCard}
            isUpdating={isUpdating}
          />
        </>
      ) : (
        /* Card Overview */
        <FlashcardCardOverview
          cards={cards}
          onEditCard={openEditModal}
        />
      )}
    </div>
  );
};