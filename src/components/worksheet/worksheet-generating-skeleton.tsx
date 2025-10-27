"use client";

import { Loader2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * Props for generating metadata
 */
interface GeneratingMetadata {
  /** Number of problems being generated */
  quantity: number;
  /** Difficulty level of the problems */
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

/**
 * Props for the WorksheetGeneratingSkeleton component
 */
interface WorksheetGeneratingSkeletonProps {
  /** Generating metadata containing quantity and difficulty */
  generatingMetadata: GeneratingMetadata;
  /** Optional progress percentage (0-100) */
  progress?: number;
}

/**
 * Worksheet generating skeleton component
 * 
 * Features:
 * - Shows generating state with quantity and difficulty
 * - Animated loading indicator
 * - Progress bar if progress is provided
 * - Consistent styling with worksheet cards
 * 
 * @param props - WorksheetGeneratingSkeletonProps
 * @returns JSX element containing the generating skeleton
 */
export const WorksheetGeneratingSkeleton = ({
  generatingMetadata,
  progress
}: WorksheetGeneratingSkeletonProps) => {
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
    <Card className="card-hover group border-border border-dashed border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title and Difficulty */}
            <div className="flex items-start gap-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <h3 className="font-medium text-sm text-primary">Generating Worksheet...</h3>
              </div>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getDifficultyBadgeClasses(generatingMetadata.difficulty))}
              >
                {generatingMetadata.difficulty.toLowerCase()}
              </Badge>
            </div>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground">
              Creating {generatingMetadata.quantity} {generatingMetadata.difficulty.toLowerCase()} problems...
            </p>

            {/* Progress Bar */}
            {progress !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Generating problems...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {generatingMetadata.quantity} problems
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Generating...
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
