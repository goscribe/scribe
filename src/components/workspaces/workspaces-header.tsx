"use client";

import { ArrowLeft, FolderClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

/**
 * Props for the WorkspacesHeader component
 */
interface WorkspacesHeaderProps {
  /** Folder information */
  folderInfo: {
    id: string;
    name: string;
    color: string;
  };
  /** Callback when back button is clicked */
  onBackClick: () => void;
}

/**
 * Workspaces header component with breadcrumb and folder info
 * 
 * Features:
 * - Breadcrumb navigation
 * - Folder icon with color
 * - Back button
 * - Folder name display
 * 
 * @param props - WorkspacesHeaderProps
 * @returns JSX element containing the workspaces header
 */
export const WorkspacesHeader = ({ folderInfo, onBackClick }: WorkspacesHeaderProps) => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium">{folderInfo.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div>
            <FolderClosed className="h-8 w-8" fill="currentColor" style={{ color: folderInfo.color }} />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{folderInfo.name}</h1>
          </div>
        </div>
      </div>
    </>
  );
};
