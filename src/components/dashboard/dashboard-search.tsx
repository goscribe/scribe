"use client";

import { StorageSearch } from "./widgets/storage-search";
import { ViewModeToggle } from "./widgets/view-mode-toggle";

/**
 * Props for the DashboardSearch component
 */
interface DashboardSearchProps {
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Current view mode */
  viewMode: "grid" | "list";
  /** Callback when view mode changes */
  onViewModeChange: (mode: "grid" | "list") => void;
}

/**
 * Dashboard search and view controls component
 * 
 * Features:
 * - Search input with icon
 * - View mode toggle (grid/list)
 * - Responsive layout
 * 
 * @param props - DashboardSearchProps
 * @returns JSX element containing the search and view controls
 */
export const DashboardSearch = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange
}: DashboardSearchProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <StorageSearch 
        value={searchQuery} 
        onChange={onSearchChange}
      />
      
      <ViewModeToggle 
        viewMode={viewMode} 
        onViewModeChange={onViewModeChange}
      />
    </div>
  );
};
