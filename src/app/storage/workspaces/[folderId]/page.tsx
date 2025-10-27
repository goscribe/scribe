"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/useSession";
import { trpc } from "@/lib/trpc";
import { useRouter, useParams } from "next/navigation";
import { WorkspacesHeader } from "@/components/workspaces/workspaces-header";
import { WorkspacesSearch } from "@/components/workspaces/workspaces-search";
import { WorkspacesItemsSection } from "@/components/workspaces/workspaces-items-section";

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

interface FolderInfo {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  lastModified: string;
  color: string;
  createdBy: string;
}

/**
 * Workspaces page component for viewing folder contents
 * 
 * Features:
 * - Display files and subfolders in grid/list views
 * - Search functionality
 * - Upload files dialog
 * - Breadcrumb navigation
 * - Real-time data via TRPC
 * 
 * @returns JSX element containing the workspaces page
 */
export default function WorkspacesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [folderInfo, setFolderInfo] = useState<FolderInfo | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FileItem[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const folderId = params.folderId as string;

  // Fetch workspace data from TRPC
  const { data: workspaces, isLoading: workspacesLoading, error: workspacesError } = trpc.workspace.list.useQuery({
    parentId: folderId,
  });

  useEffect(() => {
    if (workspaces) {
      const { folderInfo, files, folders } = transformFolderData();
      
      setFolderInfo(folderInfo);
      setFiles(files);
      setFolders(folders);
    }
  }, [workspaces, folderId]);

  // Fetch folder details (name, description, meta) via TRPC
  const { data: folderDetails, isLoading: folderDetailsLoading } = trpc.workspace.getFolderInformation?.useQuery
    ? trpc.workspace.getFolderInformation.useQuery({ id: folderId }, { enabled: !!folderId })
    : ({ data: undefined } as never);


  if (!folderDetails && !folderDetailsLoading) {
    return <div>Folder not found</div>;
  }

  // Simple data transformation with normal types
  const transformFolderData = () => {
    if (!workspaces) return { folderInfo: null, files: [], folders: [] };

    // Get files (workspaces) that belong to this folder
    const files: FileItem[] = workspaces.workspaces?.map(workspace => ({
      id: workspace.id,
      name: workspace.title || "Untitled File",
      type: "file",
      lastModified: workspace.updatedAt ? new Date(workspace.updatedAt).toLocaleDateString() : "Unknown",
      size: "Unknown",
      isStarred: false,
      sharedWith: [],
      icon: workspace.icon, // Emoji icon from workspace data
    })) || [];

    // Get subfolders that belong to this folder
    const folders: FileItem[] = workspaces.folders?.map(folder => ({
      id: folder.id,
      name: folder.name || "Untitled Folder",
      type: "folder",
      lastModified: folder.updatedAt ? new Date(folder.updatedAt).toLocaleDateString() : "Unknown",
      size: "Unknown",
      isStarred: false,
      sharedWith: [],
      icon: folder.color || "#6366f1", // Store color in icon field for folders
    })) || [];

    // Use real folder details when available
    const folderInfo: FolderInfo = {
      id: folderId,
      name: folderDetails?.folder.name,
      itemCount: files.length + folders.length,
      lastModified: folderDetails?.folder.updatedAt
        ? new Date(folderDetails.folder.updatedAt).toLocaleDateString()
        : "Unknown",
      color: folderDetails?.folder.color || "#6366f1", // Use folder's hex color
      createdBy: folderDetails?.folder.ownerId || "Unknown",
    };

    return { folderInfo, files, folders };
  };

  const handleFileClick = (fileId: string) => {
    router.push(`/workspace/${fileId}`);
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/dashboard/workspaces/${folderId}`);
  };

  const handleBackClick = () => {
    router.push('/dashboard');
  };

  const allItems = [...folders, ...files];
  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (workspacesLoading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-muted/50 rounded w-1/4 mb-8"></div>
          <div className="h-10 bg-muted/50 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-muted/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (workspacesError || (!folderInfo && !workspacesLoading)) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="h-8"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Folder Not Found</h2>
          <p className="text-muted-foreground text-sm mb-4">
            {workspacesError?.message || "The requested folder could not be found."}
          </p>
          <Button onClick={handleBackClick} variant="outline" size="sm">Go Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <WorkspacesHeader
        folderInfo={{
          id: folderInfo!.id,
          name: folderInfo!.name,
          color: folderInfo!.color
        }}
        onBackClick={handleBackClick}
      />

      {/* Search and View Controls */}
      <WorkspacesSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Items Section */}
      <WorkspacesItemsSection
        items={filteredItems}
        viewMode={viewMode}
        showUploadDialog={showUploadDialog}
        onToggleUploadDialog={setShowUploadDialog}
        onFileClick={handleFileClick}
        onFolderClick={handleFolderClick}
      />
    </div>
  );
}
