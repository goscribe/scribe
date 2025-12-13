"use client";

import { useState } from "react";
import { Grid3X3, List, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { StorageBreadcrumb } from "@/components/dashboard/widgets/storage-breadcrumb";
import { SharedFilesSection } from "@/components/dashboard/shared-files-section";

/**
 * Shared workspaces page component
 * 
 * Features:
 * - Display workspaces shared with the user
 * - Show pending invitations with accept button
 * - Grid/list view toggle
 * - Search functionality
 * 
 * @returns JSX element containing the shared workspaces page
 */
export default function SharedWorkspacesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleFileClick = (fileId: string) => {
    router.push(`/workspace/${fileId}`);
  };

  const breadcrumbItems = [
    { id: "shared", name: "Shared with me" }
  ];

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <StorageBreadcrumb 
          items={breadcrumbItems}
          onNavigate={() => {}}
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Shared with me</h1>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search shared workspaces..."
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

      {/* Shared Files Section */}
      <SharedFilesSection
        viewMode={viewMode}
        onFileClick={handleFileClick}
      />
    </div>
  );
}
