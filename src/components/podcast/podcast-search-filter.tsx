"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/**
 * Props for the PodcastSearchFilter component
 */
interface PodcastSearchFilterProps {
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Current sort option */
  sortBy: 'newest' | 'oldest' | 'title' | 'duration';
  /** Callback when sort option changes */
  onSortChange: (sort: 'newest' | 'oldest' | 'title' | 'duration') => void;
  /** Number of filtered results */
  resultCount?: number;
}

/**
 * Search and filter component for podcasts
 * 
 * Features:
 * - Search by title and description
 * - Sort by date, title, or duration
 * - Clear search functionality
 * - Result count display
 * 
 * @param props - PodcastSearchFilterProps
 * @returns JSX element containing the search and filter controls
 */
export const PodcastSearchFilter = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  resultCount
}: PodcastSearchFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First' },
    { value: 'oldest' as const, label: 'Oldest First' },
    { value: 'title' as const, label: 'Title A-Z' },
    { value: 'duration' as const, label: 'Duration' },
  ];

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="flex items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search podcasts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Sort Filter */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsFilterOpen(false);
              }}
              className="cursor-pointer"
            >
              {option.label}
              {sortBy === option.value && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Result Count */}
      {resultCount !== undefined && (
        <div className="text-sm text-muted-foreground">
          {resultCount} episode{resultCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};


