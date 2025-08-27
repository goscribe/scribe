    "use client";

    import { useState, useEffect } from "react";
    import { ArrowLeft, CheckCircle, Circle, Clock, Calendar, Edit3 } from "lucide-react";
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
        updateProblemMutation.mutate({
          problemId,
          completed: true,
          answer,
        });
        setCompletedProblems(prev => new Set([...prev, problemId]));
        
        // Auto-advance to next problem if not the last one
        if (currentProblemIndex < worksheet.questions.length - 1) {
          setCurrentProblemIndex(currentProblemIndex + 1);
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

      const renderProblemInput = (problem: WorksheetProblem) => {
        const currentAnswer = userAnswers[problem.id] || '';

        switch (problem.type) {
          case 'MULTIPLE_CHOICE':
            return (
              <RadioGroup
                value={currentAnswer}
                onValueChange={(value) => handleAnswerChange(problem.id, value)}
                className="space-y-3"
              >
                {problem.options?.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem value={option} id={`option-${problem.id}-${index}`} />
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
              >
                {['True', 'False'].map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem value={option} id={`option-${problem.id}-${index}`} />
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
              />
            );

          case 'NUMERIC':
            return (
              <Input
                type="number"
                placeholder="Enter your answer"
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/workspace/${workspaceId}/worksheet/${worksheetId}/edit`)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
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
                    className="h-8 w-8 p-0"
                  >
                    {completedProblems.has(problem.id) ? (
                      <CheckCircle className="h-4 w-4" />
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
                </div>

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
                    <Button
                      variant="outline"
                      onClick={() => handleSkipProblem(currentProblem.id)}
                      disabled={updateProblemMutation.isPending}
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={() => handleCompleteProblem(currentProblem.id)}
                      disabled={updateProblemMutation.isPending}
                    >
                      {isLastProblem ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }
