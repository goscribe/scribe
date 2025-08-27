"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RouterOutputs } from "@goscribe/server";

type WorksheetProblem = RouterOutputs['worksheets']['get']['questions'][number];
type Worksheet = RouterOutputs['worksheets']['get'];

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
      setProblems(worksheet.questions.map(q => ({
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
        problems,
      });
    }
  };

  const handleCancel = () => {
    router.push(`/workspace/${workspaceId}/worksheet/${worksheetId}`);
  };

  const addProblem = () => {
    const newProblem: WorksheetProblem = {
      question: '',
      answer: '',
      type: 'TEXT',
      order: problems.length,
    };
    setProblems([...problems, newProblem]);
  };

  const updateProblem = (index: number, field: keyof WorksheetProblem, value: any) => {
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
    const options = (problem.options || []).filter((_, i) => i !== optionIndex);
    updatedProblems[problemIndex] = { ...problem, options };
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
          <div className="space-y-2">
            <Label className="text-base font-medium">Question</Label>
            <Textarea
              placeholder="Enter the question"
              value={problem.question}
              onChange={(e) => updateProblem(index, 'question', e.target.value)}
              disabled={updateMutation.isPending}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Answer</Label>
            <Textarea
              placeholder="Enter the correct answer"
              value={problem.answer}
              onChange={(e) => updateProblem(index, 'answer', e.target.value)}
              disabled={updateMutation.isPending}
              rows={3}
            />
          </div>

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

          {(problem.type === 'MULTIPLE_CHOICE' || problem.type === 'TRUE_FALSE' || problem.type === 'MATCHING') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  {problem.type === 'TRUE_FALSE' ? 'True/False Options' : 
                   problem.type === 'MATCHING' ? 'Matching Options' : 'Multiple Choice Options'}
                </Label>
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
              {(problem.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-3">
                  <Input
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                    disabled={updateMutation.isPending}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeOption(index, optionIndex)}
                    disabled={updateMutation.isPending}
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
