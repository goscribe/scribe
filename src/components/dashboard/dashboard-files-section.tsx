"use client";

import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { FileCard, FileListItem } from "@/components/ui/storage";

/**
 * Props for file items
 */
interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  lastModified: string;
  size?: string;
  isStarred?: boolean;
  sharedWith?: string[];
  icon?: string;
}

/**
 * Props for the DashboardFilesSection component
 */
interface DashboardFilesSectionProps {
  /** Array of files to display */
  files: FileItem[];
  /** Current view mode */
  viewMode: "grid" | "list";
  /** Callback when file is clicked */
  onFileClick: (fileId: string) => void;
}

/**
 * Dashboard files section component
 * 
 * Features:
 * - Grid and list view modes
 * - File count badge
 * - Empty state when no files
 * - File icons and metadata
 * 
 * @param props - DashboardFilesSectionProps
 * @returns JSX element containing the files section
 */
export const DashboardFilesSection = ({
  files,
  viewMode,
  onFileClick
}: DashboardFilesSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium">Recent Files</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {files.length} files
          </Badge>
        </div>
      </div>
      
      {files.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No files yet"
          description="Upload or create your first file to get started"
          action={{
            label: "Upload Files",
            onClick: () => console.log("Upload files")
          }}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {files.map((file) => (
            <FileCard
              key={file.id}
              id={file.id}
              name={file.name}
              icon={file.icon}
              lastModified={file.lastModified}
              isStarred={file.isStarred}
              onClick={onFileClick}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {files.map((file) => (
            <FileListItem
              key={file.id}
              id={file.id}
              name={file.name}
              icon={file.icon}
              isStarred={file.isStarred}
              onClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
