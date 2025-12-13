"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props for the ProblemNavigation component
 */
interface ProblemNavigationProps {
  /** Current problem index */
  currentProblemIndex: number;
  /** Total number of problems */
  totalProblems: number;
  /** Array of problem IDs */
  problemIds: string[];
  /** Set of completed problem IDs */
  correctAnswers: Set<string>;
  /** Set of incorrect problem IDs */
  incorrectAnswers: Set<string>;
  /** Callback when problem index changes */
  onProblemChange: (index: number) => void;
  /** Callback for previous button */
  onPrevious?: () => void;
  /** Callback for next button */
  onNext?: () => void;
  /** Callback for reset button */
  onReset?: () => void;
  /** Whether answer is being checked */
  isCheckingAnswer?: boolean;
}

/**
 * Problem navigation component for jumping between problems
 * 
 * Features:
 * - Numbered buttons for each problem
 * - Visual indication of current problem
 * - Quick navigation to any problem
 * 
 * @param props - ProblemNavigationProps
 * @returns JSX element containing the problem navigation
 */
export const ProblemNavigation = ({
  currentProblemIndex,
  totalProblems,
  problemIds,
  correctAnswers,
  incorrectAnswers,
  onProblemChange,
  onPrevious,
  onNext,
  onReset,
  isCheckingAnswer = false
}: ProblemNavigationProps) => {
  if (totalProblems <= 1) {
    return null;
  }

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Problem Navigation</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {correctAnswers.size > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{correctAnswers.size} correct</span>
                  </div>
                )}
                {incorrectAnswers.size > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>{incorrectAnswers.size} incorrect</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Previous/Next controls */}
          {(onPrevious || onNext) && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                          {/* Problem grid */}
          <div className="flex items-center gap-1 flex-wrap">
            {problemIds.map((problemId: string, index: number) => {
              const isCorrect = correctAnswers.has(problemId);
              const isIncorrect = incorrectAnswers.has(problemId);
              const isCurrent = index === currentProblemIndex;
              
              return (
                <Button
                  key={problemId}
                  variant={isCurrent ? "default" : "outline"}
                  size="sm"
                  onClick={() => onProblemChange(problemIds.indexOf(problemId))}
                  className={cn(
                    "h-8 w-8 p-0 transition-all",
                    isCorrect && !isIncorrect && !isCurrent && "border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400",
                    isIncorrect && !isCurrent && "border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400"
                  )}
                >
                  <span className={cn(
                    "text-xs",
                    isCorrect && !isCurrent && "font-medium"
                  )}>
                    {index + 1}
                  </span>
                </Button>
              );
            })}
          </div>
                {onReset && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {onPrevious && (
                  <Button
                    variant={currentProblemIndex > 0 ? "outline" : "ghost"}
                    size="sm"
                    onClick={onPrevious}
                    disabled={isCheckingAnswer || currentProblemIndex === 0}
                    className="h-8 gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
                
                <div className="px-3 py-1 text-sm font-medium text-muted-foreground">
                  {currentProblemIndex + 1} / {totalProblems}
                </div>
                
                {onNext && (
                  <Button
                    variant={currentProblemIndex < totalProblems - 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={onNext}
                    disabled={isCheckingAnswer || currentProblemIndex === totalProblems - 1}
                    className="h-8 gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
          
        </div>
      </CardContent>
    </Card>
  );
};
