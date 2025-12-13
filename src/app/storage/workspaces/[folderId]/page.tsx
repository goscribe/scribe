"use client";

import { useState, useEffect } from "react";
import { Upload, Grid3X3, List, Search, FolderClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useRouter, useParams } from "next/navigation";
import { StorageBreadcrumb } from "@/components/dashboard/widgets/storage-breadcrumb";
import { DashboardFoldersSection } from "@/components/dashboard/dashboard-folders-section";
import { DashboardFilesSection } from "@/components/dashboard/dashboard-files-section";
import { FileItem, FolderItem, transformFileInformation, transformFolderInformation } from "@/lib/storage/transformFileFolderInfo";

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
  const [folderInfo, setFolderInfo] = useState<FolderItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [breadcrumbItems, setBreadcrumbItems] = useState<Array<{ id: string; name: string; color?: string }>>([]);
  const router = useRouter();
  const params = useParams();
  const folderId = params.folderId as string;

  // Fetch workspace data from TRPC
  const { data: workspaces, isLoading: workspacesLoading, error: workspacesError } = trpc.workspace.list.useQuery({
    parentId: folderId,
  });

  // Fetch folder details (name, description, meta) via TRPC
  const { data: folderDetails, isLoading: folderDetailsLoading } = trpc.workspace.getFolderInformation?.useQuery
    ? trpc.workspace.getFolderInformation.useQuery({ id: folderId }, { enabled: !!folderId })
    : ({ data: undefined } as never);

  // Build breadcrumb path from current folder
  useEffect(() => {
    if (!folderDetails?.folder) {
      setBreadcrumbItems([]);
      return;
    }

    // For now, just show current folder in breadcrumb
    // Full hierarchy would require fetching parent folders recursively
    // which is better done server-side or with a dedicated API endpoint
    setBreadcrumbItems([{
      id: folderDetails.folder.id,
      name: folderDetails.folder.name,
      color: folderDetails.folder.color,
    }]);
  }, [folderDetails, folderId]);

  useEffect(() => {
    if (!workspaces || !folderDetails) return;

    // Get files (workspaces) that belong to this folder
    const transformedFiles: FileItem[] = workspaces.workspaces?.map(workspace => transformFileInformation(workspace)) || [];

    // Get subfolders that belong to this folder
    const transformedFolders: FolderItem[] = workspaces.folders?.map(folder => transformFolderInformation(folder)) || [];

    const transformedFolderInfo: FolderItem = transformFolderInformation(folderDetails?.folder || {});
    
    setFolderInfo(transformedFolderInfo);
    setFiles(transformedFiles);
    setFolders(transformedFolders);
  }, [workspaces, folderDetails, folderId]);

  if (!folderDetails && !folderDetailsLoading) {
    return <div>Folder not found</div>;
  }

  const handleFileClick = (fileId: string) => {
    router.push(`/workspace/${fileId}`);
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/storage/workspaces/${folderId}`);
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (workspacesLoading || folderDetailsLoading) {
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
        <div className="mb-6">
          <StorageBreadcrumb 
            items={breadcrumbItems}
            onNavigate={(folderId) => router.push(`/storage/workspaces/${folderId}`)}
          />
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Folder Not Found</h2>
          <p className="text-muted-foreground text-sm mb-4">
            {workspacesError?.message || "The requested folder could not be found."}
          </p>
          <Button onClick={() => router.push('/storage')} variant="outline" size="sm">Go Back to Storage</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <StorageBreadcrumb 
          items={breadcrumbItems}
          onNavigate={(folderId) => router.push(`/storage/workspaces/${folderId}`)}
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FolderClosed className="h-5 w-5" fill="currentColor" style={{ color: folderInfo?.color || '#6366f1' }} />  
          <h1 className="text-2xl font-bold">{folderInfo?.name}</h1>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="h-9 w-9"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="h-9 w-9"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

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