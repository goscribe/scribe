"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Props for the SidebarToggle component
 */
interface SidebarToggleProps {
  /** Whether the sidebar is currently collapsed */
  isCollapsed: boolean;
  /** Callback function when toggle button is clicked */
  onToggle: () => void;
}

/**
 * Sidebar toggle button component
 * 
 * Provides a floating toggle button to collapse/expand the workspace sidebar.
 * The button is positioned absolutely and shows different icons based on state.
 * 
 * @param props - SidebarToggleProps
 * @returns JSX element containing the toggle button
 */
export const SidebarToggle = ({ isCollapsed, onToggle }: SidebarToggleProps) => {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="absolute -left-3 top-4 z-10 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-muted"
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-3 w-3" />
        ) : (
          <PanelLeftClose className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};
