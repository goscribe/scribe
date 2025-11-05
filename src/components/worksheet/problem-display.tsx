"use client";

import { useState } from "react";
import { CheckCircle, Clock, Calendar, BookOpen, Target, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnswerInput } from "./answer-input";
import { MarkScheme } from "./mark-scheme";
import { RouterOutputs } from "@goscribe/server";
import { cn } from "@/lib/utils";
import { UserMarkSchemePoint, WorksheetQuestionMeta } from "@/types/worksheet";

type Worksheet = RouterOutputs['worksheets']['get'];
type WorksheetProblem = Worksheet['questions'][number] & { meta: WorksheetQuestionMeta };

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
  onComplete,
}: ProblemDisplayProps) => {
  const [showMarkScheme, setShowMarkScheme] = useState(false);
  const progressPercentage = ((currentProblemIndex + 1) / totalProblems) * 100;
  
  // Determine problem difficulty
  const getDifficultyBadge = () => {
    const difficulty = problem.difficulty || worksheet.difficulty || 'medium';
    const configs = {
      easy: { label: 'Easy', className: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20' },
      medium: { label: 'Medium', className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20' },
      hard: { label: 'Hard', className: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20' }
    };
    return configs[difficulty as keyof typeof configs] || configs.medium;
  };
  
  const difficulty = getDifficultyBadge();
  
  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Problem {currentProblemIndex + 1} of {totalProblems}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {worksheet.title}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-xs", difficulty.className)}>
                  {difficulty.label}
                </Badge>
                {isCompleted && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      isIncorrect 
                        ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20"
                        : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20"
                    )}
                  >
                    {isIncorrect ? (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Incorrect
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Correct
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Progress value={progressPercentage} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(progressPercentage)}% complete</span>
                <div className="flex items-center gap-3">
                  {worksheet.estimatedTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {worksheet.estimatedTime}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {(problem.meta as WorksheetQuestionMeta)?.mark_scheme?.totalPoints || 1} marks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Problem Card */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Question */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <Label className="text-base font-semibold">Question</Label>
            </div>
            <div className="pl-3.5">
              <p className="text-sm leading-relaxed text-foreground/90">{problem.prompt}</p>
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <Label className="text-base font-semibold">Your Answer</Label>
            </div>
            <div className="pl-3.5">
              <AnswerInput
                problem={problem}
                currentAnswer={currentAnswer}
                isCompleted={isCompleted}
                isIncorrect={isIncorrect}
                onAnswerChange={onAnswerChange}
              />
            </div>
          </div>

          {/* Show Answer (Enhanced) */}
          {showAnswer && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <Label className="text-base font-semibold text-green-600 dark:text-green-400">
                  Correct Answer
                </Label>
              </div>
              <div className="pl-3.5">
                <Card className="border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/5">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium">{problem.answer}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {isCompleted && (problem.meta as WorksheetQuestionMeta)?.userMarkScheme && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMarkScheme(!showMarkScheme)}
                  className="text-xs"
                >
                  {showMarkScheme ? 'Hide' : 'Show'} Mark Scheme
                </Button>
              )}
            </div>
            
            <Button
              onClick={onComplete}
              disabled={!currentAnswer.trim()}
              size="sm"
              className={cn(
                isCompleted && !isIncorrect && "bg-green-600 hover:bg-green-700"
              )}
            >
              {isCompleted ? (
                isIncorrect ? 'Try Again' : 'Next Problem'
              ) : (
                <>
                  Submit Answer
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mark Scheme (if available and shown) */}
      {isCompleted && (problem.meta as WorksheetQuestionMeta)?.userMarkScheme && showMarkScheme && (
        <MarkScheme
          questionTitle={`Problem ${currentProblemIndex + 1}`}
          userAnswer={currentAnswer}
          modelAnswer={problem.answer || ''}
          markPoints={(problem.meta as WorksheetQuestionMeta)?.userMarkScheme?.points || []}
          totalMarks={(problem.meta as WorksheetQuestionMeta)?.userMarkScheme?.totalPoints || 0}
          marksAchieved={(problem.meta as WorksheetQuestionMeta)?.userMarkScheme?.points.reduce((sum: number, point: UserMarkSchemePoint) => sum + (point.achievedPoints || 0), 0) || 0}
          feedback={undefined}
        />
      )}
    </div>
  );
};
