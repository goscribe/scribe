import { RouterOutputs } from "@goscribe/server";

type Flashcard = RouterOutputs['flashcards']['listCards'][number];

export type CardStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

/**
 * Get card status based on progress
 */
export function getCardStatus(card: Flashcard): CardStatus {
    const progress = card.progress?.[0];
    if (!progress || progress.timesStudied === 0) {
      return 'new';
    }
    const masteryLevel = progress.masteryLevel || 0;
    if (masteryLevel >= 80) {
      return 'mastered';
    }
    if (masteryLevel >= 40) {
      return 'reviewing';
    }
    return 'learning';
  }
  
  /**
   * Get status color for the dot indicator
   */
  export function getStatusColor(status: CardStatus): string {
    switch (status) {
      case 'new':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'learning':
        return 'bg-yellow-100 dark:bg-yellow-900';
      case 'reviewing':
        return 'bg-orange-100 dark:bg-orange-900';
      case 'mastered':
        return 'bg-green-100 dark:bg-green-900';
      default:
        return 'bg-gray-100 dark:bg-gray-900';
    }
  }


/**
 * Get status label color for section headers
 */
export function getStatusLabelColor(status: CardStatus): string {
    switch (status) {
      case 'new':
        return 'text-blue-500';
      case 'learning':
        return 'text-yellow-500';
      case 'reviewing':
        return 'text-orange-500';
      case 'mastered':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }
  
  /**
   * Get status display name
   */
  export function getStatusLabel(status: CardStatus): string {
    switch (status) {
      case 'new':
        return 'New';
      case 'learning':
        return 'Learning';
      case 'reviewing':
        return 'Reviewing';
      case 'mastered':
        return 'Mastered';
      default:
        return 'Unknown';
    }
  }
  