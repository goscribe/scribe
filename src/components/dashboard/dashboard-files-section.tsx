"use client";

import { FileText, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { FileCard } from "./widgets/file-card";
import { FileListItem } from "./widgets/file-list-item";
import { Button } from "../ui/button";
import { useState } from "react";
import CreateWorkspaceModal from "@/components/modals/create-file-modal";
import { trpc } from "@/lib/trpc";
import { FileItem } from "@/lib/storage/transformFileFolderInfo";
import DeletionConfirmationModal from "../modals/deletion-confirmation-modal";

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
 * - Empty state when no files
 * 
 * @param props - DashboardFilesSectionProps
 * @returns JSX element containing the files section
 */
export const DashboardFilesSection = ({
  files,
  viewMode,
  onFileClick,
}: DashboardFilesSectionProps) => {
  const [isOpenNewWorkspaceModal, setIsOpenNewWorkspaceModal] = useState(false);

  const utils = trpc.useUtils();

  const [deletingWorkspace, setDeletingWorkspace] = useState<FileItem | null>(null);

  const deleteWorkspaceMutation = trpc.workspace.delete?.useMutation({
    onSuccess: () => {
      utils.workspace.list.invalidate();
      setDeletingWorkspace(null);
    },
  });

  const handleDeleteFile = () => {
    if (deletingWorkspace && deleteWorkspaceMutation) {
      deleteWorkspaceMutation.mutate({ id: deletingWorkspace.id });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium">Files</h2>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="h-8" onClick={() => setIsOpenNewWorkspaceModal(true)}>
              <Plus className="h-3.5 w-3.5 mr-2" />
              New Workspace
            </Button>
        </div>
      </div>
      
      {files.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No files yet"
          description="Upload or create your first file to get started"
          action={{
            label: "New File",
            onClick: () => setIsOpenNewWorkspaceModal(true)
          }}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {files.map((file) => (
            <FileCard
              key={file.id}
              id={file.id}
              type={file.type}
              name={file.name}
              color={file.color}
              lastModified={file.lastModified}
              onClick={onFileClick}
              onDelete={(id) => setDeletingWorkspace(files.find(f => f.id === id) || null)}
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
              color={file.color}
              type={file.type}
              lastModified={file.lastModified}
              onClick={onFileClick}
              onDelete={(id) => setDeletingWorkspace(files.find(f => f.id === id) || null)}
            />
          ))}
        </div>
      )}
      <CreateWorkspaceModal
        isOpen={isOpenNewWorkspaceModal}
        setIsOpen={setIsOpenNewWorkspaceModal}
        onSuccess={() => {
          utils.workspace.list.invalidate();
        }}
      />
      <DeletionConfirmationModal
        isOpen={deletingWorkspace !== null}
        setIsOpen={(open) => setDeletingWorkspace(open ? deletingWorkspace : null)}
        onConfirm={handleDeleteFile}
        type="File"
        specificName={deletingWorkspace?.name || ""}
      />
    </div>
  );
};
