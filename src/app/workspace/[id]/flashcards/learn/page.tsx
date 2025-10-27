"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, X, SkipForward } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useFlashcards } from "@/hooks/use-flashcards";
import { RouterOutputs } from "@goscribe/server";
import { cn } from "@/lib/utils";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

/**
 * ADDING NEW QUESTION MODES:
 * 
 * 1. Add your mode type to the QuestionMode union below (e.g., "true-false")
 * 2. Add it to the availableModes array in the useEffect (line ~58)
 * 3. Add a case for it in the checkAnswer switch statement (line ~99)
 * 4. Add the rendering logic in the CardContent section (line ~258)
 * 5. Update the subtitle text in the CardHeader if needed (line ~252)
 * 
 * Each card is randomly assigned a mode when the component loads,
 * creating a mixed learning experience!
 */

// Question mode types - easily extensible for future modes
type QuestionMode = "mcq" | "type" | "true-false" | "matching" | "fill-blank";

interface CardWithMode extends Flashcard {
  mode: QuestionMode;
}

/**
 * Flashcard learning mode component
 * 
 * Features:
 * - Mixed question types (MCQ and Type-in)
 * - Randomly assigned modes for variety
 * - Progress tracking
 * - Immediate feedback
 * - Extensible architecture for future modes
 * 
 * @returns JSX element containing the learning interface
 */
