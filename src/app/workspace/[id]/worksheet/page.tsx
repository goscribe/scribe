"use client";

import { useState } from "react";
import { Plus, Eye, Edit3, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorksheetEditModal } from "@/components/worksheet-edit-modal";
import { trpc } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RouterOutputs } from "@goscribe/server";

type Worksheet = RouterOutputs['worksheets']['get'];

export default function WorksheetPanel() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorksheet, setSelectedWorksheet] = useState<Worksheet | null>(null);

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

  const updateMutation = trpc.worksheets.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditModalOpen(false);
      toast.success("Worksheet updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update worksheet");
    },
  });

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

  const openEditModal = (worksheet: Worksheet) => {
    setSelectedWorksheet(worksheet);
    setIsEditModalOpen(true);
  };

  const handleUpdateWorksheet = (id: string, data: {
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    estimatedTime: string;
    problems: Array<{
      id?: string;
      question: string;
      answer: string;
      type: 'MULTIPLE_CHOICE' | 'TEXT' | 'NUMERIC' | 'TRUE_FALSE' | 'MATCHING' | 'FILL_IN_THE_BLANK';
      options?: string[];
      order: number;
    }>;
  }) => {
    updateMutation.mutate({
      id,
      ...data,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HARD': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
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
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
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
                      {worksheet.description}
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
                    onClick={() => openEditModal({
                      id: worksheet.id,
                      title: worksheet.title,
                      description: worksheet.description,
                      difficulty: worksheet.difficulty!,
                      estimatedTime: worksheet.estimatedTime,
                      questions: worksheet.questions,
                    })}
                    size="sm" 
                    variant="outline"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <WorksheetEditModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUpdateWorksheet={handleUpdateWorksheet}
        worksheet={selectedWorksheet}
        isLoading={updateMutation.isPending}
      />

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