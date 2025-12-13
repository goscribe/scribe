"use client";

import { useState } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderCard } from "./widgets/folder-card";
import { FolderListItem } from "./widgets/folder-list-item";
import { trpc } from "@/lib/trpc";
import { FolderItem } from "@/lib/storage/transformFileFolderInfo";
import CreateFolderModal from "../modals/create-folder-modal";
import EditFolderModal from "../modals/edit-folder-modal";
import DeletionConfirmationModal from "../modals/deletion-confirmation-modal";

/**
 * Props for the DashboardFoldersSection component
 */
interface DashboardFoldersSectionProps {
  /** Array of folders to display */
  folders: FolderItem[];
  /** Current view mode */
  viewMode: "grid" | "list";
  /** Callback when folder is clicked */
  onFolderClick: (folderId: string) => void;
}

/**
 * Dashboard folders section component
 * 
 * Features:
 * - Grid and list view modes
 * - Create new folder dialog with internal state
 * - Rename folder dialog with internal state
 * - Delete folder confirmation with internal state
 * - Empty state when no folders
 * - Handles all CRUD operations internally via TRPC
 * 
 * @param props - DashboardFoldersSectionProps
 * @returns JSX element containing the folders section
 */
export const DashboardFoldersSection = ({
  folders,
  viewMode,
  onFolderClick,
}: DashboardFoldersSectionProps) => {

  // Internal state for create dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);  
  // Internal state for edit dialog
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);
  // Internal state for delete dialog
  const [deletingFolder, setDeletingFolder] = useState<{ id: string; name: string } | null>(null);

  // TRPC mutations
  const utils = trpc.useUtils();

  const deleteFolderMutation = trpc.workspace.deleteFolder?.useMutation({
    onSuccess: () => {
      utils.workspace.list.invalidate();
      setDeletingFolder(null);
    },
  });

  const handleRenameFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    setEditingFolder(folder || null);
  };

  const handleDeleteFolder = (folderId: string) => {
    setDeletingFolder(folders.find(f => f.id === folderId) || null);
  };

  const confirmDeleteFolder = () => {
    if (deletingFolder && deleteFolderMutation) {
      deleteFolderMutation.mutate({ id: deletingFolder.id });
    }
  };
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium">Folders</h2>
        <Button size="sm" variant="outline" className="h-8" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-3.5 w-3.5 mr-2" />
          New Folder
        </Button>
        <CreateFolderModal
          isOpen={showCreateDialog}
          setIsOpen={setShowCreateDialog}
          onSuccess={() => {
            utils.workspace.list.invalidate();
          }}
        />
      </div>
      
      {folders.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="No folders yet"
          description="Create your first folder to organize your files"
          action={{
            label: "New Folder",
            onClick: () => setShowCreateDialog(true)
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
              onEdit={handleRenameFolder}
              onDelete={handleDeleteFolder}
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
              lastModified={folder.lastModified}
              onClick={onFolderClick}
              onEdit={handleRenameFolder}
              onDelete={handleDeleteFolder}
            />
          ))}
        </div>
      )}
      <EditFolderModal
        isOpen={editingFolder !== null}
        setIsOpen={(open) => setEditingFolder(open ? editingFolder : null)}
        editingFolder={editingFolder}
        onSuccess={() => {
          utils.workspace.list.invalidate();
        }}
      />
      <DeletionConfirmationModal
        isOpen={deletingFolder !== null}
        setIsOpen={(open) => setDeletingFolder(open ? deletingFolder : null)}
        onConfirm={confirmDeleteFolder}
        type="Folder"
        specificName={deletingFolder?.name || ""}
      />
    </div>
  );
};
