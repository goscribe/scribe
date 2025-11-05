"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props for the WorksheetControls component
 */
interface WorksheetControlsProps {
  /** Whether to show the answer */
  showAnswer: boolean;
  /** Callback to toggle show answer */
  onToggleShowAnswer: () => void;
  /** Callback to reset progress */
  onResetProgress: () => void;
  /** Current problem index */
  currentProblemIndex: number;
  /** Total number of problems */
  totalProblems: number;
  /** Callback when previous button is clicked */
  onPrevious: () => void;
  /** Callback when next button is clicked */
  onNext: () => void;
}

/**
 * Worksheet controls component for navigation and actions
 * 
 * Features:
 * - Show/hide answer toggle
 * - Reset progress button
 * - Previous/Next navigation buttons
 * 
 * @param props - WorksheetControlsProps
 * @returns JSX element containing the worksheet controls
 */
export const WorksheetControls = ({
  showAnswer,
  onToggleShowAnswer,
  onResetProgress,
  currentProblemIndex,
  totalProblems,
  onPrevious,
  onNext
}: WorksheetControlsProps) => {
  const hasPrevious = currentProblemIndex > 0;
  const hasNext = currentProblemIndex < totalProblems - 1;
  
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleShowAnswer}
              className={cn(
                "h-9 gap-2",
                showAnswer && "bg-primary/10 border-primary/20"
              )}
            >
              {showAnswer ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Hide Answer
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Show Answer
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetProgress}
              className="h-9 gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          
          {/* Center - Keyboard Hint */}
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Keyboard className="h-3.5 w-3.5" />
            <span>Use ← → arrows to navigate</span>
          </div>
          
          {/* Right Navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant={hasPrevious ? "outline" : "ghost"}
              size="sm"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="h-9 gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <div className="px-3 py-1 text-sm font-medium text-muted-foreground">
              {currentProblemIndex + 1} / {totalProblems}
            </div>
            
            <Button
              variant={hasNext ? "default" : "ghost"}
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="h-9 gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
