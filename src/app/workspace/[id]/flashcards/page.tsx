"use client";

import { useState, useEffect } from "react";
import { Plus, RotateCcw, Edit3, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlashcardCreateModal } from "@/components/flashcard-create-modal";
import { FlashcardEditModal } from "@/components/flashcard-edit-modal";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { trpc } from "@/lib/trpc";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { RouterOutputs } from "@goscribe/server";
import { usePusherFlashcards } from "@/hooks/use-pusher-flashcards";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

export default function FlashcardsPanel() {
  const params = useParams();
  const workspaceId = params.id as string;
  
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  // Pusher integration
  const { 
    isConnected, 
    isGenerating, 
    generationProgress,
    subscribeToFlashcards 
  } = usePusherFlashcards(workspaceId);

  // tRPC queries and mutations
  const { data: cards = [], isLoading, error, refetch } = trpc.flashcards.listCards.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );

  const createMutation = trpc.flashcards.createCard.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
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

  // Subscribe to real-time updates
  useEffect(() => {
    if (isConnected) {
      subscribeToFlashcards({
        onNewCard: (card) => {
          // Card will be added via refetch
          toast.success("New flashcard added!");
        },
        onCardUpdate: (card) => {
          // Card will be updated via refetch
          toast.success("Flashcard updated!");
        },
        onCardDelete: (cardId) => {
          // Card will be removed via refetch
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
      });
    }
  }, [isConnected, subscribeToFlashcards, refetch]);

  const flipCard = (cardId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleCreateCard = (front: string, back: string) => {
    createMutation.mutate({
      workspaceId,
      front,
      back,
    });
  };

  const handleUpdateCard = (id: string, front: string, back: string) => {
    updateMutation.mutate({
      cardId: id,
      front,
      back,
    });
  };

  const openEditModal = (card: Flashcard) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  const deleteCard = (cardId: string) => {
    deleteMutation.mutate({ cardId: cardId });
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  };

  const shuffleCards = () => {
    // Note: This is client-side shuffling. For server-side shuffling,
    // you'd need to add a shuffle endpoint to the tRPC router
    setFlippedCards(new Set());
  };

  const hideAnswers = () => {
    setFlippedCards(new Set());
  };

  if (isLoading || isGenerating) {
    return (
      <LoadingSkeleton 
        type="flashcards" 
        isGenerating={isGenerating}
        generationProgress={generationProgress}
      />
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Flashcards</h3>
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Flashcards</h3>
          <p className="text-sm text-muted-foreground">
            Interactive study cards for quick review
            {!isConnected && (
              <span className="ml-2 text-xs text-orange-600">(Offline)</span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={hideAnswers} size="sm" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Hide all answers
          </Button>
          <Button 
            onClick={shuffleCards} 
            size="sm" 
            variant="outline"
            disabled={cards.length === 0}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            size="sm" 
            className="gradient-primary"
            disabled={createMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </div>

      <FlashcardCreateModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateCard={handleCreateCard}
        isLoading={createMutation.isPending}
      />

      <FlashcardEditModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUpdateCard={handleUpdateCard}
        flashcard={editingCard}
        isLoading={updateMutation.isPending}
      />

      {/* Flashcards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const isFlipped = flippedCards.has(card.id);
          return (
            <Card
              key={card.id}
              className={`h-48 cursor-pointer card-hover group relative perspective`}
              onClick={() => flipCard(card.id)}
            >
              <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
                <CardContent className="flip-card-front p-4 h-full flex flex-col justify-center">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">Question</div>
                    <p className="text-sm leading-relaxed">{card.front}</p>
                  </div>
                </CardContent>
                <CardContent className="flip-card-back p-4 h-full flex flex-col justify-center">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">Answer</div>
                    <p className="text-sm leading-relaxed">{card.back}</p>
                  </div>
                </CardContent>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(card);
                  }}
                  disabled={updateMutation.isPending}
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(card.id);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {cards.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No flashcards yet.</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="mt-2" 
              variant="outline"
              disabled={createMutation.isPending}
            >
              Create your first flashcard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}