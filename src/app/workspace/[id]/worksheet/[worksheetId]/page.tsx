"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { useWorksheet } from "@/hooks/use-worksheet";
import { WorksheetHeader } from "@/components/worksheet/worksheet-header";
import { ProblemDisplay } from "@/components/worksheet/problem-display";
import { ProblemNavigation } from "@/components/worksheet/problem-navigation";
import { WorksheetControls } from "@/components/worksheet/worksheet-controls";
import { ArrowLeft } from "lucide-react";

/**
 * Worksheet view page component for displaying and completing worksheets
 * 
 * Features:
 * - Real-time worksheet updates via Pusher
 * - Progress tracking and answer saving
 * - Problem navigation and completion
 * - Answer validation and feedback
 * 
 * @returns JSX element containing the worksheet view page
 */
export default function WorksheetViewPage() {
  const params = useParams();
  const router = useRouter();
  const worksheetId = params.worksheetId as string;
  const workspaceId = params.id as string;

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  // Custom hook for worksheet detail operations with real-time updates
  const {
    worksheet,
    isLoading,
    error,
    userAnswers,
    completedProblems,
    showAnswers,
    incorrectAnswers,
    updateAnswer,
    completeProblem,
    toggleShowAnswers,
    resetProgress,
  } = useWorksheet(workspaceId, worksheetId);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 -ml-2">
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back
        </Button>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !worksheet) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 -ml-2">
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back
        </Button>
        <Card className="border-destructive">
          <CardContent className="p-8 text-center">
            <p className="text-destructive text-sm">
              {error?.message || "Worksheet not found"}
            </p>
            <Button onClick={() => router.back()} className="mt-4" variant="outline" size="sm">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentProblem = worksheet.questions[currentProblemIndex];
  const totalProblems = worksheet.questions.length;
  const completedCount = completedProblems?.size || 0;
  const progressPercentage = totalProblems > 0 ? (completedCount / totalProblems) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Header */}
      <WorksheetHeader
        worksheet={worksheet}
        progressPercentage={progressPercentage}
        completedCount={completedCount}
        totalProblems={totalProblems}
        onBack={() => router.back()}
        onEdit={() => router.push(`/workspace/${workspaceId}/worksheet/${worksheetId}/edit`)}
      />

      {/* Current Problem */}
      {currentProblem && (
        <ProblemDisplay
          worksheet={worksheet}
          problem={currentProblem}
          currentProblemIndex={currentProblemIndex}
          totalProblems={totalProblems}
          currentAnswer={userAnswers?.[currentProblem.id] || ''}
          isCompleted={completedProblems?.has(currentProblem.id) || false}
          isIncorrect={incorrectAnswers?.has(currentProblem.id) || false}
          showAnswer={showAnswers || false}
          onAnswerChange={(answer) => updateAnswer?.(currentProblem.id, answer)}
          onComplete={() => completeProblem?.(currentProblem.id)}
        />
      )}

      {/* Controls */}
      <WorksheetControls
        showAnswer={showAnswers || false}
        onToggleShowAnswer={toggleShowAnswers || (() => {})}
        onResetProgress={resetProgress || (() => {})}
        currentProblemIndex={currentProblemIndex}
        totalProblems={totalProblems}
        onPrevious={() => setCurrentProblemIndex(Math.max(0, currentProblemIndex - 1))}
        onNext={() => setCurrentProblemIndex(Math.min(totalProblems - 1, currentProblemIndex + 1))}
      />

      {/* Problem Navigation */}
      <ProblemNavigation
        currentProblemIndex={currentProblemIndex}
        totalProblems={totalProblems}
        onProblemChange={setCurrentProblemIndex}
      />
    </div>
  );
};