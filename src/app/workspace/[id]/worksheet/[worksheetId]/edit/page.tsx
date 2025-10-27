"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorksheet } from "@/hooks/use-worksheet";
import { EditPageHeader } from "@/components/worksheet/edit-page-header";
import { WorksheetForm } from "@/components/worksheet/worksheet-form";
import { ProblemEditor } from "@/components/worksheet/problem-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Problem data structure for editing
 */
interface Problem {
  id: string;
  question: string;
  answer: string;
  type: string;
  options: string[];
}

/**
 * Worksheet edit page component for editing worksheet details and problems
 * 
 * Features:
 * - Edit worksheet metadata (title, description, difficulty, time)
 * - Add/remove/edit problems
 * - Real-time updates via Pusher
 * - Form validation and error handling
 * 
 * @returns JSX element containing the worksheet edit page
 */
export default function WorksheetEditPage() {
  const params = useParams();
  const router = useRouter();
  const worksheetId = params.worksheetId as string;
  const workspaceId = params.id as string;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);

  // Custom hook for worksheet operations
  const {
    worksheet,
    isLoading,
    error,
    updateWorksheet,
    isUpdating
  } = useWorksheet(workspaceId, worksheetId);

  // Initialize form data when worksheet loads
  useEffect(() => {
    if (worksheet) {
      setTitle(worksheet.title || "");
      setDescription(worksheet.description || "");
      setDifficulty(worksheet.difficulty || "EASY");
      setEstimatedTime(worksheet.estimatedTime || "");
      
      // Convert worksheet questions to editable format
      const editableProblems: Problem[] = worksheet.questions.map((q: { id: string; prompt?: string; answer?: string; type?: string; meta?: { options?: string[] } }) => ({
        id: q.id,
        question: q.prompt || "",
        answer: q.answer || "",
        type: q.type || "TEXT",
        options: q.meta?.options || [],
      }));
      setProblems(editableProblems);
    }
  }, [worksheet]);

  /**
   * Handles form submission
   */
  const handleSubmit = () => {
    if (worksheet && title.trim() && !isUpdating) {
      updateWorksheet?.({
        id: worksheet.id,
        title: title.trim(),
        description: description.trim(),
        difficulty: difficulty as "EASY" | "MEDIUM" | "HARD",
        estimatedTime: estimatedTime.trim(),
        problems: problems.map(p => ({
          question: p.question,
          answer: p.answer,
          id: p.id,
          type: p.type as "TEXT" | "NUMERIC" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK" | "MATCHING",
          options: p.options,
        })),
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !worksheet) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        <Card className="border-destructive">
          <CardContent className="p-8 text-center">
            <p className="text-destructive text-sm">
              {error?.message || "Worksheet not found"}
            </p>
            <Button onClick={() => router.back()} className="mt-4" variant="outline" size="sm">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Header */}
      <EditPageHeader
        isSaving={isUpdating || false}
        onSave={handleSubmit}
        onBack={() => router.back()}
      />

      {/* Worksheet Form */}
      <WorksheetForm
        title={title}
        description={description}
        difficulty={difficulty}
        estimatedTime={estimatedTime}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onDifficultyChange={setDifficulty}
        onEstimatedTimeChange={setEstimatedTime}
      />

      {/* Problem Editor */}
      <ProblemEditor
        problems={problems}
        onProblemsChange={setProblems}
      />
    </div>
  );
};