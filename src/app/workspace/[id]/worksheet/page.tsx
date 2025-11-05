"use client";

import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useParams } from "next/navigation";
import { useWorksheet } from "@/hooks/use-worksheet";
import { WorksheetCard } from "@/components/worksheet/worksheet-card";
import { RouterOutputs } from "@goscribe/server";

type Worksheet = RouterOutputs['worksheets']['get'];

type GeneratingMetadata = {
  quantity: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
};

/**
 * Worksheet panel component for displaying and managing worksheets
 * 
 * Features:
 * - List of worksheets with progress tracking
 * - Create new worksheet functionality
 * - Real-time updates via Pusher
 * - Empty state when no worksheets exist
 * - Error handling and loading states
 * 
 * @returns JSX element containing the worksheet panel
 */
export default function WorksheetPanel() {
  const params = useParams();
  const workspaceId = params.id as string;

  // Custom hook for worksheet operations (list mode)
  const {
    worksheets,
    isLoading,
    error,
    isCreating,
    isGenerating,
    // generationProgress,
    createWorksheet,
    openWorksheet,
    openEditPage,
    deleteWorksheet,
    refetch,
    correctAnswers,
    incorrectAnswers
  } = useWorksheet(workspaceId);

  // Check if any worksheet is generating and get generating metadata
  const generatingWorksheet = worksheets?.find((w) => w.generating === true);


  // // Loading state
  if (isLoading) {
    return (
      <LoadingSkeleton 
        type="worksheets" 
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Worksheets</h3>
            <p className="text-sm text-muted-foreground">
              Practice exercises and problems to test your knowledge
            </p>
          </div>
        </div>
        <Card className="border-destructive">
          <CardContent className="p-8 text-center">
            <p className="text-destructive">Error loading worksheets: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-2" variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="space-y-4">
      {/* Header with title and create button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Worksheets</h3>
          <p className="text-sm text-muted-foreground">
            {worksheets?.length} worksheet{worksheets?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button 
          onClick={createWorksheet || (() => {})} 
          size="sm" 
          variant="outline"
          className="h-8"
          disabled={isCreating}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Worksheet
        </Button>
      </div>

      {/* Content: Empty state or worksheet list */}
      {worksheets?.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No worksheets yet"
          description="Create your first worksheet to practice and test your knowledge"
          action={{
            label: "New Worksheet",
            onClick: createWorksheet || (() => {})
          }}
        />
      ) : (
        <div className="grid gap-3">
          {worksheets?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((worksheet: Worksheet) => (
            <WorksheetCard
              key={worksheet.id}
              worksheet={worksheet}
              onOpen={openWorksheet || (() => {})}
              onEdit={openEditPage || (() => {})}
              onDelete={deleteWorksheet || (() => {})}
              generatingMetadata={worksheet.generatingMetadata as unknown as GeneratingMetadata}
            />
          ))}
        </div>
      )}
    </div>
  );
};