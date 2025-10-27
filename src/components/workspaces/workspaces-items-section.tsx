"use client";

import { Plus, Upload, FileText, Star, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/**
 * Props for file/folder items
 */
interface Item {
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
 * Props for the WorkspacesItemsSection component
 */
interface WorkspacesItemsSectionProps {
  /** Array of items to display */
  items: Item[];
  /** Current view mode */
  viewMode: "grid" | "list";
  /** Whether upload dialog is open */
  showUploadDialog: boolean;
  /** Callback to toggle upload dialog */
  onToggleUploadDialog: (open: boolean) => void;
  /** Callback when file is clicked */
  onFileClick: (fileId: string) => void;
  /** Callback when folder is clicked */
  onFolderClick: (folderId: string) => void;
}

/**
 * Workspaces items section component
 * 
 * Features:
 * - Grid and list view modes
 * - File and folder display
 * - Upload dialog
 * - Item actions menu
 * - Empty state
 * 
 * @param props - WorkspacesItemsSectionProps
 * @returns JSX element containing the items section
 */
export const WorkspacesItemsSection = ({
  items,
  viewMode,
  showUploadDialog,
  onToggleUploadDialog,
  onFileClick,
  onFolderClick
}: WorkspacesItemsSectionProps) => {
  const handleItemClick = (item: Item) => {
    if (item.type === "folder") {
      onFolderClick(item.id);
    } else {
      onFileClick(item.id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium">Items</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {items.length} items
          </Badge>
        </div>
      </div>
      
      {items.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-base font-medium mb-1">No files in this folder</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Upload files or create new documents to get started.
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleUploadDialog(true)}
                  >
                    <Upload className="h-3.5 w-3.5 mr-2" />
                    Upload Files
                  </Button>
                  <Button size="sm">
                    <Plus className="h-3.5 w-3.5 mr-2" />
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="card-hover cursor-pointer group"
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        {item.type === "folder" ? (
                          <div className="h-6 w-6 rounded" style={{ backgroundColor: item.icon }} />
                        ) : (
                          <div className="text-2xl leading-none">
                            {item.icon}
                          </div>
                        )}
                        {item.isStarred && (
                          <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.lastModified}
                        </p>
                        {item.sharedWith && item.sharedWith.length > 0 && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Shared
                          </Badge>
                        )}
                      </div>
                     
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="linear-list-item cursor-pointer group"
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {item.type === "folder" ? (
                            <div className="h-5 w-5 rounded" style={{ backgroundColor: item.icon }} />
                          ) : (
                            <div className="text-lg leading-none">
                              {item.icon || '📄'}
                            </div>
                          )}
                          {item.isStarred && (
                            <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{item.name}</h3>
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
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={onToggleUploadDialog}>
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
              <Button variant="outline" onClick={() => onToggleUploadDialog(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary">Upload Files</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
