"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
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
  onProblemChange
}: ProblemNavigationProps) => {
  if (totalProblems <= 1) {
    return null;
  }


  console.log("problemIds", problemIds);
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Problem Navigation</span>
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
        </div>
      </CardContent>
    </Card>
  );
};
