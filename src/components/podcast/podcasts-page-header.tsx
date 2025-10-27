"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PodcastSearchFilter } from "./podcast-search-filter";

/**
 * Props for the PodcastsPageHeader component
 */
interface PodcastsPageHeaderProps {
  /** Number of podcast episodes */
  episodeCount: number;
  /** Callback when create button is clicked */
  onCreateClick: () => void;
  /** Whether creation is in progress */
  isCreating: boolean;
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Current sort option */
  sortBy: 'newest' | 'oldest' | 'title' | 'duration';
  /** Callback when sort option changes */
  onSortChange: (sort: 'newest' | 'oldest' | 'title' | 'duration') => void;
  /** Number of filtered results */
  filteredCount?: number;
}

/**
 * Podcasts page header component with title, count, search, and actions
 * 
 * Features:
 * - Displays podcast episode count
 * - Search and filter functionality
 * - Create new podcast button
 * - Loading state for creation
 * 
 * @param props - PodcastsPageHeaderProps
 * @returns JSX element containing the podcasts page header
 */
export const PodcastsPageHeader = ({
  episodeCount,
  onCreateClick,
  isCreating,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filteredCount
}: PodcastsPageHeaderProps) => {
  return (
    <div className="space-y-4">
      {/* Title and Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Podcasts</h3>
          <p className="text-sm text-muted-foreground">
            {episodeCount} episode{episodeCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          className="h-8"
          disabled={isCreating}
          onClick={onCreateClick}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Podcast
        </Button>
      </div>

      {/* Search and Filter */}
      <PodcastSearchFilter
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        resultCount={filteredCount}
      />
    </div>
  );
};
