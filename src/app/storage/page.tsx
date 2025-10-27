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

interface FolderItem {
  id: string;
  name: string;
  itemCount: number;
  lastModified: string;
  color?: string;
}

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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<{ id: string; name: string } | null>(null);
  
  const { data: session, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  // Fetch workspace data from TRPC
  const { data: workspaces, isLoading: workspacesLoading, error: workspacesError } = trpc.workspace.list.useQuery({});
  
  // Folder mutations
  const utils = trpc.useUtils();
  const createFolderMutation = trpc.workspace.createFolder?.useMutation({
    onSuccess: () => {
      utils.workspace.list.invalidate();
      setShowCreateDialog(false);
      setNewFolderName("");
    },
  });
  
  const updateFolderMutation = trpc.workspace.updateFolder?.useMutation({
    onSuccess: () => {
      utils.workspace.list.invalidate();
      setEditingFolder(null);
    },
  });
  
  const deleteFolderMutation = trpc.workspace.deleteFolder?.useMutation({
    onSuccess: () => {
      utils.workspace.list.invalidate();
      setDeletingFolder(null);
    },
  });

  /**
   * Handles folder click navigation
   * @param folderId - The ID of the folder to navigate to
   */
  const handleFolderClick = (folderId: string) => {
    router.push(`/dashboard/workspaces/${folderId}`);
  };

  /**
   * Handles file click navigation
   * @param fileId - The ID of the file to navigate to
   */
  const handleFileClick = (fileId: string) => {
    router.push(`/workspace/${fileId}`);
  };

  /**
   * Creates a new folder
   */
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      if (createFolderMutation) {
        createFolderMutation.mutate({ name: newFolderName.trim() });
      }
    }
  };
  
  /**
   * Initiates folder rename
   * @param folderId - The ID of the folder to rename
   * @param folderName - The current name of the folder
   */
  const handleRenameFolder = (folderId: string, folderName: string) => {
    setEditingFolder({ id: folderId, name: folderName });
  };
  
  /**
   * Saves the folder rename
   */
  const handleSaveRename = () => {
    if (editingFolder && editingFolder.name.trim()) {
      if (updateFolderMutation) {
        updateFolderMutation.mutate({ 
          id: editingFolder.id, 
          name: editingFolder.name.trim() 
        });
      }
    }
  };
  
  /**
   * Initiates folder deletion
   * @param folderId - The ID of the folder to delete
   * @param folderName - The name of the folder to delete
   */
  const handleDeleteFolder = (folderId: string, folderName: string) => {
    setDeletingFolder({ id: folderId, name: folderName });
  };
  
  /**
   * Confirms folder deletion
   */
  const confirmDeleteFolder = () => {
    if (deletingFolder) {
      if (deleteFolderMutation) {
        deleteFolderMutation.mutate({ id: deletingFolder.id });
      }
    }
  };

  // Simple data transformation with normal types
  const folders: FolderItem[] = workspaces?.folders?.map(folder => ({
    id: folder.id,
    name: folder.name || "Untitled Folder",
    itemCount: 0, // You can fetch this separately if needed
    lastModified: folder.updatedAt ? new Date(folder.updatedAt).toLocaleDateString() : "Unknown",
    color: folder.color || "#6366f1", // Use folder's hex color or default to indigo
  })) || [];

  const files: FileItem[] = workspaces?.workspaces?.map(workspace => ({
    id: workspace.id,
    name: workspace.title || "Untitled File",
    type: "file",
    lastModified: workspace.updatedAt ? new Date(workspace.updatedAt).toLocaleDateString() : "Unknown",
    size: "Unknown", // You can fetch this separately if needed
    isStarred: false, // You can fetch this separately if needed
    sharedWith: [], // You can fetch this separately if needed
    icon: workspace.icon, // Emoji icon from workspace data
  })) || [];

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sessionLoading || workspacesLoading) {
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
      value: files.length,
      icon: FileText,
    },
    {
      label: "Folders",
      value: folders.length,
      icon: FolderClosed,
    },
    {
      label: "Storage",
      value: "2.4 GB",
      icon: BarChart3,
      extra: <Progress value={65} className="h-1.5 mt-2" />,
    },
    {
      label: "Updated",
      value: "Today",
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
        showCreateDialog={showCreateDialog}
        onToggleCreateDialog={setShowCreateDialog}
        newFolderName={newFolderName}
        onNewFolderNameChange={setNewFolderName}
        onCreateFolder={handleCreateFolder}
        onFolderClick={handleFolderClick}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
        editingFolder={editingFolder}
        onEditingFolderChange={setEditingFolder}
        onSaveRename={handleSaveRename}
        deletingFolder={deletingFolder}
        onDeletingFolderChange={setDeletingFolder}
        onConfirmDelete={confirmDeleteFolder}
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