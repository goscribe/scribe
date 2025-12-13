"use client";

import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FolderCard, FolderListItem } from "@/components/ui/storage";

/**
 * Props for folder items
 */
interface FolderItem {
  id: string;
  name: string;
  itemCount: number;
  lastModified: string;
  color?: string;
}

/**
 * Props for the DashboardFoldersSection component
 */
interface DashboardFoldersSectionProps {
  /** Array of folders to display */
  folders: FolderItem[];
  /** Current view mode */
  viewMode: "grid" | "list";
  /** Whether create dialog is open */
  showCreateDialog: boolean;
  /** Callback to toggle create dialog */
  onToggleCreateDialog: (open: boolean) => void;
  /** New folder name input value */
  newFolderName: string;
  /** Callback when new folder name changes */
  onNewFolderNameChange: (name: string) => void;
  /** New folder color */
  newFolderColor: string;
  /** Callback when new folder color changes */
  onNewFolderColorChange: (color: string) => void;
  /** Callback when create folder is clicked */
  onCreateFolder: () => void;
  /** Callback when folder is clicked */
  onFolderClick: (folderId: string) => void;
  /** Callback when folder rename is requested */
  onRenameFolder: (folderId: string, folderName: string) => void;
  /** Callback when folder delete is requested */
  onDeleteFolder: (folderId: string, folderName: string) => void;
  /** Currently editing folder */
  editingFolder: { id: string; name: string; color?: string } | null;
  /** Callback when editing folder changes */
  onEditingFolderChange: (folder: { id: string; name: string; color?: string } | null) => void;
  /** Callback when save rename is clicked */
  onSaveRename: () => void;
  /** Currently deleting folder */
  deletingFolder: { id: string; name: string } | null;
  /** Callback when deleting folder changes */
  onDeletingFolderChange: (folder: { id: string; name: string } | null) => void;
  /** Callback when confirm delete is clicked */
  onConfirmDelete: () => void;
}

/**
 * Dashboard folders section component
 * 
 * Features:
 * - Grid and list view modes
 * - Create new folder dialog
 * - Rename folder dialog
 * - Delete folder confirmation
 * - Empty state when no folders
 * 
 * @param props - DashboardFoldersSectionProps
 * @returns JSX element containing the folders section
 */
export const DashboardFoldersSection = ({
  folders,
  viewMode,
  showCreateDialog,
  onToggleCreateDialog,
  newFolderName,
  onNewFolderNameChange,
  newFolderColor,
  onNewFolderColorChange,
  onCreateFolder,
  onFolderClick,
  onRenameFolder,
  onDeleteFolder,
  editingFolder,
  onEditingFolderChange,
  onSaveRename,
  deletingFolder,
  onDeletingFolderChange,
  onConfirmDelete
}: DashboardFoldersSectionProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium">Folders</h2>
        <Dialog open={showCreateDialog} onOpenChange={onToggleCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-8">
              <Plus className="h-3.5 w-3.5 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter a name and choose a color for your new folder.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input
                  id="folder-name"
                  placeholder="Enter folder name"
                  value={newFolderName}
                  onChange={(e) => onNewFolderNameChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && newFolderName.trim() && onCreateFolder()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder-color">Folder Color</Label>
                <div className="flex items-center gap-2">
                  <ColorPicker
                    value={newFolderColor}
                    onChange={onNewFolderColorChange}
                    showLabel={true}
                  />
                  <span className="text-sm text-muted-foreground">
                    Choose a color to identify your folder
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => onToggleCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={onCreateFolder} disabled={!newFolderName.trim()}>
                  Create Folder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {folders.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="No folders yet"
          description="Create your first folder to organize your files"
          action={{
            label: "New Folder",
            onClick: () => onToggleCreateDialog(true)
          }}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              color={folder.color || "#6366f1"}
              lastModified={folder.lastModified}
              onClick={onFolderClick}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {folders.map((folder) => (
            <FolderListItem
              key={folder.id}
              id={folder.id}
              name={folder.name}
              color={folder.color || "#6366f1"}
              onClick={onFolderClick}
            />
          ))}
        </div>
      )}

      {/* Rename Folder Dialog */}
      <Dialog open={!!editingFolder} onOpenChange={(open) => !open && onEditingFolderChange(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
            <DialogDescription>
              Update the name and color for your folder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-folder-name">Folder Name</Label>
              <Input
                id="edit-folder-name"
                placeholder="Enter folder name"
                value={editingFolder?.name || ""}
                onChange={(e) => onEditingFolderChange(editingFolder ? { ...editingFolder, name: e.target.value } : null)}
                onKeyDown={(e) => e.key === "Enter" && editingFolder?.name.trim() && onSaveRename()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-folder-color">Folder Color</Label>
              <div className="flex items-center gap-2">
                <ColorPicker
                  value={editingFolder?.color || "#6366f1"}
                  onChange={(color) => onEditingFolderChange(editingFolder ? { ...editingFolder, color } : null)}
                  showLabel={true}
                />
                <span className="text-sm text-muted-foreground">
                  Update the folder color
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onEditingFolderChange(null)}>
                Cancel
              </Button>
              <Button onClick={onSaveRename} disabled={!editingFolder?.name.trim()}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Folder Dialog */}
      <AlertDialog open={!!deletingFolder} onOpenChange={(open) => !open && onDeletingFolderChange(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingFolder?.name}"? This action cannot be undone and will delete all files within this folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
