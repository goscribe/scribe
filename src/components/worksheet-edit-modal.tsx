"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { RouterOutputs } from "@goscribe/server";

type WorksheetProblem = RouterOutputs['worksheets']['get']['questions'][number];
type Worksheet = RouterOutputs['worksheets']['get'];

interface WorksheetEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateWorksheet: (id: string, data: {
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    estimatedTime: string;
    problems: WorksheetProblem[];
  }) => void;
  worksheet: Worksheet | null;
  isLoading?: boolean;
}

export const WorksheetEditModal = ({ 
  isOpen, 
  onOpenChange, 
  onUpdateWorksheet, 
  worksheet, 
  isLoading = false 
}: WorksheetEditModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [problems, setProblems] = useState<WorksheetProblem[]>([]);

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
    if (worksheet && title.trim() && !isLoading) {
      onUpdateWorksheet(worksheet.id, {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        estimatedTime: estimatedTime.trim(),
        problems,
      });
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading && worksheet) {
      // Reset to original values
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
      onOpenChange(false);
    }
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
      <Card key={index} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Problem {index + 1}</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeProblem(index)}
              disabled={isLoading}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              placeholder="Enter the question"
              value={problem.question}
              onChange={(e) => updateProblem(index, 'question', e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Answer</Label>
            <Textarea
              placeholder="Enter the correct answer"
              value={problem.answer}
              onChange={(e) => updateProblem(index, 'answer', e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select
              value={problem.type}
              onValueChange={(value: 'MULTIPLE_CHOICE' | 'TEXT' | 'NUMERIC' | 'TRUE_FALSE' | 'MATCHING' | 'FILL_IN_THE_BLANK') => 
                updateProblem(index, 'type', value)
              }
              disabled={isLoading}
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  {problem.type === 'TRUE_FALSE' ? 'True/False Options' : 
                   problem.type === 'MATCHING' ? 'Matching Options' : 'Multiple Choice Options'}
                </Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addOption(index)}
                  disabled={isLoading}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Option
                </Button>
              </div>
              {(problem.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2">
                  <Input
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeOption(index, optionIndex)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Edit Worksheet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Worksheet title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Worksheet description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value: 'EASY' | 'MEDIUM' | 'HARD') => setDifficulty(value)}
                  disabled={isLoading}
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
                <Label htmlFor="estimatedTime">Estimated Time</Label>
                <Input
                  id="estimatedTime"
                  placeholder="e.g., 30 min"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Problems */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Problems</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={addProblem}
                disabled={isLoading}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Problem
              </Button>
            </div>

            {problems.map((problem, index) => renderProblemInput(problem, index))}

            {problems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No problems added yet.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addProblem}
                  disabled={isLoading}
                  className="mt-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add First Problem
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!title.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Worksheet'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
