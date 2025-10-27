"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Props for the FlashcardSearch component
 */
interface FlashcardSearchProps {
  /** Current search value */
  searchValue: string;
  /** Callback when search value changes */
  onSearchChange: (value: string) => void;
  /** Placeholder text for the search input */
  placeholder?: string;
}

/**
 * Flashcard search component with search icon
 * 
 * Features:
 * - Search input with icon
 * - Customizable placeholder
 * - Controlled input value
 * 
 * @param props - FlashcardSearchProps
 * @returns JSX element containing the search input
 */
export const FlashcardSearch = ({
  searchValue,
  onSearchChange,
  placeholder = "Search flashcards..."
}: FlashcardSearchProps) => {
  return (
    <div className="relative w-80">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 h-9 border-border focus-visible:ring-1"
      />
    </div>
  );
};
