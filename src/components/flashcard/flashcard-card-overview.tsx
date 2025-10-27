"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RouterOutputs } from "@goscribe/server";
import { toast } from "sonner";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

/**
 * Props for the FlashcardCardOverview component
 */
interface FlashcardCardOverviewProps {
  /** Array of flashcards */
  cards: Flashcard[];
  /** Callback when edit modal should open */
  onEditCard: (card: Flashcard) => void;
}

/**
 * Flashcard card overview component for grid/card view
 * 
 * Features:
 * - Interactive flip cards
 * - Navigation between cards
 * - Keyboard shortcuts (arrows, space, enter)
 * - Progress indicator
 * - Quick actions (restart, shuffle, edit)
 * 
 * @param props - FlashcardCardOverviewProps
 * @returns JSX element containing the card overview
 */
export const FlashcardCardOverview = ({
  cards,
  onEditCard
}: FlashcardCardOverviewProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Keyboard shortcuts for card view
  useEffect(() => {
    if (cards.length > 0) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          goToPreviousCard();
        } else if (e.key === "ArrowRight") {
          goToNextCard();
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggleCardFlip();
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [currentCardIndex, cards.length]);

  /**
   * Goes to the next card
   */
  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsCardFlipped(false);
    }
  };

  /**
   * Goes to the previous card
   */
  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsCardFlipped(false);
    }
  };

  /**
   * Toggles the card flip state
   */
  const toggleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  /**
   * Shuffles to a random card
   */
  const shuffleCards = () => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    setCurrentCardIndex(randomIndex);
    setIsCardFlipped(false);
    toast.info("Jumped to random card");
  };

  /**
   * Restarts from the first card
   */
  const restartCards = () => {
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
  };

  if (cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentCardIndex];
  const progressPercentage = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Study Card */}
      <div className="w-full max-w-3xl perspective">
        <Card
          className="cursor-pointer border-border shadow-none min-h-[400px]"
          onClick={toggleCardFlip}
        >
          <div className={`flip-card-inner ${isCardFlipped ? "flipped" : ""}`}>
            <CardContent className="flip-card-front p-12 h-full flex flex-col justify-center items-center min-h-[400px]">
              <div className="text-center w-full space-y-6">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Front
                </div>
                <h2 className="text-4xl font-semibold leading-tight">
                  {currentCard.front}
                </h2>
                <p className="text-sm text-muted-foreground">Click to reveal answer</p>
              </div>
            </CardContent>
            <CardContent className="flip-card-back p-12 h-full flex flex-col justify-center items-center min-h-[400px]">
              <div className="text-center w-full space-y-6">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Back
                </div>
                <h2 className="text-4xl font-semibold leading-tight">
                  {currentCard.back}
                </h2>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="w-full max-w-3xl mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousCard}
          disabled={currentCardIndex === 0}
          className="h-10 px-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {currentCardIndex + 1} / {cards.length}
          </span>
          <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <Button 
          variant="outline"
          size="sm"
          onClick={goToNextCard}
          disabled={currentCardIndex === cards.length - 1}
          className="h-10 px-6"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-3xl mt-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={restartCards}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Restart
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={shuffleCards}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Shuffle
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => onEditCard(currentCard)}
          >
            <Edit3 className="h-3.5 w-3.5 mr-1.5" />
            Edit Card
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Use arrow keys to navigate • Space/Enter to flip
        </p>
      </div>
    </div>
  );
};
