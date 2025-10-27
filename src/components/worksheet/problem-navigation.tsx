"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Props for the ProblemNavigation component
 */
interface ProblemNavigationProps {
  /** Current problem index */
  currentProblemIndex: number;
  /** Total number of problems */
  totalProblems: number;
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
  onProblemChange
}: ProblemNavigationProps) => {
  if (totalProblems <= 1) {
    return null;
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Problem Navigation</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalProblems }, (_, index) => (
              <Button
                key={index}
                variant={index === currentProblemIndex ? "default" : "outline"}
                size="sm"
                onClick={() => onProblemChange(index)}
                className="h-8 w-8 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
