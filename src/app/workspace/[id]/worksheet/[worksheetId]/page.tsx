"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter } from "next/navigation";
import { useWorksheet } from "@/hooks/use-worksheet";
import { AnswerInput } from "@/components/worksheet/answer-input";
import { ProblemNavigation } from "@/components/worksheet/problem-navigation";
import { MarkScheme } from "@/components/worksheet/mark-scheme";
import type { WorksheetQuestionMeta, UserMarkSchemePoint } from "@/types/worksheet";

import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  Target,
  Clock,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    correctAnswers,
    resetProgress,
    isCheckingAnswer,
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
  const progressPercentage = ((currentProblemIndex + 1) / totalProblems) * 100;
  
  // Cast meta to proper type
  const problemMeta: WorksheetQuestionMeta = currentProblem?.meta as WorksheetQuestionMeta;
    
  const isCompleted = completedProblems?.has(currentProblem.id) || false;
  const isIncorrect = incorrectAnswers?.has(currentProblem.id) || false;
  const currentAnswer = userAnswers?.[currentProblem.id] || '';

  const handleNext = () => {
    if (currentProblemIndex < totalProblems - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  };
  
  const getDifficultyConfig = () => {
    const difficulty = worksheet.difficulty || 'medium';
    const configs = {
      easy: { label: 'Easy', className: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20' },
      medium: { label: 'Medium', className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20' },
      hard: { label: 'Hard', className: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20' }
    };
    return configs[difficulty.toLowerCase() as keyof typeof configs] || configs.medium;
  };
  
  const difficultyConfig = getDifficultyConfig();
  

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6 px-4">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-stretch">
        {/* Left Column: Question and Answer */}
        <div className="min-w-0 flex max-h-[600px]">
          <Card className="border-border/50 shadow-sm flex-1 flex flex-col overflow-hidden">
            <CardContent className="p-6 flex-1 flex flex-col min-h-0">
              {/* Header Section */}
              <div className="flex-shrink-0 space-y-4 mb-6 pb-6 border-b">

                {/* Worksheet Title and Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className=" flex items-center gap-2 text-lg font-medium">
                        <span>{worksheet.title}</span>
                        <Badge variant="outline" className={cn("text-xs", difficultyConfig.className)}>
                          {difficultyConfig.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {completedCount} of {totalProblems} completed
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCheckingAnswer ? (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-primary/10 text-primary border-primary/20"
                        >
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Checking...
                        </Badge>
                      ) : isCompleted && (
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
                  
                  <div className="space-y-2">
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{Math.round(progressPercentage)}% complete</span>
                      <div className="flex items-center gap-3">
                        {worksheet.estimatedTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {worksheet.estimatedTime}
                          </span>
                        )}
                        {problemMeta?.markScheme && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {problemMeta.markScheme.totalPoints} marks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col">
                {/* Question */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <p className="text-base font-semibold">Question</p>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 pl-3.5">
                    {currentProblem.prompt}
                  </p>
                </div>

                {/* Answer Input */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <p className="text-base font-semibold">Your Answer</p>
                  </div>
                  <div className="pl-3.5 flex-1 flex flex-col min-h-0">
                    <AnswerInput
                      problem={currentProblem}
                      currentAnswer={currentAnswer}
                      isCompleted={isCompleted}
                      isIncorrect={isIncorrect}
                      disabled={isCheckingAnswer}
                      onAnswerChange={(answer) => updateAnswer?.(currentProblem.id, answer)}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="flex items-center justify-between pt-4 border-t flex-shrink-0 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleShowAnswers}
                  className={cn(
                    "h-8 gap-2",
                    showAnswers && "bg-primary/10 border-primary/20"
                  )}
                >
                  {showAnswers ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Hide Answer
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Show Answer
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => completeProblem?.(currentProblem.id)}
                  disabled={!currentAnswer.trim().length || isCheckingAnswer || (isCompleted && !isIncorrect)}
                  size="sm"
                  className={cn(
                    "h-8 min-w-[120px]",
                    isCompleted && !isIncorrect && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {isCheckingAnswer ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Checking...
                    </>
                  ) : isCompleted ? (
                    isIncorrect ? 'Try Again' : 'Completed'
                  ) : (
                    'Submit Answer'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Feedback and Mark Scheme */}
        <div className="min-w-0 flex max-h-[600px]">
          {showAnswers ? (
            /* Mark Scheme with feedback when answers are shown */
            (problemMeta?.markScheme || problemMeta?.userMarkScheme) && (
              <div className="flex-1 flex flex-col min-h-0">
                {(() => {
                  // Use userMarkScheme if completed and available, otherwise use mark_scheme
                  const markScheme = (isCompleted && problemMeta?.userMarkScheme) 
                    ? problemMeta.userMarkScheme 
                    : problemMeta?.markScheme;
                  
                  if (!markScheme) return null;
                  
                  if (isCompleted && problemMeta?.userMarkScheme) {
                    // Show user's personalized mark scheme with their feedback
                    const userMarkScheme = problemMeta.userMarkScheme;
                    const referenceMarkScheme = problemMeta.markScheme;
                    
                    const markPoints = userMarkScheme.points;
                    
                    const totalAchieved = userMarkScheme.points.reduce((sum: number, point: UserMarkSchemePoint) => sum + (point.achievedPoints || 0), 0);
                    
                    return (
                      <MarkScheme
                        questionTitle={`Problem ${currentProblemIndex + 1}`}
                        userAnswer={currentAnswer}
                        modelAnswer={currentProblem.answer || 'No answer provided'}
                        markPoints={markPoints}
                        totalMarks={referenceMarkScheme?.totalPoints || 0}
                        marksAchieved={totalAchieved}
                        feedback={undefined}
                        showDetails={true}
                      />
                    );
                  } else if (markScheme) {
                    // Show mark scheme without user feedback (preview mode)
                    return (
                      <Card className="border-border/50 shadow-sm flex-1 flex flex-col">
                        <CardContent className="p-4 space-y-3 flex-1 flex flex-col min-h-0">
                          <div className="flex items-center justify-between mb-2 flex-shrink-0">
                            <span className="text-sm font-medium">Available Marks</span>
                            <Badge variant="outline" className="text-xs">
                              {markScheme.totalPoints} total marks
                            </Badge>
                          </div>
                          <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-2">
                            {markScheme.points.map((point, index: number) => (
                              <div 
                                key={index}
                                className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30"
                              >
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-xs font-medium flex-shrink-0">
                                  {point.point}
                                </div>
                                <p className="text-sm flex-1">
                                  {point.requirements}
                                </p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground pt-2 flex-shrink-0">
                            Submit your answer to see detailed feedback and marks achieved.
                          </p>
                        </CardContent>
                      </Card>
                    );
                  }
                  
                  return null;
                })()}
              </div>
            )
          ) : (
            /* Placeholder when answers are hidden */
            <Card className="border-border/50 shadow-sm flex-1 flex flex-col">
              <CardContent className="p-6 flex items-center justify-center flex-1 min-h-[200px]">
                <div className="text-center space-y-2">
                  <Eye className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    Click "Show Answer" to view feedback and mark scheme
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Problem Navigation Grid */}
      <ProblemNavigation
        currentProblemIndex={currentProblemIndex}
        totalProblems={totalProblems}
        problemIds={worksheet.questions.map(q => q.id)}
        correctAnswers={correctAnswers || new Set()}
        incorrectAnswers={incorrectAnswers || new Set()}
        onProblemChange={setCurrentProblemIndex}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onReset={resetProgress}
        isCheckingAnswer={isCheckingAnswer}
      />

    </div>
  );
};