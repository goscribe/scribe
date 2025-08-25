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
}

export const FlashcardCreateModal = ({ isOpen, onOpenChange, onCreateCard }: FlashcardCreateModalProps) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = () => {
    if (front.trim() && back.trim()) {
      onCreateCard(front.trim(), back.trim());
      setFront('');
      setBack('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setFront('');
    setBack('');
    onOpenChange(false);
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
            />
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!front.trim() || !back.trim()}>
            Create Card
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};