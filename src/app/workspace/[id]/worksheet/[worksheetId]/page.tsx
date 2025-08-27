    "use client";

    import { useState, useEffect } from "react";
    import { ArrowLeft, CheckCircle, Clock, Calendar, Edit3 } from "lucide-react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Label } from "@/components/ui/label";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
    import { Progress } from "@/components/ui/progress";
    import { trpc } from "@/lib/trpc";
    import { useParams, useRouter } from "next/navigation";
    import { toast } from "sonner";
    import { RouterOutputs } from "@goscribe/server";

    type Worksheet = RouterOutputs['worksheets']['get'];
    type WorksheetProblem = Worksheet['questions'][number];


    export default function WorksheetViewPage() {
      const params = useParams();
      const router = useRouter();
      const worksheetId = params.worksheetId as string;
      const workspaceId = params.id as string;

      const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
      const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
      const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
      const [showAnswers, setShowAnswers] = useState(false);
      const [incorrectAnswers, setIncorrectAnswers] = useState<Set<string>>(new Set());

      // Fetch worksheet data
      const { data: worksheet, isLoading, error } = trpc.worksheets.get.useQuery(
        { worksheetId },
        { enabled: !!worksheetId }
      );

      // Fetch user's progress for this worksheet
      const { data: progressData, isLoading: progressLoading } = trpc.worksheets.getProgress.useQuery(
        { worksheetId },
        { enabled: !!worksheetId }
      );

      const updateProblemMutation = trpc.worksheets.updateProblemStatus.useMutation({
        onSuccess: () => {
          toast.success("Answer saved!");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save answer");
        },
      });

      // Initialize completed problems from worksheet data and progress data
      useEffect(() => {
        if (worksheet && progressData) {
          // Create a map of question progress for quick lookup
          const progressMap = new Map(
            progressData.map(progress => [progress.worksheetQuestionId, progress])
          );

          const completed = new Set<string>();
          const answers: Record<string, string> = {};

          worksheet.questions.forEach((problem: WorksheetProblem) => {
            const progress = progressMap.get(problem.id);
            
            // Check if question is completed based on progress data
            if (progress?.completed) {
              completed.add(problem.id);
            }
            
            // Initialize user answers from progress data
            if (progress?.userAnswer) {
              answers[problem.id] = progress.userAnswer;
            }
          });

          setCompletedProblems(completed);
          setUserAnswers(answers);
        }
      }, [worksheet, progressData]);

      const handleAnswerChange = (problemId: string, answer: string) => {
        setUserAnswers(prev => ({
          ...prev,
          [problemId]: answer
        }));
      };

      const handleCompleteProblem = (problemId: string) => {
        const answer = userAnswers[problemId] || '';
        const problem = worksheet.questions.find((q: WorksheetProblem) => q.id === problemId);
        
        if (!problem) return;
        
        // Check if answer is correct
        const isCorrect = checkAnswer(answer, problem.answer || '', problem.type);
        
        // Only mark as completed if answer is correct
        const completed = isCorrect === true;
        
        updateProblemMutation.mutate({
          problemId,
          completed,
          answer,
        });
        
        if (completed) {
          setCompletedProblems(prev => new Set([...prev, problemId]));
          setIncorrectAnswers(prev => {
            const newSet = new Set(prev);
            newSet.delete(problemId);
            return newSet;
          });
          
          // Auto-advance to next problem if not the last one
          if (currentProblemIndex < worksheet.questions.length - 1) {
            setCurrentProblemIndex(currentProblemIndex + 1);
          }
        } else {
          // Mark as incorrect and show error message
          setIncorrectAnswers(prev => new Set([...prev, problemId]));
          toast.error("Incorrect answer. Please try again.");
        }
      };

      const handleSkipProblem = (problemId: string) => {
        updateProblemMutation.mutate({
          problemId,
          completed: false,
        });

        // Auto-advance to next problem if not the last one
        if (currentProblemIndex < worksheet.questions.length - 1) {
          setCurrentProblemIndex(currentProblemIndex + 1);
        }
      };

      const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
          case 'EASY': return 'bg-green-100 text-green-800 border-green-200';
          case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'HARD': return 'bg-red-100 text-red-800 border-red-200';
          default: return 'bg-muted text-muted-foreground';
        }
      };

      const checkAnswer = (userAnswer: string, correctAnswer: string, type: string) => {
        if (!userAnswer.trim() || !correctAnswer.trim()) return null;
        
        const normalizedUser = userAnswer.trim().toLowerCase();
        const normalizedCorrect = correctAnswer.trim().toLowerCase();
        
        switch (type) {
          case 'MULTIPLE_CHOICE':
            // For multiple choice, compare the selected option text
            return normalizedUser === normalizedCorrect;
          
          case 'NUMERIC':
            // For numeric answers, allow for small differences and different formats
            const userNum = parseFloat(normalizedUser);
            const correctNum = parseFloat(normalizedCorrect);
            if (!isNaN(userNum) && !isNaN(correctNum)) {
              return Math.abs(userNum - correctNum) < 0.01;
            }
            return normalizedUser === normalizedCorrect;
          
          case 'TRUE_FALSE':
            // For true/false, be more flexible with variations
            const userBool = normalizedUser === 'true' || normalizedUser === 't' || normalizedUser === 'yes';
            const correctBool = normalizedCorrect === 'true' || normalizedCorrect === 't' || normalizedCorrect === 'yes';
            return userBool === correctBool;
          
          default:
            // For text-based answers, do exact comparison
            return normalizedUser === normalizedCorrect;
        }
      };

      const getAnswerStatus = (problem: WorksheetProblem) => {
        const userAnswer = userAnswers[problem.id] || '';
        const correctAnswer = problem.answer || '';
        
        if (!userAnswer.trim() || !correctAnswer.trim()) return null;
        
        const isCorrect = checkAnswer(userAnswer, correctAnswer, problem.type);
        
        if (isCorrect === null) return null;
        
        return {
          isCorrect,
          userAnswer,
          correctAnswer,
          type: problem.type
        };
      };

      const renderProblemInput = (problem: WorksheetProblem) => {
        const currentAnswer = userAnswers[problem.id] || '';
        const isCompleted = completedProblems.has(problem.id);

        switch (problem.type) {
          case 'MULTIPLE_CHOICE':
            return (
              <RadioGroup
                value={currentAnswer}
                onValueChange={(value) => handleAnswerChange(problem.id, value)}
                className="space-y-3"
                disabled={isCompleted}
              >
                {problem.options?.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${problem.id}-${index}`}
                      disabled={isCompleted}
                    />
                    <Label htmlFor={`option-${problem.id}-${index}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            );

          case 'TRUE_FALSE':
            return (
              <RadioGroup
                value={currentAnswer}
                onValueChange={(value) => handleAnswerChange(problem.id, value)}
                className="space-y-3"
                disabled={isCompleted}
              >
                {['True', 'False'].map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${problem.id}-${index}`}
                      disabled={isCompleted}
                    />
                    <Label htmlFor={`option-${problem.id}-${index}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            );

          case 'MATCHING':
            return (
              <div className="space-y-3">
                {problem.options?.map((option: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <Label className="min-w-[120px] text-sm font-medium">{option}</Label>
                    <Input
                      placeholder="Match with..."
                      value={currentAnswer}
                      onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                      className="flex-1"
                      disabled={isCompleted}
                    />
                  </div>
                ))}
              </div>
            );
          case 'FILL_IN_THE_BLANK':
            return (
              <Input
                placeholder="Fill in the blank"
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                disabled={isCompleted}
              />
            );

          case 'NUMERIC':
            return (
              <Input
                type="number"
                placeholder="Enter your answer"
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                disabled={isCompleted}
              />
            );

          case 'TEXT':
          default:
            return (
              <Textarea
                placeholder="Enter your answer"
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                rows={3}
                disabled={isCompleted}
              />
            );
        }
      };

      if (isLoading || progressLoading) {
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        );
      }

      if (error || !worksheet) {
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <Card className="border-destructive">
              <CardContent className="p-8 text-center">
                <p className="text-destructive">
                  {error?.message || "Worksheet not found"}
                </p>
                <Button 
                  onClick={() => router.back()} 
                  className="mt-2" 
                  variant="outline"
                >
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }

      const currentProblem = worksheet.questions[currentProblemIndex];
      const progress = (completedProblems.size / worksheet.questions.length) * 100;
      const isLastProblem = currentProblemIndex === worksheet.questions.length - 1;

      return (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{worksheet.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline" className={getDifficultyColor(worksheet.difficulty!)}>
                    {worksheet.difficulty}
                  </Badge>
                  {worksheet.estimatedTime && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {worksheet.estimatedTime}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(worksheet.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnswers(!showAnswers)}
              >
                {showAnswers ? 'Hide' : 'Show'} Answers
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/workspace/${workspaceId}/worksheet/${worksheetId}/edit`)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Description */}
          {worksheet.description && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {worksheet.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">
                    {completedProblems.size}/{worksheet.questions.length} completed
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Problem Navigation */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-3 block">Problem Navigation</Label>
              <div className="flex flex-wrap gap-2">
                {worksheet.questions.map((problem: WorksheetProblem, index: number) => (
                  <Button
                    key={problem.id}
                    size="sm"
                    variant={index === currentProblemIndex ? "default" : "outline"}
                    onClick={() => setCurrentProblemIndex(index)}
                    className={`h-8 w-8 p-0 ${
                      completedProblems.has(problem.id) 
                        ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200' 
                        : incorrectAnswers.has(problem.id)
                        ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200'
                        : ''
                    }`}
                  >
                    {completedProblems.has(problem.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : incorrectAnswers.has(problem.id) ? (
                      <span className="text-xs text-red-700">✗</span>
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Problem */}
          {currentProblem && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Question {currentProblemIndex + 1} of {worksheet.questions.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Question</Label>
                  <p className="mt-2 text-base leading-relaxed">{currentProblem.prompt}</p>
                </div>
                
                <div>
                  <Label className="text-base font-medium">Your Answer</Label>
                  <div className="mt-2">
                    {renderProblemInput({
                      id: currentProblem.id,
                      question: currentProblem.prompt,
                      answer: currentProblem.answer!,
                      type: currentProblem.type,
                      options: currentProblem.meta?.options,
                      completed: progressData?.find(p => p.worksheetQuestionId === currentProblem.id)?.completed || false,
                      order: currentProblem.order,
                      userAnswer: progressData?.find(p => p.worksheetQuestionId === currentProblem.id)?.userAnswer || '',
                    })}
                  </div>
                  
                  {/* Incorrect Answer Warning */}
                  {incorrectAnswers.has(currentProblem.id) && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <p className="text-sm font-medium text-red-800">
                          Incorrect Answer
                        </p>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        Your answer is not correct. Please review the question and try again.
                      </p>
                      <div className="mt-2 text-xs text-red-600">
                        <strong>Tip:</strong> {(() => {
                          switch (currentProblem.type) {
                            case 'NUMERIC':
                              return "Check your calculation and make sure to include units if required.";
                            case 'TRUE_FALSE':
                              return "Make sure you entered exactly 'True' or 'False'.";
                            case 'MULTIPLE_CHOICE':
                              return "Review the options carefully and select the best answer.";
                            case 'TEXT':
                              return "Check your spelling and make sure your answer is complete.";
                            case 'FILL_IN_THE_BLANK':
                              return "Be specific about the exact word or phrase expected.";
                            case 'MATCHING':
                              return "Make sure your matching pairs are correct.";
                            default:
                              return "Review your answer and try again.";
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Answer Comparison */}
                {showAnswers && currentProblem.answer && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-medium">Answer Check</Label>
                      {(() => {
                        const status = getAnswerStatus(currentProblem);
                        if (!status) return null;
                        
                        return (
                          <Badge 
                            variant={status.isCorrect ? "default" : "destructive"}
                            className={status.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {status.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                          </Badge>
                        );
                      })()}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Your Answer:</Label>
                        <div className="mt-1 p-2 bg-background border rounded">
                          <span className="text-sm">
                            {userAnswers[currentProblem.id] || "No answer provided"}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Correct Answer:</Label>
                        <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded">
                          <span className="text-sm text-green-800">
                            {currentProblem.answer}
                          </span>
                        </div>
                      </div>
                      
                      {(() => {
                        const status = getAnswerStatus(currentProblem);
                        if (!status || status.isCorrect) return null;
                        
                        return (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                            <p className="text-sm text-amber-800">
                              <strong>Tip:</strong> {(() => {
                                switch (currentProblem.type) {
                                  case 'NUMERIC':
                                    return "Check your calculation and make sure to include units if required.";
                                  case 'TRUE_FALSE':
                                    return "Make sure you entered exactly 'True' or 'False'.";
                                  case 'MULTIPLE_CHOICE':
                                    return "Review the options carefully and select the best answer.";
                                  case 'TEXT':
                                    return "Check your spelling and make sure your answer is complete.";
                                  default:
                                    return "Review your answer and try again.";
                                }
                              })()}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {currentProblemIndex > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentProblemIndex(currentProblemIndex - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  
                  <div className="flex gap-2 ml-auto">
                    {!completedProblems.has(currentProblem.id) && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleSkipProblem(currentProblem.id)}
                          disabled={updateProblemMutation.isPending}
                        >
                          Skip
                        </Button>
                        <Button
                          onClick={() => handleCompleteProblem(currentProblem.id)}
                          disabled={updateProblemMutation.isPending || !userAnswers[currentProblem.id]?.trim()}
                        >
                          {isLastProblem ? 'Finish' : 'Next'}
                        </Button>
                      </>
                    )}
                    {completedProblems.has(currentProblem.id) && (
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          ✓ Completed
                        </Badge>
                        {!isLastProblem && (
                          <Button
                            variant="outline"
                            onClick={() => setCurrentProblemIndex(currentProblemIndex + 1)}
                          >
                            Next Question
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }
