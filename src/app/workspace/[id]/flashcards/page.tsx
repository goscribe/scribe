"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlashcardCreateModal } from "@/components/modals/flashcard-create-modal";
import { FlashcardEditModal } from "@/components/modals/flashcard-edit-modal";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useParams } from "next/navigation";
import { useFlashcards } from "@/hooks/use-flashcards";
import { RouterOutputs } from "@goscribe/server";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];
import { FlashcardHeader } from "@/components/flashcard/flashcard-header";
import { FlashcardCardOverview } from "@/components/flashcard/flashcard-card-overview";
import { FlashcardGenerateModal } from "@/components/flashcard/flashcard-generate-modal";
import { FlashcardListView } from "@/components/flashcard/flashcard-list-view";

export default function FlashcardsPanel() {
  const params = useParams();
  const workspaceId = params.id as string;
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  const { 
    cards,
    viewMode,
    isLoading,
    isCreating,
    isUpdating,
    isGenerating, 
    generatingMetadata,
    error,
    createCard,
    updateCard,
    deleteCard,
    changeViewMode,
    generateFromPrompt,
    refetch,
  } = useFlashcards(workspaceId);

  const handleCreateCard = (front: string, back: string) => {
    createCard(front, back);
    setIsCreateModalOpen(false);
  };

  const handleUpdateCard = (id: string, front: string, back: string) => {
    updateCard(id, front, back);
    setIsEditModalOpen(false);
    setEditingCard(null);
  };

  const openEditModal = (card: Flashcard) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
  };

  const handleGenerateFromPrompt = (prompt: string) => {
    generateFromPrompt(prompt);
    setIsGenerateModalOpen(false);
  };

  if (isLoading) {
    return <LoadingSkeleton type="flashcards" />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
        <FlashcardHeader
          cardCount={0}
          viewMode={viewMode}
          onViewModeChange={changeViewMode}
          onCreateClick={() => setIsCreateModalOpen(true)}
          onGenerateClick={() => setIsGenerateModalOpen(true)}
          isCreating={isCreating}
          isGenerating={isGenerating}
          generatingMetadata={generatingMetadata || null}
        />
        <Card className="border-destructive">
          <CardContent className="p-8 text-center">
            <p className="text-destructive text-sm">{error.message}</p>
            <Button onClick={() => refetch()} className="mt-3" variant="outline" size="sm">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
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
      ) : (
        <div className="space-y-8">
          {/* Flip card preview */}
          <FlashcardCardOverview
            cards={cards}
            onEditCard={openEditModal}
          />

          {/* Card list */}
          <div>
            <FlashcardListView
              cards={cards}
              onCardSelect={openEditModal}
              onDeleteCard={handleDeleteCard}
            />
          </div>
        </div>
      )}
    </div>
  );
}