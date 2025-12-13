"use client";

import { Plus, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewModeToggle } from "@/components/dashboard/widgets/view-mode-toggle";
import { Badge } from "@/components/ui/badge";

/**
 * Props for the FlashcardHeader component
 */
interface FlashcardHeaderProps {
  /** Number of flashcards */
  cardCount: number;
  /** Current view mode */
  viewMode: "grid" | "list";
  /** Callback when view mode changes */
  onViewModeChange: (mode: "grid" | "list") => void;
  /** Callback when create button is clicked */
  onCreateClick: () => void;
  /** Callback when generate button is clicked */
  onGenerateClick: () => void;
  /** Whether creation is in progress */
  isCreating: boolean;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Optional generating metadata */
  generatingMetadata?: {
    quantity?: number;
    topic?: string;
  } | null;
}

/**
 * Flashcard header component with title, count, and actions
 * 
 * Features:
 * - Displays flashcard count
 * - View mode toggle (grid/list)
 * - Create new card button
 * - Loading state for creation
 * - Generation progress indicator
 * 
 * @param props - FlashcardHeaderProps
 * @returns JSX element containing the flashcard header
 */
export const FlashcardHeader = ({
  cardCount,
  viewMode,
  onViewModeChange,
  onCreateClick,
  onGenerateClick,
  isCreating,
  isGenerating,
  generatingMetadata
}: FlashcardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h3 className="text-base font-medium">Flashcards</h3>
          <p className="text-sm text-muted-foreground">
            {cardCount} card{cardCount !== 1 ? 's' : ''}
          </p>
        </div>
        {isGenerating && (
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>
              Generating{generatingMetadata?.quantity ? ` ${generatingMetadata.quantity} cards` : ''}...
            </span>
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={onGenerateClick} 
          size="sm" 
          variant="outline"
          className="h-8"
          disabled={isGenerating}
        >
          <Brain className="h-3.5 w-3.5 mr-1.5" />
          Generate
        </Button>
        <Button 
          onClick={onCreateClick} 
          size="sm" 
          variant="outline"
          className="h-8"
          disabled={isCreating}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Card
        </Button>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>
    </div>
  );
};
