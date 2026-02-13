"use client";

import { Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@goscribe/server";
import { CardStatus, getCardStatus, getStatusColor, getStatusLabelColor, getStatusLabel } from "./progress";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

interface FlashcardListViewProps {
  cards: Flashcard[];
  onCardSelect: (card: Flashcard) => void;
  onDeleteCard: (cardId: string) => void;
  onToggleStar?: (cardId: string) => void;
}


interface GroupedCards {
  new: Flashcard[];
  learning: Flashcard[];
  reviewing: Flashcard[];
  mastered: Flashcard[];
}

/**
 * Section header with decorative lines
 */
function SectionHeader({ status, count }: { status: CardStatus; count: number }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className={cn("flex-1 h-px", getStatusLabelColor(status))} style={{ background: 'currentColor', opacity: 0.3 }} />
      <div className="flex items-center gap-2">
        <span className={cn("text-lg font-bold", getStatusLabelColor(status))}>
          {getStatusLabel(status)} ({count})
        </span>
      </div>
      <div className={cn("flex-1 h-px", getStatusLabelColor(status))} style={{ background: 'currentColor', opacity: 0.3 }} />
    </div>
  );
}

/**
 * Individual flashcard item
 */
function FlashcardItem({
  card,
  status,
  onSelect,
  onDelete,
}: {
  card: Flashcard;
  status: CardStatus;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="relative bg-card border border-border rounded-2xl p-6 cursor-pointer hover:border-primary/50 transition-colors group"
    >
      {/* Status dot */}
      <div className={cn("absolute left-4 top-4 w-3 h-3 rounded-full", getStatusLabelColor(status))} />

      {/* Action buttons */}
      <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex items-center min-h-[100px] pl-6">
        {/* Question */}
        <div className="flex-1 pr-6">
          <p className="text-base font-medium text-foreground text-center">
            {card.front}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-20 bg-border/50" />

        {/* Answer */}
        <div className="flex-1 pl-6">
          <p className="text-sm text-muted-foreground text-center">
            {card.back}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Flashcard list view component with cards grouped by status
 */
export const FlashcardListView = ({
  cards,
  onCardSelect,
  onDeleteCard,
}: FlashcardListViewProps) => {
  // Group cards by status
  const groupedCards = cards.reduce<GroupedCards>(
    (acc, card) => {
      const status = getCardStatus(card);
      acc[status].push(card);
      return acc;
    },
    { new: [], learning: [], reviewing: [], mastered: [] }
  );

  // Define the order of sections to display
  const statusOrder: CardStatus[] = ['learning', 'reviewing', 'new', 'mastered'];

  return (
    <div className="space-y-2">
      {statusOrder.map((status) => {
        const cardsInGroup = groupedCards[status];
        if (cardsInGroup.length === 0) return null;

        return (
          <div key={status}>
            <SectionHeader status={status} count={cardsInGroup.length} />
            <div className="space-y-4">
              {cardsInGroup.map((card) => (
                <FlashcardItem
                  key={card.id}
                  card={card}
                  status={status}
                  onSelect={() => onCardSelect(card)}
                  onDelete={() => onDeleteCard(card.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

