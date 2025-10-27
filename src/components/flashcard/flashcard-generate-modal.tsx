"use client";

import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Props for the FlashcardGenerateModal component
 */
interface FlashcardGenerateModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when flashcards are generated */
  onGenerate: (prompt: string) => void;
  /** Whether generation is in progress */
  isLoading?: boolean;
}

/**
 * Flashcard generation modal component
 * 
 * Features:
 * - Input prompt for generating flashcards
 * - Form validation
 * - Loading state
 * - Example prompts
 * 
 * @param props - FlashcardGenerateModalProps
 * @returns JSX element containing the generation modal
 */
export const FlashcardGenerateModal = ({
  isOpen,
  onOpenChange,
  onGenerate,
  isLoading = false
}: FlashcardGenerateModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const examplePrompts = [
    "Create flashcards about the periodic table elements",
    "Generate flashcards for Spanish vocabulary - food and drinks",
    "Make flashcards about World War II key events and dates",
    "Create flashcards for biology - cell organelles and their functions",
    "Generate flashcards for programming concepts in JavaScript",
  ];

  /**
   * Validates the form
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!prompt.trim()) {
      newErrors.prompt = 'Prompt is required';
    }

    if (prompt.length < 10) {
      newErrors.prompt = 'Prompt must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate(prompt.trim());
      setPrompt("");
      setErrors({});
    }
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    if (!isLoading) {
      setPrompt("");
      setErrors({});
      onOpenChange(false);
    }
  };

  /**
   * Inserts an example prompt
   */
  const insertExample = (example: string) => {
    setPrompt(example);
    if (errors.prompt) {
      setErrors(prev => ({ ...prev, prompt: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Generate Flashcards
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">
              What would you like to create flashcards about? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="prompt"
              placeholder="Describe the topic, subject, or content you want flashcards for..."
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (errors.prompt) {
                  setErrors(prev => ({ ...prev, prompt: '' }));
                }
              }}
              rows={4}
              className={errors.prompt ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.prompt && (
              <p className="text-sm text-red-500">{errors.prompt}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {prompt.length} characters
            </p>
          </div>

          {/* Example Prompts */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Example prompts:</Label>
            <div className="space-y-1">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertExample(example)}
                  className="block w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                  disabled={isLoading}
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!prompt.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Flashcards
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
