"use client";

import { useState, useEffect } from "react";
import { 
  Folder, 
  FileText, 
  MoreHorizontal, 
  Grid3X3, 
  List, 
  Plus,
  Search,
  ArrowLeft,
  Upload,
  Star,
  Users,
  Calendar,
  Edit3,
  Sparkles,
  FolderPlus,
  Share2,
  Download,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/useSession";
import { trpc } from "@/lib/trpc";
import { useRouter, useParams } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  lastModified: string;
  size?: string;
  isStarred?: boolean;
  sharedWith?: string[];
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

// Helper function to assign consistent colors to folders
const getFolderColor = (id: string) => {
  const colors = [
    "from-blue-500 to-blue-600", 
    "from-emerald-500 to-emerald-600", 
    "from-violet-500 to-violet-600", 
    "from-orange-500 to-orange-600", 
    "from-rose-500 to-rose-600", 
    "from-indigo-500 to-indigo-600"
  ];
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

export default function FolderPage() {
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

  // Simple data transformation with normal types
  const transformFolderData = () => {
    if (!workspaces) return { folderInfo: null, files: [], folders: [] };

    // Get files (workspaces) that belong to this folder
    const files: FileItem[] = workspaces.workspaces?.map(workspace => ({
      id: workspace.id,
      name: workspace.title || "Untitled File",
      type: "file",
      lastModified: workspace.updatedAt ? new Date(workspace.updatedAt).toLocaleDateString() : "Unknown",
      size: "Unknown", // You can fetch this separately if needed
      isStarred: false, // You can fetch this separately if needed
      sharedWith: [], // You can fetch this separately if needed
    })) || [];

    // Get subfolders that belong to this folder
    const folders: FileItem[] = workspaces.folders?.map(folder => ({
      id: folder.id,
      name: folder.name || "Untitled Folder",
      type: "folder",
      lastModified: folder.updatedAt ? new Date(folder.updatedAt).toLocaleDateString() : "Unknown",
      size: "Unknown", // You can fetch this separately if needed
      isStarred: false, // You can fetch this separately if needed
      sharedWith: [], // You can fetch this separately if needed
    })) || [];

    // For now, we'll create a mock folder info since we don't have the parent folder details
    // In a real app, you might want to fetch the parent folder details separately
    const folderInfo: FolderInfo = {
      id: folderId,
      name: "Current Folder", // This should come from a separate API call
      description: "",
      itemCount: files.length + folders.length,
      lastModified: "Unknown",
      color: getFolderColor(folderId),
      createdBy: "Unknown",
    };

    return { folderInfo, files, folders };
  };

  useEffect(() => {
    if (workspaces) {
      const { folderInfo, files, folders } = transformFolderData();
      setFolderInfo(folderInfo);
      setFiles(files);
      setFolders(folders);
    }
  }, [workspaces, folderId]);

  const handleFileClick = (fileId: string) => {
    router.push(`/workspace/${fileId}`);
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/dashboard/folder/${folderId}`);
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (workspacesError || !folderInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Folder Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {workspacesError?.message || "The requested folder could not be found."}
          </p>
          <Button onClick={handleBackClick}>Go Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{folderInfo.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${folderInfo.color} text-white`}>
            <Folder className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{folderInfo.name}</h1>
            <p className="text-muted-foreground">
              {folderInfo.itemCount} items • Last modified {folderInfo.lastModified}
            </p>
          </div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 w-8"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Items Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Items</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {filteredItems.length} items
            </Badge>
          </div>
        </div>
        
        {filteredItems.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No files in this folder</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload files or create new documents to get started.
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowUploadDialog(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                    <Button className="gradient-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      New File
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="card-hover cursor-pointer"
                    onClick={() => item.type === "folder" ? handleFolderClick(item.id) : handleFileClick(item.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="relative">
                          {item.type === "folder" ? (
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${getFolderColor(item.id)} text-white`}>
                              <Folder className="h-8 w-8" />
                            </div>
                          ) : (
                            <FileText className="h-12 w-12 text-muted-foreground" />
                          )}
                          {item.isStarred && (
                            <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -top-1 -right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem>Star</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="space-y-1 w-full">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {item.size}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.lastModified}
                          </p>
                          {item.sharedWith && item.sharedWith.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="card-hover cursor-pointer"
                    onClick={() => item.type === "folder" ? handleFolderClick(item.id) : handleFileClick(item.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {item.type === "folder" ? (
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${getFolderColor(item.id)} text-white`}>
                                <Folder className="h-5 w-5" />
                              </div>
                            ) : (
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            )}
                            {item.isStarred && (
                              <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.size} • {item.lastModified}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {item.sharedWith && item.sharedWith.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Shared
                            </Badge>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem>Star</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Upload files to this folder. You can select multiple files at once.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <Button variant="outline">Choose Files</Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary">Upload Files</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
            <DialogDescription>
              Update the folder name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Folder Name</label>
              <Input
                placeholder="Folder name"
                defaultValue={folderInfo.name}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Folder description"
                defaultValue={folderInfo.description}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
