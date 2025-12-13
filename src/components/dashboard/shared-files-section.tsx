"use client";

import { FileText, Users, Mail } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { FileCard } from "./widgets/file-card";
import { FileListItem } from "./widgets/file-list-item";
import { Button } from "../ui/button";
import { trpc } from "@/lib/trpc";
import { FileItem, transformFileInformation } from "@/lib/storage/transformFileFolderInfo";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

/**
 * Props for the SharedFilesSection component
 */
interface SharedFilesSectionProps {
  /** Current view mode */
  viewMode: "grid" | "list";
  /** Callback when file is clicked */
  onFileClick: (fileId: string) => void;
}

/**
 * Shared files section component
 * 
 * Features:
 * - Shows workspaces shared with the user
 * - Shows pending invitations with accept button
 * - Grid and list view modes
 * 
 * @param props - SharedFilesSectionProps
 * @returns JSX element containing the shared files section
 */
export const SharedFilesSection = ({
  viewMode,
  onFileClick,
}: SharedFilesSectionProps) => {
  const utils = trpc.useUtils();

  // Fetch shared workspaces and invitations
  const { data: sharedData, isLoading } = trpc.workspace.getSharedWith.useQuery({
    id: "", // Not used but required by the input schema
  });

  const [acceptingInvitationToken, setAcceptingInvitationToken] = useState<string | null>(null);

  // Accept invitation mutation
  const acceptInviteMutation = trpc.member.acceptInvite.useMutation({
    onSuccess: () => {
      utils.workspace.getSharedWith.invalidate();
      setAcceptingInvitationToken(null);
    },
  });

  const handleAcceptInvite = (token: string) => {
    setAcceptingInvitationToken(token);
    acceptInviteMutation.mutate({ token });
  };

  // Transform shared workspaces to FileItem format
  const sharedFiles: FileItem[] = sharedData?.shared?.map((workspace) => 
    transformFileInformation(workspace)
  ) || [];

  const invitations = sharedData?.invitations || [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted/50 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pending Invitations Section */}
      {invitations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-medium">Pending Invitations</h2>
          </div>
          <div className="space-y-2">
            {invitations.map((invitation) => (
              <Card key={invitation.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl leading-none">
                        {invitation.workspace?.icon || '📄'}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">
                          {invitation.workspace?.title || "Untitled Workspace"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Invited to collaborate
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvite(invitation.token)}
                      disabled={acceptingInvitationToken === invitation.token}
                    >
                      {acceptingInvitationToken === invitation.token ? "Accepting..." : "Accept"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Shared Workspaces Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-medium">Shared with you</h2>
        </div>
        
        {sharedFiles.length === 0 && invitations.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No shared workspaces"
            description="When someone shares a workspace with you, it will appear here"
          />
        ) : sharedFiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No shared workspaces yet</p>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {sharedFiles.map((file) => (
              <FileCard
                key={file.id}
                id={file.id}
                type={file.type}
                name={file.name}
                color={file.color}
                lastModified={file.lastModified}
                onClick={onFileClick}
                onDelete={() => {}} // No delete for shared files
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {sharedFiles.map((file) => (
              <FileListItem
                key={file.id}
                id={file.id}
                name={file.name}
                color={file.color}
                type={file.type}
                lastModified={file.lastModified}
                onClick={onFileClick}
                onDelete={() => {}} // No delete for shared files
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
