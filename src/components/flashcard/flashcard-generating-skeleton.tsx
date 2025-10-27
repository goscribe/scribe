"use client";

import { Loader2, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * Props for generating metadata
 */
interface GeneratingMetadata {
  /** Number of flashcards being generated */
  quantity: number;
  /** Topic or subject being generated */
  topic?: string;
}

/**
 * Props for the FlashcardGeneratingSkeleton component
 */
interface FlashcardGeneratingSkeletonProps {
  /** Generating metadata containing quantity and topic */
  generatingMetadata: GeneratingMetadata;
  /** Optional progress percentage (0-100) */
  progress?: number;
}

/**
 * Flashcard generating skeleton component
 * 
 * Features:
 * - Shows generating state with quantity and topic
 * - Animated loading indicator
 * - Progress bar if progress is provided
 * - Consistent styling with flashcard cards
 * 
 * @param props - FlashcardGeneratingSkeletonProps
 * @returns JSX element containing the generating skeleton
 */
export const FlashcardGeneratingSkeleton = ({
  generatingMetadata,
  progress
}: FlashcardGeneratingSkeletonProps) => {
  return (
    <Card className="card-hover group border-border border-dashed border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title and Status */}
            <div className="flex items-start gap-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <h3 className="font-medium text-sm text-primary">Generating Flashcards...</h3>
              </div>
              <Badge 
                variant="outline" 
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                AI Generated
              </Badge>
            </div>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground">
              Creating {generatingMetadata.quantity} flashcards
              {generatingMetadata.topic && ` about ${generatingMetadata.topic}`}...
            </p>

            {/* Progress Bar */}
            {progress !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Generating flashcards...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                {generatingMetadata.quantity} cards
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
