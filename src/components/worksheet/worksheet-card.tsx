"use client";

import { useState } from "react";
import { Clock, FileText, MoreHorizontal, Trash2, Loader2, ArrowRight, CheckCircle2, XCircle, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@goscribe/server";
import { useWorksheet } from "@/hooks/use-worksheet";
import { Skeleton } from "../ui/skeleton";

type Worksheet = RouterOutputs['worksheets']['get'];

interface GeneratingMetadata {
  quantity: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface WorksheetCardProps {
  worksheet: Worksheet;
  onOpen: (worksheetId: string) => void;
  onDelete: (worksheetId: string) => void;
  generatingMetadata?: GeneratingMetadata;
}

const difficultyConfig = {
  EASY: { label: "Easy", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  MEDIUM: { label: "Medium", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  HARD: { label: "Hard", className: "bg-red-500/10 text-red-600 dark:text-red-400" },
} as const;

export const WorksheetCard = ({ 
  worksheet, 
  onOpen, 
  onDelete,
  generatingMetadata
}: WorksheetCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const workspaceId = worksheet.workspaceId;
  const { correctAnswers, incorrectAnswers, isLoading } = useWorksheet(workspaceId, worksheet.id);
  
  const isGenerating = worksheet.generating === true;
  const completedProblems = correctAnswers?.size || 0;
  const totalProblems = worksheet.questions.length;
  const progressPercentage = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;
  const diff = difficultyConfig[worksheet.difficulty as keyof typeof difficultyConfig] || difficultyConfig.MEDIUM;

  // Generating state
  if (isGenerating && generatingMetadata) {
    const genDiff = difficultyConfig[generatingMetadata.difficulty] || difficultyConfig.MEDIUM;
    return (
      <Card className="border border-dashed border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Generating worksheet...</span>
              <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 h-4 font-medium border-0", genDiff.className)}>
                {genDiff.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {generatingMetadata.quantity} problems
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        className="group border border-border hover:border-border/80 transition-colors cursor-pointer"
        onClick={() => onOpen(worksheet.id)}
      >
        <div className="p-4">
          {/* Top row: title + badge + menu */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium truncate">{worksheet.title}</h3>
                {worksheet.description && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{worksheet.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 h-5 font-medium border-0", diff.className)}>
                {diff.label}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress section */}
          {totalProblems > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {isLoading ? (
                    <Skeleton className="h-3 w-20" />
                  ) : (
                    <>
                      <span className="text-xs font-medium">
                        {completedProblems}/{totalProblems}
                      </span>
                      <span className="text-xs text-muted-foreground">completed</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {worksheet.estimatedTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {worksheet.estimatedTime}
                    </span>
                  )}
                </div>
              </div>

              {/* Question dots */}
              <div className="flex items-center gap-[3px] flex-wrap">
                {isLoading ? (
                  <Skeleton className="h-2 w-full rounded-full" />
                ) : (
                  worksheet.questions.map((question: Worksheet['questions'][number]) => {
                    const isCorrect = correctAnswers?.has(question.id);
                    const isIncorrect = incorrectAnswers?.has(question.id);
                    return (
                      <div
                        key={question.id}
                        className={cn(
                          "h-1.5 flex-1 min-w-[4px] max-w-[16px] rounded-full transition-colors",
                          isCorrect
                            ? "bg-emerald-500"
                            : isIncorrect
                            ? "bg-red-400"
                            : "bg-muted"
                        )}
                      />
                    );
                  })
                )}
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-muted-foreground">
                  {new Date(worksheet.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <Button
                  size="sm"
                  className="h-7 text-xs px-3 gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(worksheet.id);
                  }}
                >
                  {completedProblems > 0 ? 'Continue' : 'Start'}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Worksheet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{worksheet.title}&quot;? This action cannot be undone and all progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(worksheet.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
