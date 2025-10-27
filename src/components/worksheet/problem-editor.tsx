"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Problem data structure
 */
interface Problem {
  id: string;
  question: string;
  answer: string;
  type: string;
  options: string[];
}

/**
 * Props for the ProblemEditor component
 */
interface ProblemEditorProps {
  /** Array of problems */
  problems: Problem[];
  /** Callback when problems change */
  onProblemsChange: (problems: Problem[]) => void;
}

/**
 * Problem editor component for managing worksheet problems
 * 
 * Features:
 * - Add/remove problems
 * - Edit problem details
 * - Multiple question types support
 * - Options management for multiple choice
 * 
 * @param props - ProblemEditorProps
 * @returns JSX element containing the problem editor
 */
export const ProblemEditor = ({
  problems,
  onProblemsChange
}: ProblemEditorProps) => {
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  /**
   * Adds a new problem to the list
   */
  const addProblem = () => {
    const newProblem: Problem = {
      id: `problem-${Date.now()}`,
      question: "",
      answer: "",
      type: "TEXT",
      options: []
    };
    onProblemsChange([...problems, newProblem]);
    setExpandedProblem(newProblem.id);
  };

  /**
   * Removes a problem from the list
   * @param problemId - The ID of the problem to remove
   */
  const removeProblem = (problemId: string) => {
    onProblemsChange(problems.filter(p => p.id !== problemId));
    if (expandedProblem === problemId) {
      setExpandedProblem(null);
    }
  };

  /**
   * Updates a problem in the list
   * @param problemId - The ID of the problem to update
   * @param updates - Partial problem data to update
   */
  const updateProblem = (problemId: string, updates: Partial<Problem>) => {
    onProblemsChange(problems.map(p => 
      p.id === problemId ? { ...p, ...updates } : p
    ));
  };

  /**
   * Adds an option to a multiple choice problem
   * @param problemId - The ID of the problem
   */
  const addOption = (problemId: string) => {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      updateProblem(problemId, {
        options: [...problem.options, ""]
      });
    }
  };

  /**
   * Updates an option for a multiple choice problem
   * @param problemId - The ID of the problem
   * @param optionIndex - The index of the option
   * @param value - The new option value
   */
  const updateOption = (problemId: string, optionIndex: number, value: string) => {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      const newOptions = [...problem.options];
      newOptions[optionIndex] = value;
      updateProblem(problemId, { options: newOptions });
    }
  };

  /**
   * Removes an option from a multiple choice problem
   * @param problemId - The ID of the problem
   * @param optionIndex - The index of the option to remove
   */
  const removeOption = (problemId: string, optionIndex: number) => {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      const newOptions = problem.options.filter((_, index) => index !== optionIndex);
      updateProblem(problemId, { options: newOptions });
    }
  };

  /**
   * Gets the display name for a question type
   * @param type - The question type
   * @returns Display name for the type
   */
  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'TEXT': return 'Text';
      case 'NUMERIC': return 'Numeric';
      case 'MULTIPLE_CHOICE': return 'Multiple Choice';
      case 'TRUE_FALSE': return 'True/False';
      case 'FILL_IN_THE_BLANK': return 'Fill in the Blank';
      case 'MATCHING': return 'Matching';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Problems</CardTitle>
          <Button onClick={addProblem} size="sm" className="h-8">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Problem
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {problems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No problems added yet. Click "Add Problem" to get started.</p>
          </div>
        ) : (
          problems.map((problem, index) => (
            <Card key={problem.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Problem {index + 1}</span>
                    <Badge variant="outline" className="text-xs">
                      {getTypeDisplayName(problem.type)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedProblem(
                        expandedProblem === problem.id ? null : problem.id
                      )}
                      className="h-6 px-2"
                    >
                      {expandedProblem === problem.id ? 'Collapse' : 'Expand'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProblem(problem.id)}
                      className="h-6 px-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {expandedProblem === problem.id && (
                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select
                      value={problem.type}
                      onValueChange={(value) => updateProblem(problem.id, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="NUMERIC">Numeric</SelectItem>
                        <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                        <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                        <SelectItem value="FILL_IN_THE_BLANK">Fill in the Blank</SelectItem>
                        <SelectItem value="MATCHING">Matching</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Textarea
                      placeholder="Enter the question"
                      value={problem.question}
                      onChange={(e) => updateProblem(problem.id, { question: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      placeholder="Enter the correct answer"
                      value={problem.answer}
                      onChange={(e) => updateProblem(problem.id, { answer: e.target.value })}
                      rows={2}
                    />
                  </div>

                  {problem.type === 'MULTIPLE_CHOICE' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Options</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(problem.id)}
                          className="h-6"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {problem.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <Input
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(problem.id, optionIndex, e.target.value)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOption(problem.id, optionIndex)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
