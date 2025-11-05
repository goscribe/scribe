"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Shuffle, Edit3, Trash2, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RouterOutputs } from "@goscribe/server";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { FlashcardStats } from "./widgets/flashcard-stats";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

interface FlashcardCardOverviewProps {
  cards: Flashcard[];
  onEditCard: (card: Flashcard) => void;
}

export const FlashcardCardOverview = ({
  cards,
  onEditCard
}: FlashcardCardOverviewProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    if (cards.length === 0) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentCardIndex(prev => Math.max(0, prev - 1));
        setIsCardFlipped(false);
      } else if (e.key === "ArrowRight") {
        setCurrentCardIndex(prev => Math.min(cards.length - 1, prev + 1));
        setIsCardFlipped(false);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsCardFlipped(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [cards.length]); // Only depend on cards.length, not the state values


  console.log("card flipped outside", isCardFlipped);
  
  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsCardFlipped(false);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsCardFlipped(false);
    }
  };

  const toggleCardFlip = () => {
    console.log("toggle card flip--- current state:", isCardFlipped);
    setIsCardFlipped(prev => {
      console.log("setting isCardFlipped from", prev, "to", !prev);
      return !prev;
    });
  };

  const shuffleCards = () => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    setCurrentCardIndex(randomIndex);
    setIsCardFlipped(false);
    toast.info("Shuffled to random card");
  };

  if (cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentCardIndex];
  const progressPercentage = ((currentCardIndex + 1) / cards.length) * 100;
  
  // Get current card's progress
  const cardProgress = currentCard?.progress[0];
  const masteryLevel = cardProgress?.masteryLevel || 0;
  const timesStudied = cardProgress?.timesStudied || 0;
  const consecutiveIncorrect = cardProgress?.timesIncorrectConsecutive || 0;

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="w-full max-w-3xl">
        <FlashcardStats timesStudied={timesStudied} masteryLevel={masteryLevel} consecutiveIncorrect={consecutiveIncorrect} currentCardIndex={currentCardIndex} totalCards={cards.length} />        
      </div>
      {/* Progress Bar */}
      <div className="w-full max-w-3xl">
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Flip Card */}
      <div 
        className="w-full max-w-3xl cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={toggleCardFlip}
      >
        <div className={`
          relative transition-transform duration-500
          ${isCardFlipped ? '[transform:rotateY(180deg)]' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}>
          {/* Front */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="p-16 flex flex-col justify-center items-center min-h-[400px]">
              <div className="text-center w-full space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                    Question
                  </span>
                </div>
                <h2 className="text-4xl font-bold leading-tight">
                  {currentCard.front}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>Click or press Space to reveal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 border-2 shadow-lg border-gray-300 [transform:rotateY(180deg)]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="p-16 flex flex-col justify-center items-center min-h-[400px]">
              <div className="text-center w-full space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                    Answer
                  </span>
                </div>
                <h2 className="text-4xl font-bold leading-tight">
                  {currentCard.back}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>Click or press Space to reveal</span>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-3xl flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={goToPreviousCard}
          disabled={currentCardIndex === 0}
          className="flex-1 h-12"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={shuffleCards}
            title="Random card"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditCard(currentCard)}
            title="Edit card"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>

        <Button 
          variant="outline"
          size="lg"
          onClick={goToNextCard}
          disabled={currentCardIndex === cards.length - 1}
          className="flex-1 h-12"
        >
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Keyboard Hints */}
      <div className="text-xs text-muted-foreground space-x-4">
        <span>← → Navigate</span>
        <span>•</span>
        <span>Space / Enter Flip</span>
      </div>
    </div>
  );
};

