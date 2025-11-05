"use client";

import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AnalysisLoadingOverlay } from "@/components/analysis-loading-overlay";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { SidebarToggle } from "@/components/workspace/sidebar-toggle";
import { useFileUpload } from "@/hooks/use-file-upload";
import { trpc } from "@/lib/trpc";
import { WorkspaceTab } from "@/components/workspace/navigation-tabs";
import { usePusherAnalysis } from "@/hooks/pusher/use-pusher-analysis";

/**
 * Props for the WorkspaceLayout component
 */
interface WorkspaceLayoutProps {
  /** Child components to render in the main content area */
  children: React.ReactNode;
}

/**
 * Main workspace layout component
 * 
 * Provides the complete workspace interface including:
 * - Collapsible sidebar with navigation and file management
 * - File upload functionality with drag & drop support
 * - AI analysis overlay for processing feedback
 * - Responsive layout with proper spacing
 * - Development tools (Pusher test panel)
 * 
 * Features:
 * - Tab-based navigation between workspace sections
 * - File upload with automatic AI analysis
 * - Real-time analysis progress tracking
 * - Sidebar collapse/expand functionality
 * - Drag & drop file support
 * 
 * @param props - WorkspaceLayoutProps
 * @returns JSX element containing the complete workspace layout
 */
export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  // State management
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Next.js hooks
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();

  const activeTab = pathname.split('/').pop() as WorkspaceTab;

  const { progress, isAnalyzing } = usePusherAnalysis({
    workspaceId: id as string,
    enabled: true,
  });

  const [analysisOverlayOpen, setAnalysisOverlayOpen] = useState(false);
  
  const { 
    isUploading, 
    fileInputRef, 
    handleFileUpload, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop, 
    handleUploadClick 
  } = useFileUpload(id as string, () => {
    refetchWorkspace();
  });

  // Workspace data fetching
  const { data: workspace, refetch: refetchWorkspace } = trpc.workspace.get.useQuery({
    id: id as string,
  }, {
    enabled: !!id,
  });

  const files = workspace?.uploads || [];

  return (
    <div 
      className="flex h-[calc(100vh-3rem)]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Workspace Sidebar with navigation and file management */}
      <WorkspaceSidebar 
        onTabChange={(tab) => {
          router.push(`/workspace/${id}/${tab}`);
        }}
        activeTab={activeTab} 
        isCollapsed={isSidebarCollapsed}
        isUploading={isUploading}
        onUploadClick={handleUploadClick}
        files={files}
      />
      
      {/* Sidebar Toggle Button */}
      <SidebarToggle 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {/* Hidden File Input for programmatic file selection */}
        <input
          id="sidebar-file-upload"
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.pptx,.txt,.mp3,.wav,.jpg,.jpeg,.png,.gif"
          onChange={handleFileUpload}
          className="hidden"
          multiple
        />
        
        {/* Content with conditional margin based on route */}
        <div className={`${pathname.includes('chat') ? 'm-0' : 'm-5'} flex-1`}>
          {children}
        </div>
      </main>
      
      {/* AI Analysis Loading Overlay */}
      <AnalysisLoadingOverlay
        workspaceId={id as string}
        isOpen={isAnalyzing || false}
        onClose={() => {
          setAnalysisOverlayOpen(false);
        }}
      />
    </div>
  );
}