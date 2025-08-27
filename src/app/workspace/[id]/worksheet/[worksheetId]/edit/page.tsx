"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RouterOutputs } from "@goscribe/server";

type ApiWorksheetProblem = RouterOutputs['worksheets']['get']['questions'][number];

// Extended type for local state that includes answer field
interface WorksheetProblem extends Omit<ApiWorksheetProblem, 'answer'> {
  answer: string;
}

export default function EditWorksheetPage() {
  const params = useParams();
  const router = useRouter();
  const worksheetId = params.worksheetId as string;
  const workspaceId = params.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [problems, setProblems] = useState<WorksheetProblem[]>([]);
  const [showAnswerHints, setShowAnswerHints] = useState<Record<number, boolean>>({});

  // Fetch worksheet data
  const { data: worksheet, isLoading, error } = trpc.worksheets.get.useQuery(
    { worksheetId },
    { enabled: !!worksheetId }
  );

  const updateMutation = trpc.worksheets.update.useMutation({
    onSuccess: () => {
      toast.success("Worksheet updated successfully!");
      router.push(`/workspace/${workspaceId}/worksheet/${worksheetId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update worksheet");
    },
  });

  // Update form when worksheet changes
  useEffect(() => {
    if (worksheet) {
      setTitle(worksheet.title);
      setDescription(worksheet.description || '');
      setDifficulty(worksheet.difficulty);
      setEstimatedTime(worksheet.estimatedTime || '');
      setProblems(worksheet.questions.map((q: ApiWorksheetProblem) => ({
        id: q.id,
        question: q.prompt,
        answer: q.answer || '',
        type: q.type,
        options: q.meta?.options || [],
        order: q.order
      })));
    }
  }, [worksheet]);

  const handleSubmit = () => {
    if (worksheet && title.trim() && !updateMutation.isPending) {
      updateMutation.mutate({
        id: worksheet.id,
        title: title.trim(),
        description: description.trim(),
        difficulty,
        estimatedTime: estimatedTime.trim(),
        problems: problems.map(p => ({
          question: p.question,
          answer: p.answer,
          id: p.id,
          type: p.type,
          options: p.options,
        })),
      });
    }
  };

  const handleCancel = () => {
    router.push(`/workspace/${workspaceId}/worksheet/${worksheetId}`);
  };

  const addProblem = () => {
    const newProblem: WorksheetProblem = {
      id: `temp-${Date.now()}`,
      question: '',
      answer: '',
      type: 'TEXT',
      order: problems.length,
      prompt: '',
      meta: {},
    };
    setProblems([...problems, newProblem]);
  };

  const updateProblem = (index: number, field: keyof WorksheetProblem, value: string | number | boolean | string[]) => {
    const updatedProblems = [...problems];
    updatedProblems[index] = { ...updatedProblems[index], [field]: value };
    
    // Auto-populate TRUE_FALSE options
    if (field === 'type' && value === 'TRUE_FALSE') {
      updatedProblems[index] = { 
        ...updatedProblems[index], 
        options: ['True', 'False'],
        answer: updatedProblems[index].answer || 'True'
      };
    }
    
    setProblems(updatedProblems);
  };

  const removeProblem = (index: number) => {
    setProblems(problems.filter((_, i) => i !== index));
  };

  const addOption = (problemIndex: number) => {
    const updatedProblems = [...problems];
    const problem = updatedProblems[problemIndex];
    const options = problem.options || [];
    options.push('');
    updatedProblems[problemIndex] = { ...problem, options };
    setProblems(updatedProblems);
  };

  const updateOption = (problemIndex: number, optionIndex: number, value: string) => {
    const updatedProblems = [...problems];
    const problem = updatedProblems[problemIndex];
    const options = [...(problem.options || [])];
    options[optionIndex] = value;
    updatedProblems[problemIndex] = { ...problem, options };
    setProblems(updatedProblems);
  };

  const removeOption = (problemIndex: number, optionIndex: number) => {
    const updatedProblems = [...problems];
    const problem = updatedProblems[problemIndex];
    const options = (problem.options || []).filter((_: string, i: number) => i !== optionIndex);
    
    // If the removed option was the selected answer, clear the answer
    const removedOption = problem.options?.[optionIndex];
    const newAnswer = problem.answer === removedOption ? '' : problem.answer;
    
    updatedProblems[problemIndex] = { ...problem, options, answer: newAnswer };
    setProblems(updatedProblems);
  };

  const renderProblemInput = (problem: WorksheetProblem, index: number) => {
    return (
      <Card key={index} className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Problem {index + 1}</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeProblem(index)}
              disabled={updateMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Input - Type Specific */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Question</Label>
            
            {problem.type === 'TRUE_FALSE' && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter the statement to be evaluated as True or False"
                  value={problem.question}
                  onChange={(e) => updateProblem(index, 'question', e.target.value)}
                  disabled={updateMutation.isPending}
                  rows={2}
                  className="mb-3"
                />
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Example:</strong> "The Earth is flat." (Students will answer True or False)
                  </p>
                </div>
              </div>
            )}

            {problem.type === 'NUMERIC' && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter the mathematical problem or calculation"
                  value={problem.question}
                  onChange={(e) => updateProblem(index, 'question', e.target.value)}
                  disabled={updateMutation.isPending}
                  rows={2}
                  className="mb-3"
                />
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Example:</strong> "What is 15% of 200?" or "Calculate the area of a circle with radius 5cm"
                  </p>
                </div>
              </div>
            )}

            {problem.type === 'FILL_IN_THE_BLANK' && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter the sentence with blanks (use ___ for blanks)"
                  value={problem.question}
                  onChange={(e) => updateProblem(index, 'question', e.target.value)}
                  disabled={updateMutation.isPending}
                  rows={2}
                  className="mb-3"
                />
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Example:</strong> "The capital of France is ___." or "Water is composed of ___ and ___."
                  </p>
                </div>
              </div>
            )}

            {problem.type === 'MULTIPLE_CHOICE' && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter the question"
                  value={problem.question}
                  onChange={(e) => updateProblem(index, 'question', e.target.value)}
                  disabled={updateMutation.isPending}
                  rows={2}
                  className="mb-3"
                />
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Tip:</strong> Add your answer options below, then select the correct one
                  </p>
                </div>
              </div>
            )}

            {problem.type === 'MATCHING' && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter the matching instructions or left column items"
                  value={problem.question}
                  onChange={(e) => updateProblem(index, 'question', e.target.value)}
                  disabled={updateMutation.isPending}
                  rows={2}
                  className="mb-3"
                />
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    <strong>Example:</strong> "Match the countries with their capitals" or "Match the terms with their definitions"
                  </p>
                </div>
              </div>
            )}

            {problem.type === 'TEXT' && (
              <Textarea
                placeholder="Enter the question or prompt for a written response"
                value={problem.question}
                onChange={(e) => updateProblem(index, 'question', e.target.value)}
                disabled={updateMutation.isPending}
                rows={3}
              />
            )}
          </div>

          {/* Answer Input - Type Specific */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Correct Answer</Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAnswerHints(prev => ({ ...prev, [index]: !prev[index] }))}
                  className="h-6 px-2 text-xs"
                >
                  {showAnswerHints[index] ? 'Hide' : 'Show'} Hints
                </Button>
                {problem.answer.trim() && (
                  <Badge variant="default" className="text-xs">
                    ✓ Answer provided
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Type-specific answer inputs */}
            {problem.type === 'TRUE_FALSE' && (
              <div className="flex items-center space-x-4 p-4 border rounded-lg bg-muted/30">
                <Label className="text-sm font-medium">Select the correct answer:</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={problem.answer === 'True' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateProblem(index, 'answer', 'True')}
                    disabled={updateMutation.isPending}
                    className="min-w-[80px]"
                  >
                    True
                  </Button>
                  <Button
                    type="button"
                    variant={problem.answer === 'False' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateProblem(index, 'answer', 'False')}
                    disabled={updateMutation.isPending}
                    className="min-w-[80px]"
                  >
                    False
                  </Button>
                </div>
              </div>
            )}

            {problem.type === 'NUMERIC' && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Enter the numeric answer"
                  value={problem.answer}
                  onChange={(e) => updateProblem(index, 'answer', e.target.value)}
                  disabled={updateMutation.isPending}
                  className="max-w-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  Include units if applicable (e.g., 5.2, 100 meters, 2.5 hours)
                </p>
              </div>
            )}

            {problem.type === 'FILL_IN_THE_BLANK' && (
              <div className="space-y-2">
                <Input
                  placeholder="Enter the expected answer"
                  value={problem.answer}
                  onChange={(e) => updateProblem(index, 'answer', e.target.value)}
                  disabled={updateMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about the exact word or phrase expected
                </p>
              </div>
            )}

            {problem.type === 'TEXT' && (
              <div className="relative">
                <Textarea
                  placeholder="Enter the correct answer or solution"
                  value={problem.answer}
                  onChange={(e) => updateProblem(index, 'answer', e.target.value)}
                  disabled={updateMutation.isPending}
                  rows={4}
                  className={`min-h-[120px] resize-none ${
                    problem.answer.trim() ? 'border-green-200 bg-green-50/50' : ''
                  }`}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {problem.answer.length} chars
                  </Badge>
                </div>
              </div>
            )}

            {problem.type === 'MATCHING' && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Enter the matching pairs or correct sequence"
                  value={problem.answer}
                  onChange={(e) => updateProblem(index, 'answer', e.target.value)}
                  disabled={updateMutation.isPending}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Format: A-1, B-2, C-3 or describe the matching pattern
                </p>
              </div>
            )}
          </div>
          
          {problem.type === 'MULTIPLE_CHOICE' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Correct Answer</Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAnswerHints(prev => ({ ...prev, [index]: !prev[index] }))}
                    className="h-6 px-2 text-xs"
                  >
                    {showAnswerHints[index] ? 'Hide' : 'Show'} Hints
                  </Button>
                  {problem.answer.trim() && (
                    <Badge variant="default" className="text-xs">
                      ✓ Answer selected
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border-2 border-dashed">
                <p className="text-sm text-muted-foreground text-center">
                  {problem.answer.trim() 
                    ? `Selected: "${problem.answer}"`
                    : "Select the correct answer by checking one of the options above"
                  }
                </p>
              </div>
            </div>
          )}
          
          {/* Answer Hints */}
          {showAnswerHints[index] && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">💡 Answer Tips:</p>
                <ul className="space-y-1 text-xs">
                  {problem.type === 'TEXT' && (
                    <li>• Provide a clear, complete explanation</li>
                  )}
                  {problem.type === 'NUMERIC' && (
                    <li>• Include units if applicable (e.g., "5 meters", "2.5 hours")</li>
                  )}
                  {problem.type === 'MULTIPLE_CHOICE' && (
                    <li>• Click the checkbox next to the correct option above</li>
                  )}
                  {problem.type === 'TRUE_FALSE' && (
                    <li>• Enter exactly "True" or "False"</li>
                  )}
                  {problem.type === 'MATCHING' && (
                    <li>• Provide the matching pairs or correct sequence</li>
                  )}
                  {problem.type === 'FILL_IN_THE_BLANK' && (
                    <li>• Be specific about the exact word or phrase expected</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          {/* Answer Preview */}
          {problem.answer.trim() && problem.type !== 'MULTIPLE_CHOICE' && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Answer Preview:</span>
                <Badge variant="outline" className="text-xs">
                  {problem.type.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-sm">
                <div className="p-2 bg-green-100 border border-green-200 rounded">
                  {problem.answer}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-base font-medium">Question Type</Label>
            <Select
              value={problem.type}
              onValueChange={(value: 'MULTIPLE_CHOICE' | 'TEXT' | 'NUMERIC' | 'TRUE_FALSE' | 'MATCHING' | 'FILL_IN_THE_BLANK') => 
                updateProblem(index, 'type', value)
              }
              disabled={updateMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="NUMERIC">Numeric</SelectItem>
                <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                <SelectItem value="MATCHING">Matching</SelectItem>
                <SelectItem value="FILL_IN_THE_BLANK">Fill in the Blank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options Section - Type Specific */}
          {problem.type === 'MULTIPLE_CHOICE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Multiple Choice Options</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addOption(index)}
                  disabled={updateMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Instructions:</strong> Add 2-6 answer choices below. Check the box next to the correct answer.
                </p>
              </div>
              
              {/* Multiple Choice Options */}
              {(problem.options || []).map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={problem.answer === option}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateProblem(index, 'answer', option);
                      }
                    }}
                    disabled={updateMutation.isPending}
                    className="mt-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-muted-foreground w-4">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        disabled={updateMutation.isPending}
                        className="border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
                      />
                    </div>
                    {problem.answer === option && (
                      <div className="ml-6">
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          ✓ Correct Answer
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeOption(index, optionIndex)}
                    disabled={updateMutation.isPending}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {(problem.options || []).length > 0 && !problem.answer && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                  ⚠️ Please select the correct answer by checking one of the options above.
                </div>
              )}
            </div>
          )}

          {problem.type === 'TRUE_FALSE' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">True/False Options</Label>
                <Badge variant="secondary" className="text-xs">
                  Auto-generated
                </Badge>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> True and False options are automatically provided. No additional options needed.
                </p>
              </div>
            </div>
          )}

          {problem.type === 'MATCHING' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Matching Options</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addOption(index)}
                  disabled={updateMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-800">
                  <strong>Instructions:</strong> Add the items to be matched (e.g., countries, terms, definitions).
                </p>
              </div>
              
              {/* Matching Options */}
              {(problem.options || []).map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-muted-foreground w-4">
                        {optionIndex + 1}.
                      </span>
                      <Input
                        placeholder={`Matching item ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        disabled={updateMutation.isPending}
                        className="border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeOption(index, optionIndex)}
                    disabled={updateMutation.isPending}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
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
      <div className="space-y-6">
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
            <h1 className="text-2xl font-bold">Edit Worksheet</h1>
            <p className="text-sm text-muted-foreground">
              Update your worksheet content and problems
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">Title</Label>
            <Input
              id="title"
              placeholder="Worksheet title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={updateMutation.isPending}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Worksheet description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={updateMutation.isPending}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Difficulty</Label>
              <Select
                value={difficulty}
                onValueChange={(value: 'EASY' | 'MEDIUM' | 'HARD') => setDifficulty(value)}
                disabled={updateMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime" className="text-base font-medium">Estimated Time</Label>
              <Input
                id="estimatedTime"
                placeholder="e.g., 30 min"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                disabled={updateMutation.isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Problems</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={addProblem}
              disabled={updateMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Problem
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {problems.map((problem, index) => renderProblemInput(problem, index))}

          {problems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No problems added yet.</p>
              <p className="text-sm mb-4">Add your first problem to get started.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={addProblem}
                disabled={updateMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Problem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-6 border-t">
        <Button variant="outline" onClick={handleCancel} disabled={updateMutation.isPending}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!title.trim() || updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            'Update Worksheet'
          )}
        </Button>
      </div>
    </div>
  );
}
