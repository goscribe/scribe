"use client";

import { useState } from "react";
import { Edit3, Trash2, X, Calendar, Hash, Sparkles, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RouterOutputs } from "@goscribe/server";
import { cn } from "@/lib/utils";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

/**
 * Props for the FlashcardDetailSheet component
 */
interface FlashcardDetailSheetProps {
  /** Currently selected flashcard */
  selectedCard: Flashcard | null;
  /** Callback when sheet is closed */
  onClose: () => void;
  /** Callback when card is updated */
  onUpdateCard: (id: string, front: string, back: string) => void;
  /** Callback when card is deleted */
  onDeleteCard: (id: string) => void;
  /** Whether update is in progress */
  isUpdating: boolean;
}

/**
 * Flashcard detail sheet component for viewing and editing cards
 * 
 * Features:
 * - View card front and back
 * - Inline editing with save/cancel
 * - Delete functionality
 * - Character count display
 * - Metadata information
 * 
 * @param props - FlashcardDetailSheetProps
 * @returns JSX element containing the flashcard detail sheet
 */
export const FlashcardDetailSheet = ({
  selectedCard,
  onClose,
  onUpdateCard,
  onDeleteCard,
  isUpdating
}: FlashcardDetailSheetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFront, setEditedFront] = useState("");
  const [editedBack, setEditedBack] = useState("");

  /**
   * Starts editing mode
   */
  const startEditing = () => {
    if (selectedCard) {
      setEditedFront(selectedCard.front);
      setEditedBack(selectedCard.back);
      setIsEditing(true);
    }
  };

  /**
   * Cancels editing mode
   */
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedFront("");
    setEditedBack("");
  };

  /**
   * Saves the edited card
   */
  const saveInlineEdit = () => {
    if (selectedCard && editedFront.trim() && editedBack.trim()) {
      onUpdateCard(selectedCard.id, editedFront.trim(), editedBack.trim());
      setIsEditing(false);
    }
  };

  /**
   * Handles card deletion
   */
  const handleDelete = () => {
    if (selectedCard) {
      onDeleteCard(selectedCard.id);
      onClose();
    }
  };

  return (
    <Sheet 
      open={!!selectedCard} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setIsEditing(false);
        }
      }}
    >
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col" hideClose={true}>
        <SheetTitle className="sr-only">Flashcard Details</SheetTitle>
        <div className="px-6 py-5 border-b-2 border-border/50 bg-muted/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Flashcard Details</h2>
                <p className="text-xs text-muted-foreground">View and edit your flashcard</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={saveInlineEdit}
                    disabled={!editedFront.trim() || !editedBack.trim() || isUpdating}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={startEditing}
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {selectedCard && (
          <div className="flex-1 overflow-auto px-6 py-6 space-y-8">
            {/* Front Section */}
            <Card className="border-2 border-border/50 shadow-sm">
              <div className="px-4 py-3 bg-muted/10 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Question</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {isEditing ? editedFront.length : selectedCard.front.length} chars
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                {isEditing ? (
                  <Textarea
                    value={editedFront}
                    onChange={(e) => setEditedFront(e.target.value)}
                    className="min-h-[140px] resize-none border-border/50 focus:ring-1 focus:ring-primary/20"
                    placeholder="Enter the front of the card..."
                  />
                ) : (
                  <div className="min-h-[140px]">
                    <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">{selectedCard.front}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Back Section */}
            <Card className="border-2 border-border/50 shadow-sm">
              <div className="px-4 py-3 bg-muted/10 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Answer</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {isEditing ? editedBack.length : selectedCard.back.length} chars
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                {isEditing ? (
                  <Textarea
                    value={editedBack}
                    onChange={(e) => setEditedBack(e.target.value)}
                    className="min-h-[140px] resize-none border-border/50 focus:ring-1 focus:ring-primary/20"
                    placeholder="Enter the back of the card..."
                  />
                ) : (
                  <div className="min-h-[140px]">
                    <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">{selectedCard.back}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Progress Section */}
            {selectedCard.progress?.[0] && (
              <Card className="border border-border/50 bg-muted/5">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Progress</span>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Mastery Level */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Mastery Level</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={cn(
                                "h-2 w-2 rounded-full transition-all",
                                level <= (selectedCard.progress[0].masteryLevel || 0)
                                  ? (selectedCard.progress[0].masteryLevel || 0) >= 4
                                    ? "bg-green-500"
                                    : (selectedCard.progress[0].masteryLevel || 0) >= 2
                                    ? "bg-yellow-500"
                                    : "bg-orange-500"
                                  : "bg-muted-foreground/20"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {selectedCard.progress[0].masteryLevel || 0}/5
                        </span>
                      </div>
                    </div>
                    
                    {/* Times Studied */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Times Studied</span>
                      <span className="text-sm font-medium">
                        {selectedCard.progress[0].timesStudied || 0}
                      </span>
                    </div>
                    
                    {/* Consecutive Incorrect */}
                    {(selectedCard.progress[0].timesIncorrectConsecutive || 0) > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Consecutive Misses</span>
                        <span className="text-sm font-medium text-orange-500">
                          {selectedCard.progress[0].timesIncorrectConsecutive}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Metadata Section */}
            <Card className="border border-border/50 bg-muted/5">
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Information</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Created</span>
                    </div>
                    <span className="text-sm font-medium">{new Date(selectedCard.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Card ID</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{selectedCard.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
