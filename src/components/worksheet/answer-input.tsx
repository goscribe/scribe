"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@goscribe/server";

type WorksheetProblem = RouterOutputs['worksheets']['get']['questions'][number];

/**
 * Props for the AnswerInput component
 */
interface AnswerInputProps {
  /** The worksheet problem */
  problem: WorksheetProblem;
  /** Current user answer */
  currentAnswer: string;
  /** Whether the problem is completed */
  isCompleted: boolean;
  /** Whether the answer is incorrect */
  isIncorrect: boolean;
  /** Callback when answer changes */
  onAnswerChange: (answer: string) => void;
}

/**
 * Answer input component for different question types
 * 
 * Features:
 * - Supports multiple question types (TEXT, NUMERIC, MULTIPLE_CHOICE, TRUE_FALSE, etc.)
 * - Proper validation and error states
 * - Disabled state for completed questions
 * 
 * @param props - AnswerInputProps
 * @returns JSX element containing the appropriate answer input
 */
export const AnswerInput = ({
  problem,
  currentAnswer,
  isCompleted,
  isIncorrect,
  onAnswerChange
}: AnswerInputProps) => {
  switch (problem.type) {
    case 'MULTIPLE_CHOICE':
      const options = problem.meta?.options || [];
      return (
        <RadioGroup
          value={currentAnswer}
          onValueChange={onAnswerChange}
          disabled={isCompleted}
          className="space-y-2"
        >
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${problem.id}-${index}`} />
              <Label htmlFor={`${problem.id}-${index}`} className="text-sm">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case 'TRUE_FALSE':
      return (
        <RadioGroup
          value={currentAnswer}
          onValueChange={onAnswerChange}
          disabled={isCompleted}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="True" id={`${problem.id}-true`} />
            <Label htmlFor={`${problem.id}-true`} className="text-sm">True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="False" id={`${problem.id}-false`} />
            <Label htmlFor={`${problem.id}-false`} className="text-sm">False</Label>
          </div>
        </RadioGroup>
      );

    case 'NUMERIC':
      return (
        <Input
          type="number"
          placeholder="Enter your answer"
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={isCompleted}
          className={cn(
            "max-w-xs",
            isIncorrect && "border-destructive"
          )}
        />
      );

    case 'TEXT':
    case 'FILL_IN_THE_BLANK':
    case 'MATCHING':
    default:
      return (
        <Textarea
          placeholder="Enter your answer"
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={isCompleted}
          rows={3}
          className={cn(
            "resize-none",
            isIncorrect && "border-destructive"
          )}
        />
      );
  }
};
