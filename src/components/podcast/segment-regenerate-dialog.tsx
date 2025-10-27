"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RouterOutputs } from "@goscribe/server";

type Segment = RouterOutputs['podcast']['getEpisode']['segments'][number];

/**
 * Props for the SegmentRegenerateDialog component
 */
interface SegmentRegenerateDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog closes */
  onOpenChange: (open: boolean) => void;
  /** The segment to regenerate */
  segment: Segment | null;
  /** Callback when segment is regenerated */
  onRegenerate: (segmentId: string, prompt: string) => Promise<void>;
  /** Whether the regeneration is in progress */
  isRegenerating?: boolean;
}

/**
 * Segment regenerate dialog component for regenerating podcast segments
 * 
 * Features:
 * - View current segment content
 * - Enter prompt to modify segment
 * - Regenerate with custom prompt
 * - Loading state
 * 
 * @param props - SegmentRegenerateDialogProps
 * @returns JSX element containing the regenerate dialog
 */
export const SegmentRegenerateDialog = ({
  isOpen,
  onOpenChange,
  segment,
  onRegenerate,
  isRegenerating = false
}: SegmentRegenerateDialogProps) => {
  const [prompt, setPrompt] = useState("");

  // Clear prompt when dialog opens
  useState(() => {
    if (isOpen) {
      setPrompt("");
    }
  });

  /**
   * Handles regeneration with custom prompt
   */
  const handleRegenerate = async () => {
    if (!segment) return;

    if (!prompt.trim()) {
      toast.error("Please enter a prompt to modify the segment");
      return;
    }

    try {
      await onRegenerate(segment.id, prompt.trim());
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to regenerate segment:", error);
      toast.error("Failed to regenerate segment");
    }
  };

  /**
   * Handles dialog cancellation
   */
  const handleCancel = () => {
    if (!isRegenerating) {
      setPrompt("");
      onOpenChange(false);
    }
  };

  if (!segment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Regenerate Segment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Segment Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Segment {segment.order}</Badge>
              <h3 className="font-medium">{segment.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Duration: {Math.floor(segment.duration / 60)}:{(segment.duration % 60).toString().padStart(2, '0')}
            </p>
          </div>

          {/* Current Content Preview */}
          <div className="space-y-2">
            <Label>Current Content</Label>
            <div className="p-3 bg-muted/30 rounded-md border max-h-32 overflow-y-auto">
              <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
                {segment.content}
              </p>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Modification Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe how you want to modify this segment. For example: 'Make it more conversational', 'Add more examples', 'Simplify the language', etc."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isRegenerating}
            />
            <p className="text-xs text-muted-foreground">
              Enter a prompt describing how you want to modify the segment content.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={isRegenerating}>
            Cancel
          </Button>
          <Button 
            onClick={handleRegenerate}
            disabled={!prompt.trim() || isRegenerating}
          >
            {isRegenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Regenerating...
              </>
            ) : (
              'Regenerate Segment'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
