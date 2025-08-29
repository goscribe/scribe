"use client";

import { useState } from "react";
import { 
  Folder, 
  FileText, 
  MoreHorizontal, 
  Grid3X3, 
  List, 
  Plus,
  Search,
  ArrowLeft,
  FolderPlus,
  Upload,
  Star,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Zap,
  Sparkles,
  Activity,
  BarChart3,
  Settings,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
import { useRouter } from "next/navigation";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  lastModified: string;
  size?: string;
  isStarred?: boolean;
  sharedWith?: string[];
}

interface FolderItem {
  id: string;
  name: string;
  itemCount: number;
  lastModified: string;
  color?: string;
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

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  const { data: session, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  // Fetch workspace data from TRPC
  const { data: workspaces, isLoading: workspacesLoading, error: workspacesError } = trpc.workspace.list.useQuery({});

  const handleFolderClick = (folderId: string) => {
    router.push(`/dashboard/folder/${folderId}`);
  };

  const handleFileClick = (fileId: string) => {
    router.push(`/workspace/${fileId}`);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      // Add folder creation logic here
      console.log("Creating folder:", newFolderName);
      setNewFolderName("");
      setShowCreateDialog(false);
    }
  };

  // Simple data transformation with normal types
  const folders: FolderItem[] = workspaces?.folders?.map(folder => ({
    id: folder.id,
    name: folder.name || "Untitled Folder",
    itemCount: 0, // You can fetch this separately if needed
    lastModified: folder.updatedAt ? new Date(folder.updatedAt).toLocaleDateString() : "Unknown",
    color: getFolderColor(folder.id),
  })) || [];

  const files: FileItem[] = workspaces?.workspaces?.map(workspace => ({
    id: workspace.id,
    name: workspace.title || "Untitled File",
    type: "file",
    lastModified: workspace.updatedAt ? new Date(workspace.updatedAt).toLocaleDateString() : "Unknown",
    size: "Unknown", // You can fetch this separately if needed
    isStarred: false, // You can fetch this separately if needed
    sharedWith: [], // You can fetch this separately if needed
  })) || [];

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sessionLoading || workspacesLoading) {
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

  if (workspacesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Workspaces</h2>
          <p className="text-muted-foreground mb-4">{workspacesError.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage your files and folders
        </p>
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Folders</p>
                <p className="text-2xl font-bold">{folders.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Folder className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">2.4 GB</p>
                <Progress value={65} className="h-2 mt-2" />
              </div>
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-lg font-bold">Today</p>
              </div>
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Folders Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Folders</h2>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Enter a name for your new folder to organize your files.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder} className="gradient-primary">Create Folder</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredFolders.map((folder) => (
              <Card
                key={folder.id}
                className="card-hover cursor-pointer"
                onClick={() => handleFolderClick(folder.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${folder.color} text-white`}>
                      <Folder className="h-8 w-8" />
                    </div>
                    
                    <div className="space-y-1 w-full">
                      <h3 className="font-medium text-sm line-clamp-2">
                        {folder.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {folder.lastModified}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFolders.map((folder) => (
              <Card
                key={folder.id}
                className="card-hover cursor-pointer"
                onClick={() => handleFolderClick(folder.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${folder.color} text-white`}>
                        <Folder className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{folder.name}</h3>
                      </div>
                    </div>
                    
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>



      {/* Files Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Files</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {filteredFiles.length} files
            </Badge>
          </div>
        </div>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                className="card-hover cursor-pointer"
                onClick={() => handleFileClick(file.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      {file.isStarred && (
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
                        {file.name}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                className="card-hover cursor-pointer"
                onClick={() => handleFileClick(file.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        {file.isStarred && (
                          <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
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
      </div>
    </div>
  );
}