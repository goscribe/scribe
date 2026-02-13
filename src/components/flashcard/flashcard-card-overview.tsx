"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Shuffle, Edit3, Trash2, Sparkles, TrendingUp, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RouterOutputs } from "@goscribe/server";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { FlashcardStats } from "./flashcard-stats";
import { useParams, useRouter } from "next/navigation";
import { getStatusColor, getCardStatus, getStatusLabel } from "./progress";

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
  const router = useRouter();

  const params = useParams();
  const workspaceId = params.id as string;
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
    setIsCardFlipped(prev => !prev);
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
  // const cardProgress = currentCard?.progress[0];
  // const masteryLevel = cardProgress?.masteryLevel || 0;
  // const timesStudied = cardProgress?.timesStudied || 0;
  // const consecutiveIncorrect = cardProgress?.timesIncorrectConsecutive || 0;

  return (
    <div className="space-y-4">
      <div>
        <FlashcardStats card={currentCard} currentCardIndex={currentCardIndex} totalCards={cards.length} />
      </div>
      {/* Progress Bar */}
      <div>
        <Progress value={progressPercentage} className="h-1.5" />
      </div>

      {/* Flip Card */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={toggleCardFlip}
      >
        <div className={`
          relative transition-transform duration-500
          ${isCardFlipped ? '[transform:rotateY(180deg)]' : ''}
        `}
          style={{ transformStyle: 'preserve-3d' }}>
          {/* Front */}
          <Card className="border border-border"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="p-10 flex flex-col justify-center items-center min-h-[240px]">
              <div className="text-center w-full space-y-3">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Question
                </span>
                <p className="text-xl font-semibold leading-relaxed">
                  {currentCard.front}
                </p>
                <p className="text-xs text-muted-foreground">
                  Click or press Space to flip
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 border border-border [transform:rotateY(180deg)]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="p-10 flex flex-col justify-center items-center min-h-[240px]">
              <div className="text-center w-full space-y-3">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Answer
                </span>
                <p className="text-xl font-semibold leading-relaxed">
                  {currentCard.back}
                </p>
                <p className="text-xs text-muted-foreground">
                  Click or press Space to flip
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousCard}
            disabled={currentCardIndex === 0}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={shuffleCards}
            title="Random card"
          >
            <Shuffle className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEditCard(currentCard)}
            title="Edit card"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextCard}
            disabled={currentCardIndex === cards.length - 1}
            className="h-8"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Keyboard Hints */}
        <p className="text-[11px] text-muted-foreground">
          <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">←</kbd>
          <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px] ml-0.5">→</kbd>
          <span className="mx-1.5">navigate</span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Space</kbd>
          <span className="ml-1.5">flip</span>
        </p>
      </div>
    </div>
  );
};

