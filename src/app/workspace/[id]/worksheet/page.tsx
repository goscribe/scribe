"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Edit3, Calendar, Clock, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

import { trpc } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RouterOutputs } from "@goscribe/server";
import { usePusherWorksheet } from "@/hooks/use-pusher-worksheet";

type Worksheet = RouterOutputs['worksheets']['get'];

export default function WorksheetPanel() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  // Pusher integration
  const { 
    isConnected, 
    isGenerating, 
    generationProgress,
    subscribeToWorksheets 
  } = usePusherWorksheet(workspaceId);

  // tRPC queries and mutations
  const { data: worksheets = [], isLoading, error, refetch } = trpc.worksheets.list.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );

  const createMutation = trpc.worksheets.create.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Worksheet created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create worksheet");
    },
  });

  const deleteMutation = trpc.worksheets.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Worksheet deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete worksheet");
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (isConnected) {
      subscribeToWorksheets({
        onNewWorksheet: (worksheet) => {
          // Worksheet will be added via refetch
          toast.success("New worksheet created!");
        },
        onWorksheetUpdate: (worksheet) => {
          // Worksheet will be updated via refetch
          toast.success("Worksheet updated!");
        },
        onWorksheetDelete: (worksheetId) => {
          // Worksheet will be removed via refetch
          toast.success("Worksheet deleted!");
        },
        onGenerationStart: () => {
          toast.info("Starting worksheet generation...");
        },
        onGenerationComplete: (worksheet) => {
          toast.success("Worksheet generated successfully!");
          refetch();
        },
        onGenerationError: (error) => {
          toast.error(`Generation failed: ${error}`);
        },
      });
    }
  }, [isConnected, subscribeToWorksheets, refetch]);

  const generateNewWorksheet = () => {
    createMutation.mutate({
      workspaceId,
      title: `New Worksheet ${worksheets.length + 1}`,
      description: 'Generated practice problems',
      difficulty: 'MEDIUM',
      estimatedTime: '30 min',
      problems: [
        {
          question: 'Sample question 1',
          answer: 'Sample answer 1',
          type: 'TEXT',
        },
        {
          question: 'Sample question 2',
          answer: 'Sample answer 2',
          type: 'TEXT',
        },
        {
          question: 'Sample question 3',
          answer: 'Sample answer 3',
          type: 'MULTIPLE_CHOICE',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        },
        {
          question: 'Sample question 4',
          answer: 'Sample answer 4',
          type: 'NUMERIC',
        },
        {
          question: 'Sample question 5',
          answer: 'Sample answer 5',
          type: 'TRUE_FALSE',
        },
        {
          question: 'Sample question 6',
          answer: 'Sample answer 6',
          type: 'MATCHING',
          options: ['Option 1', 'Option 2', 'Option 3'],
        }
      ],
    });
  };

  const openWorksheet = (worksheetId: string) => {
    router.push(`/workspace/${workspaceId}/worksheet/${worksheetId}`);
  };

  const openEditPage = (worksheetId: string) => {
    router.push(`/workspace/${workspaceId}/worksheet/${worksheetId}/edit`);
  };

  const deleteWorksheet = (worksheetId: string) => {
    deleteMutation.mutate({ id: worksheetId });
    refetch();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HARD': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading || isGenerating) {
    return (
      <LoadingSkeleton 
        type="worksheets" 
        isGenerating={isGenerating}
        generationProgress={generationProgress}
      />
    );
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Worksheets</h3>
          <p className="text-sm text-muted-foreground">
            Practice exercises and problems to test your knowledge
            {!isConnected && (
              <span className="ml-2 text-xs text-orange-600">(Offline)</span>
            )}
          </p>
        </div>
        <Button 
          onClick={generateNewWorksheet} 
          size="sm" 
          className="gradient-primary"
          disabled={createMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Worksheet
        </Button>
      </div>

      <div className="grid gap-4">
        {worksheets.map((worksheet: Worksheet) => {
          const completedProblems = worksheet.questions.filter((q: Worksheet['questions'][number]) => q.meta?.completed).length;
          const totalProblems = worksheet.questions.length;
          const progressPercentage = totalProblems > 0 
            ? (completedProblems / totalProblems) * 100 
            : 0;

          return (
            <Card key={worksheet.id} className="shadow-soft hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-2">{worksheet.title}</CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getDifficultyColor(worksheet.difficulty!)}
                  >
                    {worksheet.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {worksheet.description || 'No description'}
                    </span>
                  </div>
                </div>
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {completedProblems}/{totalProblems} completed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {worksheet.estimatedTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {worksheet.estimatedTime}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(worksheet.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 w-[10rem]">
                  <Button 
                    onClick={() => openWorksheet(worksheet.id)}
                    size="sm" 
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {completedProblems > 0 ? 'Continue' : 'Start'}
                  </Button>
                  <Button 
                    onClick={() => openEditPage(worksheet.id)}
                    size="sm" 
                    variant="outline"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button onClick={() => deleteWorksheet(worksheet.id)} size="sm" variant="destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {worksheets.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No worksheets yet.</p>
            <Button 
              onClick={generateNewWorksheet} 
              className="mt-2" 
              variant="outline"
              disabled={createMutation.isPending}
            >
              Generate your first worksheet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};