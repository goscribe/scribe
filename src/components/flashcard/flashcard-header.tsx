"use client";

import { Plus, Brain, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";

interface FlashcardHeaderProps {
  cardCount: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onCreateClick: () => void;
  onGenerateClick: () => void;
  isCreating: boolean;
  isGenerating: boolean;
  generatingMetadata?: {
    quantity?: number;
    topic?: string;
  } | null;
}

export const FlashcardHeader = ({
  cardCount,
  onCreateClick,
  onGenerateClick,
  isCreating,
  isGenerating,
  generatingMetadata
}: FlashcardHeaderProps) => {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h3 className="text-lg font-bold">Flashcards</h3>
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
        {cardCount > 0 && (
          <Button
            size="sm"
            className="h-8"
            onClick={() => router.push(`/workspace/${workspaceId}/flashcards/learn`)}
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            Learn
          </Button>
        )}
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
      </div>
    </div>
  );
};
