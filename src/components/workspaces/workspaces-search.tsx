"use client";

import { Search, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Props for the WorkspacesSearch component
 */
interface WorkspacesSearchProps {
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
 * Workspaces search and view controls component
 * 
 * Features:
 * - Search input with icon
 * - View mode toggle (grid/list)
 * - Responsive layout
 * 
 * @param props - WorkspacesSearchProps
 * @returns JSX element containing the search and view controls
 */
export const WorkspacesSearch = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange
}: WorkspacesSearchProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-80 h-9 border-border focus-visible:ring-1"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center border border-border rounded-md">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-8 rounded-r-none border-r"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-8 rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
