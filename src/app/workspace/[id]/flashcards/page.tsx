"use client";

import { useState } from "react";
import { Plus, RotateCcw, Edit3, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlashcardCreateModal } from "@/components/flashcard-create-modal";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export default function FlashcardsPanel() {
  const [cards, setCards] = useState<Flashcard[]>([
    {
      id: '1',
      front: 'What is the derivative of x²?',
      back: 'The derivative of x² is 2x using the power rule.'
    },
    {
      id: '2',
      front: 'Define a limit in calculus',
      back: 'A limit is the value that a function approaches as the input approaches a certain value.'
    },
    {
      id: '3',
      front: 'What is the chain rule?',
      back: 'The chain rule states that d/dx[f(g(x))] = f\'(g(x)) × g\'(x)'
    }
  ]);

  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front,
      back
    };
    setCards([...cards, newCard]);
  };

  const deleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  };

  const shuffleCards = () => {
    setCards([...cards].sort(() => Math.random() - 0.5));
    setFlippedCards(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Flashcards</h3>
          <p className="text-sm text-muted-foreground">
            Interactive study cards for quick review
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={shuffleCards} size="sm" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </div>

      <FlashcardCreateModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateCard={handleCreateCard}
      />

      {/* Flashcards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const isFlipped = flippedCards.has(card.id);
          return (
            <Card
              key={card.id}
              className="h-48 cursor-pointer card-hover group relative"
              onClick={() => flipCard(card.id)}
            >
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCard(card.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">
                    {isFlipped ? 'Answer' : 'Question'}
                  </div>
                  <p className="text-sm leading-relaxed">
                    {isFlipped ? card.back : card.front}
                  </p>
                </div>
                
                <div className="mt-4 text-center">
                  <span className="text-xs text-primary/60">
                    Click to {isFlipped ? 'show question' : 'reveal answer'}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {cards.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No flashcards yet.</p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="mt-2" variant="outline">
            Create your first flashcard
          </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};