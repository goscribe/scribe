"use client";

import { useState } from "react";
import { 
  FileText, 
  FolderClosed,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSession } from "@/lib/useSession";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardSearch } from "@/components/dashboard/dashboard-search";
import { DashboardFoldersSection } from "@/components/dashboard/dashboard-folders-section";
import { DashboardFilesSection } from "@/components/dashboard/dashboard-files-section";
import { formatBytes } from "@/lib/audio-validation";
import { FileItem, FolderItem, transformFileInformation, transformFolderInformation } from "@/lib/storage/transformFileFolderInfo";

/**
 * Dashboard page component for managing workspaces and folders
 * 
 * Features:
 * - Display folders and files in grid/list views
 * - Create, rename, and delete folders
 * - Search functionality
 * - Statistics overview
 * - Real-time data via TRPC
 * 
 * @returns JSX element containing the dashboard page
 */
export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: session, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  const { data: workspaceStats, isLoading: workspaceStatsLoading, refetch: refetchWorkspaceStats, error: workspaceStatsError } = trpc.workspace.getStats.useQuery();
  // Fetch workspace data from TRPC
  const { data: workspaces, isLoading: workspacesLoading, refetch: refetchWorkspaces, error: workspacesError } = trpc.workspace.list.useQuery({});

  /**
   * Handles folder click navigation
   * @param folderId - The ID of the folder to navigate to
   */
  const handleFolderClick = (folderId: string) => {
    router.push(`/storage/workspaces/${folderId}`);
  };

  /**
   * Handles file click navigation
   * @param fileId - The ID of the file to navigate to
   */
  const handleFileClick = (fileId: string) => {
    router.push(`/workspace/${fileId}`);
  };

  // Simple data transformation with normal types
  const folders: FolderItem[] = workspaces?.folders?.map(folder => transformFolderInformation(folder)) || [];

  const files: FileItem[] = workspaces?.workspaces?.map(workspace => transformFileInformation(workspace)) || [];

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sessionLoading || workspacesLoading || workspaceStatsLoading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-muted/50 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/50 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-muted/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (workspacesError) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Error Loading Workspaces</h2>
          <p className="text-muted-foreground text-sm mb-4">{workspacesError.message}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">Try Again</Button>
        </div>
      </div>
    );
  }

  // Prepare stats data
  const statsData = [
    {
      label: "Total Files",
      value: workspaceStats?.workspaces || 0,
      icon: FileText,
    },
    {
      label: "Folders",
      value: workspaceStats?.folders || 0,
      icon: FolderClosed,
    },
    {
      label: "Storage",
      value: workspaceStats?.spaceUsed ? formatBytes(workspaceStats.spaceUsed) : "Unknown",
      icon: BarChart3,
      extra: <div className="flex flex-col gap-2"><Progress value={workspaceStats?.spaceUsed ? (workspaceStats.spaceUsed / (workspaceStats.spaceTotal)) * 100 : 0} className="h-1.5 mt-2" /> <span className="text-xs text-muted-foreground">{workspaceStats?.spaceUsed ? formatBytes(workspaceStats.spaceUsed) + " / " + formatBytes(workspaceStats.spaceTotal) : "Unknown"}</span></div>,
    },
    {
      label: "Updated",
      value: workspaceStats?.lastUpdated ? new Date(workspaceStats.lastUpdated).toLocaleDateString() : "Unknown",
      icon: Calendar,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <DashboardHeader userName={session?.user?.name ?? ""} />

      {/* Search and View Controls */}
      <DashboardSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Stats Overview */}
      <DashboardStats stats={statsData} />

      {/* Folders Section */}
      <DashboardFoldersSection
        folders={filteredFolders}
        viewMode={viewMode}
        onFolderClick={handleFolderClick}
      />

      {/* Files Section */}
      <DashboardFilesSection
        files={filteredFiles}
        viewMode={viewMode}
        onFileClick={handleFileClick}
      />
    </div>
  );
}