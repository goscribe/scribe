"use client";

import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleShowAnswer}
          className="h-8"
        >
          {showAnswer ? 'Hide' : 'Show'} Answer
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetProgress}
          className="h-8"
        >
          Reset Progress
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentProblemIndex === 0}
          className="h-8"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentProblemIndex === totalProblems - 1}
          className="h-8"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
