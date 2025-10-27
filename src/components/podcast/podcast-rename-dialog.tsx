"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

/**
 * Props for the PodcastRenameDialog component
 */
interface PodcastRenameDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog closes */
  onOpenChange: (open: boolean) => void;
  /** Current podcast title */
  currentTitle: string;
  /** Current podcast description */
  currentDescription?: string;
  /** Callback when podcast is renamed */
  onRename: (title: string, description?: string) => Promise<void>;
  /** Whether the rename operation is in progress */
  isRenaming?: boolean;
}

/**
 * Podcast rename dialog component for editing podcast title and description
 * 
 * Features:
 * - Edit podcast title
 * - Edit podcast description
 * - Form validation
 * - Loading state
 * 
 * @param props - PodcastRenameDialogProps
 * @returns JSX element containing the rename dialog
 */
export const PodcastRenameDialog = ({
  isOpen,
  onOpenChange,
  currentTitle,
  currentDescription = "",
  onRename,
  isRenaming = false
}: PodcastRenameDialogProps) => {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);

  // Update form when dialog opens or current values change
  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle);
      setDescription(currentDescription || "");
    }
  }, [isOpen, currentTitle, currentDescription]);

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await onRename(title.trim(), description.trim() || undefined);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to rename podcast:", error);
      toast.error("Failed to rename podcast");
    }
  };

  /**
   * Handles dialog cancellation
   */
  const handleCancel = () => {
    if (!isRenaming) {
      setTitle(currentTitle);
      setDescription(currentDescription || "");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Podcast</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter podcast title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isRenaming}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter podcast description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isRenaming}
            />
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={isRenaming}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!title.trim() || isRenaming}
          >
            {isRenaming ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Renaming...
              </>
            ) : (
              'Rename Podcast'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
