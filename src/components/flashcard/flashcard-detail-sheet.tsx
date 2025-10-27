"use client";

import { useState } from "react";
import { Edit3, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RouterOutputs } from "@goscribe/server";

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
      <SheetContent className="w-full p-0 flex flex-col" hideClose={true}>
        <SheetTitle className="sr-only">Flashcard Details</SheetTitle>
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h2 className="text-base font-medium">Flashcard Details</h2>
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
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center justify-between">
                <span>FRONT (Question)</span>
                <span className="font-normal">
                  {isEditing ? editedFront.length : selectedCard.front.length} characters
                </span>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedFront}
                  onChange={(e) => setEditedFront(e.target.value)}
                  className="min-h-[120px] resize-none"
                  placeholder="Enter the front of the card..."
                />
              ) : (
                <div className="p-4 bg-muted/30 rounded-lg border border-border min-h-[120px]">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{selectedCard.front}</p>
                </div>
              )}
            </div>

            {/* Back Section */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center justify-between">
                <span>BACK (Answer)</span>
                <span className="font-normal">
                  {isEditing ? editedBack.length : selectedCard.back.length} characters
                </span>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedBack}
                  onChange={(e) => setEditedBack(e.target.value)}
                  className="min-h-[120px] resize-none"
                  placeholder="Enter the back of the card..."
                />
              ) : (
                <div className="p-4 bg-muted/30 rounded-lg border border-border min-h-[120px]">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{selectedCard.back}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Metadata Section */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-muted-foreground">METADATA</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Created</div>
                  <div className="text-sm">{new Date(selectedCard.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