export default function FlashcardLearnPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const { cards, isLoading } = useFlashcards(workspaceId);

  const [cardsWithModes, setCardsWithModes] = useState<CardWithMode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  /**
   * Initialize cards with random modes
   */
  useEffect(() => {
    if (cards.length === 0) return;

    // Available modes for random assignment
    const availableModes: QuestionMode[] = ["mcq", "type"];
    // Future modes can be added here: "true-false", "matching", "fill-blank"

    const cardsWithRandomModes: CardWithMode[] = cards.map((card) => ({
      ...card,
      mode: availableModes[Math.floor(Math.random() * availableModes.length)]
    }));

    setCardsWithModes(cardsWithRandomModes);
  }, [cards]);

  const currentCard = cardsWithModes[currentIndex];
  const progress = ((currentIndex + (showFeedback ? 1 : 0)) / cardsWithModes.length) * 100;

  /**
   * Generate MCQ options for the current card
   */
  useEffect(() => {
    if (!currentCard || currentCard.mode !== "mcq") return;

    // Get random wrong answers from other cards
    const wrongAnswers = cardsWithModes
      .filter((card) => card.id !== currentCard.id)
      .map((card) => card.back)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Combine with correct answer and shuffle
    const options = [...wrongAnswers, currentCard.back].sort(() => Math.random() - 0.5);
    setMcqOptions(options);
  }, [currentCard, cardsWithModes]);

  /**
   * Check if the answer is correct
   */
  const checkAnswer = () => {
    if (!currentCard) return;

    let correct = false;

    // Check answer based on the current card's mode
    switch (currentCard.mode) {
      case "mcq":
        if (selectedOption !== null) {
          correct = mcqOptions[selectedOption] === currentCard.back;
        }
        break;
      case "type":
        // Normalize and compare answers (case-insensitive, trim whitespace)
        const normalizedUserAnswer = userAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = currentCard.back.trim().toLowerCase();
        correct = normalizedUserAnswer === normalizedCorrectAnswer;
        break;
      // Future modes can be added here:
      // case "true-false":
      //   correct = checkTrueFalse();
      //   break;
      // case "matching":
      //   correct = checkMatching();
      //   break;
      default:
        break;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  /**
   * Move to next card
   */
  const nextCard = () => {
    if (currentIndex < cardsWithModes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetCard();
    } else {
      // Show final score
      // For now, just go back
      router.push(`/workspace/${workspaceId}/flashcards`);
    }
  };

  /**
   * Skip current card
   */
  const skipCard = () => {
    nextCard();
  };

  /**
   * Reset card state
   */
  const resetCard = () => {
    setUserAnswer("");
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  if (isLoading || cardsWithModes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-muted-foreground font-medium">
              {isLoading ? "Loading flashcards..." : "No flashcards available to study."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (currentIndex >= cardsWithModes.length && showFeedback) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-6 pt-12 px-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">
                  {percentage >= 80 ? "🎉" : percentage >= 60 ? "👏" : "💪"}
                </div>
                <h2 className="text-3xl font-semibold">
                  {percentage >= 80 ? "Excellent Work!" : percentage >= 60 ? "Good Job!" : "Keep Practicing!"}
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-12">
              <div className="text-center space-y-3">
                <p className="text-6xl font-bold text-primary">
                  {score.correct} / {score.total}
                </p>
                <p className="text-lg text-muted-foreground">
                  You got {percentage}% correct
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => router.push(`/workspace/${workspaceId}/flashcards`)}
                  className="py-5 px-8 text-base font-medium rounded-lg hover:shadow-md transition-all duration-200"
                >
                  Back to Flashcards
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentIndex(0);
                    setScore({ correct: 0, total: 0 });
                    resetCard();
                  }}
                  className="py-5 px-8 text-base font-medium rounded-lg hover:bg-accent transition-all duration-200"
                >
                  Study Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted-foreground font-medium">
              {currentIndex + 1} / {cardsWithModes.length}
            </span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          <Progress value={progress} className="h-1.5 bg-secondary" />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {score.correct} correct
              </span>
              <span className="text-sm text-muted-foreground">
                out of {score.total}
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-6 pt-8 px-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-center leading-relaxed">
                {currentCard?.front}
              </h2>
              <p className="text-sm text-center text-muted-foreground font-medium">
                {currentCard?.mode === "mcq" ? "Select the correct answer" : "Type your answer"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            {/* Render question based on mode - easily extensible for new modes */}
            {currentCard?.mode === "mcq" && (
              /* Multiple Choice Options */
              <div className="space-y-3">
                {mcqOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showFeedback && setSelectedOption(index)}
                    disabled={showFeedback}
                    className={cn(
                      "w-full px-6 py-4 text-left rounded-lg transition-all duration-200",
                      "border border-border/60 hover:border-primary/50",
                      "hover:bg-accent/50 hover:shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20",
                      selectedOption === index && !showFeedback && "border-primary bg-primary/5 shadow-sm",
                      showFeedback && option === currentCard?.back && "border-green-500/60 bg-green-500/10 dark:bg-green-500/20",
                      showFeedback && selectedOption === index && option !== currentCard?.back && "border-red-500/60 bg-red-500/10 dark:bg-red-500/20",
                      showFeedback && "cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-base leading-relaxed">{option}</span>
                      {showFeedback && option === currentCard?.back && (
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                      {showFeedback && selectedOption === index && option !== currentCard?.back && (
                        <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentCard?.mode === "type" && (
              /* Type-in Answer */
              <div className="space-y-3">
                <Input
                  placeholder="Type your answer..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !showFeedback && userAnswer.trim()) {
                      checkAnswer();
                    }
                  }}
                  disabled={showFeedback}
                  className={cn(
                    "px-6 py-5 text-base rounded-lg border-border/60",
                    "focus:ring-2 focus:ring-primary/20",
                    "transition-all duration-200",
                    showFeedback && isCorrect && "border-green-500/60 bg-green-500/10 dark:bg-green-500/20",
                    showFeedback && !isCorrect && "border-red-500/60 bg-red-500/10 dark:bg-red-500/20"
                  )}
                />
                {showFeedback && !isCorrect && (
                  <div className="px-6 py-4 bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <span className="font-semibold">Correct answer:</span> {currentCard?.back}
                    </p>
                  </div>
                )}
              </div>
            )}

          {/* Future mode implementations can be added here:
          
          {currentCard?.mode === "true-false" && (
            <TrueFalseQuestion 
              card={currentCard}
              onAnswer={handleTrueFalseAnswer}
              showFeedback={showFeedback}
            />
          )}

          {currentCard?.mode === "matching" && (
            <MatchingQuestion 
              card={currentCard}
              onAnswer={handleMatchingAnswer}
              showFeedback={showFeedback}
            />
          )}

          {currentCard?.mode === "fill-blank" && (
            <FillBlankQuestion 
              card={currentCard}
              onAnswer={handleFillBlankAnswer}
              showFeedback={showFeedback}
            />
          )}
          */}

            {/* Feedback Message */}
            {showFeedback && (
              <div
                className={cn(
                  "px-6 py-5 rounded-lg text-center font-medium transition-all duration-200",
                  isCorrect 
                    ? "bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30" 
                    : "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30"
                )}
              >
                {isCorrect ? "✨ Correct! Well done!" : "Not quite right. Keep learning!"}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {!showFeedback ? (
                <>
                  <Button
                    onClick={checkAnswer}
                    disabled={
                      (currentCard?.mode === "mcq" && selectedOption === null) || 
                      (currentCard?.mode === "type" && !userAnswer.trim())
                    }
                    className="flex-1 py-5 text-base font-medium rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    Check Answer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={skipCard}
                    className="px-5 py-5 rounded-lg hover:bg-accent transition-all duration-200"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={nextCard} 
                  className="flex-1 py-5 text-base font-medium rounded-lg hover:shadow-md transition-all duration-200"
                >
                  {currentIndex < cardsWithModes.length - 1 ? "Next Card →" : "Finish"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

