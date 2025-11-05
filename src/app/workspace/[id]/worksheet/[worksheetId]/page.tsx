"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
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
  const problemMeta: WorksheetQuestionMeta = currentProblem.meta as WorksheetQuestionMeta;
    
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
    <div className="max-w-4xl mx-auto space-y-4 py-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-8"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/workspace/${workspaceId}/worksheet/${worksheetId}/edit`)}
          className="h-8"
        >
          <Edit3 className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>
      </div>

      {/* Title Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{worksheet.title}</h1>
        {worksheet.description && (
          <p className="text-sm text-muted-foreground">{worksheet.description}</p>
        )}
      </div>

      {/* Progress Card */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Problem {currentProblemIndex + 1} of {totalProblems}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {completedCount} completed
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-xs", difficultyConfig.className)}>
                  {difficultyConfig.label}
                </Badge>
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
            
            <div className="space-y-1.5">
              <Progress value={progressPercentage} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(progressPercentage)}% complete</span>
                <div className="flex items-center gap-3">
                  {worksheet.estimatedTime && (
                    <span>{worksheet.estimatedTime}</span>
                  )}
                  {problemMeta?.mark_scheme && (
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {problemMeta.mark_scheme.totalPoints} marks
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Problem Content */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Question */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-base font-semibold">Question</p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 pl-3.5">
              {currentProblem.prompt}
            </p>
          </div>

          {/* Answer Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-base font-semibold">Your Answer</p>
            </div>
            <div className="pl-3.5">
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

          {/* Show Answer - displays correct answer and basic feedback */}
          {showAnswers && (
            <>
              {!problemMeta?.userMarkScheme && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <p className="text-base font-semibold text-green-600 dark:text-green-400">
                    Correct Answer
                  </p>
                </div>
                <Card className="ml-3.5 border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/5">
                  <CardContent className="p-4">
                  <p className="text-sm font-medium">{currentProblem.answer || ''}</p>
                  
                    
                    {/* Quick feedback if user has answered */}
                    {isCompleted && currentAnswer && (
                      <div className={cn(
                        "mt-3 pt-3 border-t",
                        isIncorrect 
                          ? "border-red-200 dark:border-red-500/20" 
                          : "border-green-200 dark:border-green-500/20"
                      )}>
                        <div className="flex items-start gap-2">
                          {isIncorrect ? (
                            <>
                              <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5" />
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                  Your answer: "{currentAnswer}"
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Compare your answer with the correct one above.
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5" />
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Correct! Well done.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>)}

              {/* Show Mark Scheme - with user feedback if completed, without if not */}
              {(problemMeta?.mark_scheme || problemMeta?.userMarkScheme) && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <p className="text-base font-semibold">
                      {isCompleted && problemMeta?.userMarkScheme ? 'Your Mark Breakdown' : 'Mark Scheme'}
                    
                    </p>
                  </div>
                  <div className="pl-3.5">
                    {(() => {
                      // Use userMarkScheme if completed and available, otherwise use mark_scheme
                      const markScheme = (isCompleted && problemMeta?.userMarkScheme) 
                        ? problemMeta.userMarkScheme 
                        : problemMeta?.mark_scheme;
                      
                      if (!markScheme) return null;
                      
                      if (isCompleted && problemMeta?.userMarkScheme) {
                        // Show user's personalized mark scheme with their feedback
                        const userMarkScheme = problemMeta.userMarkScheme;
                        const referenceMarkScheme = problemMeta.mark_scheme;
                        
                        const markPoints = userMarkScheme.points;
                        
                        const totalAchieved = userMarkScheme.points.reduce((sum: number, point: UserMarkSchemePoint) => sum + (point.achievedPoints || 0), 0);
                        
                        return (
                          <MarkScheme
                            questionTitle={`Problem ${currentProblemIndex + 1}`}
                            userAnswer={currentAnswer}
                            modelAnswer={(currentProblem.meta as WorksheetQuestionMeta).userAnswer || 'No answer provided'}
                            markPoints={markPoints}
                            totalMarks={referenceMarkScheme?.totalPoints || 0}
                            marksAchieved={totalAchieved}
                            feedback={undefined} // Individual point feedback is already shown
                            showDetails={true}
                          />
                        );
                      } else if (markScheme) {
                        // Show mark scheme without user feedback (preview mode)
                        return (
                          <Card className="border-border/50">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Available Marks</span>
                                <Badge variant="outline" className="text-xs">
                                  {markScheme.totalPoints} total marks
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {markScheme.points.map((point, index: number) => (
                                  <div 
                                    key={index}
                                    className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30"
                                  >
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-xs font-medium">
                                      {point.point}
                                    </div>
                                    <p className="text-sm flex-1">
                                      {point.requirements}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground pt-2">
                                Submit your answer to see detailed feedback and marks achieved.
                              </p>
                            </CardContent>
                          </Card>
                        );
                      }
                      
                      return null;
                    })()}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
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
              
            </div>
            
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

      {/* Navigation Controls */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetProgress}
              className="h-8 gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            
            <div className="flex items-center gap-1">
            <Button
              variant={currentProblemIndex > 0 ? "outline" : "ghost"}
              size="sm"
              onClick={handlePrevious}
              disabled={isCheckingAnswer || currentProblemIndex === 0}
              className="h-8 gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="px-3 py-1 text-sm font-medium text-muted-foreground">
              {currentProblemIndex + 1} / {totalProblems}
            </div>
            
            <Button
              variant={currentProblemIndex < totalProblems - 1 ? "default" : "ghost"}
              size="sm"
              onClick={handleNext}
              disabled={isCheckingAnswer || currentProblemIndex === totalProblems - 1}
              className="h-8 gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem Navigation Grid */}
      <ProblemNavigation
        currentProblemIndex={currentProblemIndex}
        totalProblems={totalProblems}
        problemIds={worksheet.questions.map(q => q.id)}
        correctAnswers={correctAnswers || new Set()}
        incorrectAnswers={incorrectAnswers || new Set()}
        onProblemChange={setCurrentProblemIndex}
      />

    </div>
  );
};