"use client";

import { Edit3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@goscribe/server";

type Worksheet = RouterOutputs['worksheets']['get'];

/**
 * Props for the WorksheetHeader component
 */
interface WorksheetHeaderProps {
  /** The worksheet data */
  worksheet: Worksheet;
  /** Current progress percentage */
  progressPercentage: number;
  /** Number of completed problems */
  completedCount: number;
  /** Total number of problems */
  totalProblems: number;
  /** Callback when back button is clicked */
  onBack: () => void;
  /** Callback when edit button is clicked */
  onEdit: () => void;
}

/**
 * Worksheet header component with title, progress, and actions
 * 
 * Features:
 * - Worksheet title and description
 * - Difficulty badge with color coding
 * - Progress bar with completion stats
 * - Back and edit action buttons
 * 
 * @param props - WorksheetHeaderProps
 * @returns JSX element containing the worksheet header
 */
export const WorksheetHeader = ({
  worksheet,
  progressPercentage,
  completedCount,
  totalProblems,
  onBack,
  onEdit
}: WorksheetHeaderProps) => {
  /**
   * Gets the appropriate badge styling for difficulty level
   * @param difficulty - The difficulty level
   * @returns CSS classes for the badge
   */
  const getDifficultyBadgeClasses = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return "bg-green-50 text-green-700 border-green-200";
      case 'MEDIUM':
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'HARD':
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="h-8 -ml-2"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
        Back
      </Button>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{worksheet.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {worksheet.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn("text-xs", getDifficultyBadgeClasses(worksheet.difficulty))}
          >
            {worksheet.difficulty?.toLowerCase()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Progress: {completedCount}/{totalProblems} completed</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};
