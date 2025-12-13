"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RouterOutputs } from "@goscribe/server";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

interface FlashcardEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCard: (id: string, front: string, back: string) => void;
  flashcard: Flashcard | null;
  isLoading?: boolean;
}

export const FlashcardEditModal = ({ 
  isOpen, 
  onOpenChange, 
  onUpdateCard, 
  flashcard, 
  isLoading = false 
}: FlashcardEditModalProps) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  // Update form when flashcard changes
  useEffect(() => {
    if (flashcard) {
      setFront(flashcard.front);
      setBack(flashcard.back);
    }
  }, [flashcard]);

  const handleSubmit = () => {
    if (flashcard && front.trim() && back.trim() && !isLoading) {
      onUpdateCard(flashcard.id, front.trim(), back.trim());
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      // Reset to original values
      if (flashcard) {
        setFront(flashcard.front);
        setBack(flashcard.back);
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-front">Front (Question)</Label>
            <Input
              id="edit-front"
              placeholder="Enter the question or prompt"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-back">Back (Answer)</Label>
            <Textarea
              id="edit-back"
              placeholder="Enter the answer or explanation"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!front.trim() || !back.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Card'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
