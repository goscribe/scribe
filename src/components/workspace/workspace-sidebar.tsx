"use client";

import { cn } from "@/lib/utils";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { NavigationTabs, WorkspaceTab } from "./navigation-tabs";
import { FilesSection } from "./files-section";
import { RouterOutputs } from "@goscribe/server";

type MediaFile = RouterOutputs['workspace']['get']['uploads'][number];

/**
 * Props for the WorkspaceSidebar component
 */
interface WorkspaceSidebarProps {
  /** Currently active tab */
  activeTab: WorkspaceTab;
  /** Callback function when tab changes */
  onTabChange: (tab: WorkspaceTab) => void;
  /** Whether the sidebar is collapsed */
  isCollapsed: boolean;
  /** Whether files are currently being uploaded */
  isUploading?: boolean;
  /** Callback function when upload button is clicked */
  onUploadClick?: () => void;
  /** Array of files to display in the files section */
  files: MediaFile[];
}

/**
 * Main workspace sidebar component
 * 
 * Composes all sidebar functionality including:
 * - Workspace selection dropdown
 * - Navigation tabs with sections
 * - Files section with upload capability
 * - Responsive collapsed/expanded states
 * 
 * @param props - WorkspaceSidebarProps
 * @returns JSX element containing the complete workspace sidebar
 */
export const WorkspaceSidebar = ({ 
  activeTab, 
  onTabChange,
  isCollapsed, 
  isUploading, 
  onUploadClick,
  files 
}: WorkspaceSidebarProps) => {
  return (
    <div className={cn(
      "bg-muted/40 border-r border-border transition-all duration-300 ease-in-out",
      "h-[calc(100vh-3rem)] overflow-y-auto", // Subtract navbar height and allow scrolling
      isCollapsed ? "w-16" : "w-64"
    )}>
      <WorkspaceDropdown isCollapsed={isCollapsed} />
      
      <NavigationTabs 
        onTabChange={onTabChange}
        activeTab={activeTab} 
        isCollapsed={isCollapsed} 
      />
      
      {!isCollapsed && (
        <FilesSection 
          files={files} 
          isUploading={isUploading || false} 
          onUploadClick={onUploadClick || (() => {})} 
        />
      )}
    </div>
  );
};
