"use client";

import { CheckCircle, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnswerInput } from "./answer-input";
import { RouterOutputs } from "@goscribe/server";

type Worksheet = RouterOutputs['worksheets']['get'];
type WorksheetProblem = Worksheet['questions'][number];

/**
 * Props for the ProblemDisplay component
 */
interface ProblemDisplayProps {
  /** The worksheet data */
  worksheet: Worksheet;
  /** The current problem to display */
  problem: WorksheetProblem;
  /** Current problem index */
  currentProblemIndex: number;
  /** Total number of problems */
  totalProblems: number;
  /** Current user answer */
  currentAnswer: string;
  /** Whether the problem is completed */
  isCompleted: boolean;
  /** Whether the answer is incorrect */
  isIncorrect: boolean;
  /** Whether to show the correct answer */
  showAnswer: boolean;
  /** Callback when answer changes */
  onAnswerChange: (answer: string) => void;
  /** Callback when problem is completed */
  onComplete: () => void;
}

/**
 * Problem display component for showing individual worksheet problems
 * 
 * Features:
 * - Problem header with navigation info
 * - Question display
 * - Answer input with type-specific rendering
 * - Correct answer display (when enabled)
 * - Action buttons for completion
 * 
 * @param props - ProblemDisplayProps
 * @returns JSX element containing the problem display
 */
export const ProblemDisplay = ({
  worksheet,
  problem,
  currentProblemIndex,
  totalProblems,
  currentAnswer,
  isCompleted,
  isIncorrect,
  showAnswer,
  onAnswerChange,
  onComplete
}: ProblemDisplayProps) => {
  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-6">
        {/* Problem Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Problem {currentProblemIndex + 1} of {totalProblems}
            </span>
            {isCompleted && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {worksheet.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {worksheet.estimatedTime}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(worksheet.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Question</Label>
          <p className="text-sm leading-relaxed">{problem.prompt}</p>
        </div>

        {/* Answer Input */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Your Answer</Label>
          <AnswerInput
            problem={problem}
            currentAnswer={currentAnswer}
            isCompleted={isCompleted}
            isIncorrect={isIncorrect}
            onAnswerChange={onAnswerChange}
          />
        </div>

        {/* Show Answer */}
        {showAnswer && (
          <div className="space-y-2">
            <Label className="text-base font-medium">Correct Answer</Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">{problem.answer}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end pt-4 border-t">
          <Button
            onClick={onComplete}
            disabled={!currentAnswer.trim()}
            className="h-8"
          >
            {isCompleted ? 'Completed' : 'Submit Answer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
