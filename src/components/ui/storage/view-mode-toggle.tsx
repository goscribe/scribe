import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
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
  );
}

