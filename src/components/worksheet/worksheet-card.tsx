"use client";

import { useState } from "react";
import { Calendar, Clock, Edit3, FileText, Trash, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@goscribe/server";

type Worksheet = RouterOutputs['worksheets']['get'];

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
 * Props for the WorksheetCard component
 */
interface WorksheetCardProps {
  /** The worksheet data to display */
  worksheet: Worksheet;
  /** Callback when worksheet is opened */
  onOpen: (worksheetId: string) => void;
  /** Callback when worksheet edit is opened */
  onEdit: (worksheetId: string) => void;
  /** Callback when worksheet is deleted */
  onDelete: (worksheetId: string) => void;
  /** Optional generating metadata for generating state */
  generatingMetadata?: GeneratingMetadata;
}

/**
 * Worksheet card component for displaying worksheet information
 * 
 * Features:
 * - Worksheet title and description
 * - Difficulty badge with color coding
 * - Progress tracking with completion percentage
 * - Metadata display (time, date, problem count)
 * - Action buttons (Start/Continue, Edit, Delete)
 * 
 * @param props - WorksheetCardProps
 * @returns JSX element containing the worksheet card
 */
export const WorksheetCard = ({ 
  worksheet, 
  onOpen, 
  onEdit, 
  onDelete,
  generatingMetadata
}: WorksheetCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Check if worksheet is generating (assuming worksheet has a generating field)
  const isGenerating = worksheet.generating === true;
  
  const completedProblems = worksheet.questions.filter((q: Worksheet['questions'][number]) => q.meta?.completed).length;
  const totalProblems = worksheet.questions.length;
  const progressPercentage = totalProblems > 0 
    ? (completedProblems / totalProblems) * 100 
    : 0;

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

  if (isGenerating) {
    console.log("generatingMetadata", generatingMetadata);
  }

  // If generating, show generating state
  if (isGenerating && generatingMetadata) {
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
  }

  return (
    <Card className="card-hover group border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title and Difficulty */}
            <div className="flex items-start gap-2">
              <h3 className="font-medium text-sm">{worksheet.title}</h3>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getDifficultyBadgeClasses(worksheet.difficulty || 'EASY'))}
              >
                {worksheet.difficulty?.toLocaleLowerCase() || 'unset'}
              </Badge>
            </div>
            
            {/* Description */}
            {worksheet.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {worksheet.description}
              </p>
            )}

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{completedProblems}/{totalProblems} completed</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-1.5" />
            </div>

            {/* Metadata and Actions */}
            <div className="flex items-center justify-between">
              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {totalProblems} problems
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(worksheet.id);
                  }}
                >
                  {completedProblems > 0 ? 'Continue' : 'Start'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(worksheet.id);
                  }}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

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
    </Card>
  );
};
