"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FlashcardCreateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCard: (front: string, back: string) => void;
  isLoading?: boolean;
}

export const FlashcardCreateModal = ({ 
  isOpen, 
  onOpenChange, 
  onCreateCard, 
  isLoading = false 
}: FlashcardCreateModalProps) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = () => {
    if (front.trim() && back.trim() && !isLoading) {
      onCreateCard(front.trim(), back.trim());
      setFront('');
      setBack('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setFront('');
      setBack('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Flashcard</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="front">Front (Question)</Label>
            <Input
              id="front"
              placeholder="Enter the question or prompt"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="back">Back (Answer)</Label>
            <Textarea
              id="back"
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
                Creating...
              </>
            ) : (
              'Create Card'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};