"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Props for the WorksheetForm component
 */
interface WorksheetFormProps {
  /** Worksheet title */
  title: string;
  /** Worksheet description */
  description: string;
  /** Worksheet difficulty */
  difficulty: string;
  /** Estimated time to complete */
  estimatedTime: string;
  /** Callback when title changes */
  onTitleChange: (title: string) => void;
  /** Callback when description changes */
  onDescriptionChange: (description: string) => void;
  /** Callback when difficulty changes */
  onDifficultyChange: (difficulty: string) => void;
  /** Callback when estimated time changes */
  onEstimatedTimeChange: (time: string) => void;
}

/**
 * Worksheet form component for editing basic worksheet information
 * 
 * Features:
 * - Title and description inputs
 * - Difficulty selection
 * - Estimated time input
 * - Form validation
 * 
 * @param props - WorksheetFormProps
 * @returns JSX element containing the worksheet form
 */
export const WorksheetForm = ({
  title,
  description,
  difficulty,
  estimatedTime,
  onTitleChange,
  onDescriptionChange,
  onDifficultyChange,
  onEstimatedTimeChange
}: WorksheetFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Worksheet Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter worksheet title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter worksheet description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedTime">Estimated Time</Label>
            <Input
              id="estimatedTime"
              placeholder="e.g., 30 minutes"
              value={estimatedTime}
              onChange={(e) => onEstimatedTimeChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
