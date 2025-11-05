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
      "bg-background border-r-2 border-border/50 transition-all duration-300 ease-out flex flex-col",
      "h-[calc(100vh-3rem)]", // Subtract navbar height and add shadow
      isCollapsed ? "w-[4.5rem]" : "w-72"
    )}>
      <div className="border-b border-border/50 bg-muted/5">
        <WorkspaceDropdown isCollapsed={isCollapsed} />
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <NavigationTabs 
          onTabChange={onTabChange}
          activeTab={activeTab} 
          isCollapsed={isCollapsed} 
        />
        
        {!isCollapsed && (
          <div className="mt-2">
            <FilesSection 
              files={files} 
              isUploading={isUploading || false} 
              onUploadClick={onUploadClick || (() => {})} 
            />
          </div>
        )}
      </div>
    </div>
  );
};
