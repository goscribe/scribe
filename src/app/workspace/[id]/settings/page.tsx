"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { WorkspaceSettingsForm } from "@/components/workspace/workspace-settings-form";
import { iconToEmoji } from "@/lib/workspace-icons";
import { RouterInputs } from "@goscribe/server";

type WorkspaceSettings = RouterInputs['workspace']['update'];

/**
 * Workspace settings page component
 * 
 * Features:
 * - Display and edit workspace properties
 * - Icon picker with emoji mapping
 * - Name and description editing
 * - Color theme selection
 * - Real-time updates via TRPC
 * 
 * @returns JSX element containing the workspace settings page
 */
export default function WorkspaceSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const [isSaving, setIsSaving] = useState(false);

  // Fetch workspace data
  const { data: workspace, isLoading, error, refetch } = trpc.workspace.get.useQuery(
    { id: workspaceId },
    { enabled: !!workspaceId }
  );

  // Update workspace mutation
  const updateWorkspaceMutation = trpc.workspace.update.useMutation({
    onSuccess: () => {
      toast.success("Workspace updated successfully!");
      refetch();
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update workspace");
      setIsSaving(false);
    },
  });

  /**
   * Handles saving workspace settings
   * @param settings - The updated workspace settings
   */
  const handleSave = async (settings: WorkspaceSettings) => {
    setIsSaving(true);
    
    try {
      await updateWorkspaceMutation.mutateAsync({
        id: workspaceId,
        name: settings.name,
        description: settings.description,
        color: settings.color,
        icon: settings.icon,
      });
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error("Failed to update workspace:", error);
    }
  };

  /**
   * Handles back navigation
   */
  const handleBack = () => {
    router.push(`/workspace/${workspaceId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted/50 rounded w-1/3"></div>
          <div className="h-96 bg-muted/50 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Error Loading Workspace</h2>
          <p className="text-muted-foreground text-sm mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No workspace found
  if (!workspace) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Workspace Not Found</h2>
          <p className="text-muted-foreground text-sm mb-4">
            The requested workspace could not be found.
          </p>
          <Button onClick={handleBack} variant="outline" size="sm">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex justify-center">

      {/* Settings Form */}
      <div className="max-w-2xl">
        <WorkspaceSettingsForm
          initialSettings={{
            id: workspace.id,
            name: workspace.title || '',
            description: workspace.description || '',
            color: workspace.color || '#6366f1',
            icon: workspace.icon || 'file-text',
          }}
          onSave={handleSave}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}