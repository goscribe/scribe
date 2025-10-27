"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

/**
 * Props for the WorkspaceDropdown component
 */
interface WorkspaceDropdownProps {
  /** Whether the sidebar is collapsed */
  isCollapsed: boolean;
}

/**
 * Converts a hex color to an rgba color
 * @param hex - The hex color
 * @param alpha - The alpha value
 * @returns The rgba color
 */
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Workspace dropdown component for selecting and searching workspaces
 * 
 * Provides a dropdown interface for:
 * - Displaying current workspace with avatar
 * - Searching through available workspaces
 * - Switching between workspaces
 * - Supporting both collapsed and expanded sidebar states
 * 
 * @param props - WorkspaceDropdownProps
 * @returns JSX element containing the workspace dropdown
 */
export const WorkspaceDropdown = ({ isCollapsed }: WorkspaceDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { id } = useParams();

  const { data: workspace, isLoading: workspaceLoading } = trpc.workspace.get.useQuery({
    id: id as string,
  }, {
    enabled: !!id,
  });

  const { data: filteredWorkspaces, isLoading: filteredWorkspacesLoading } = trpc.workspace.search.useQuery({
    query: searchTerm,
  }, {
    enabled: !!searchTerm,
  });

  return (
    <div className={cn("p-2", isCollapsed ? "flex items-center justify-center" : "")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed ? (
            <button
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              title={workspace?.title || 'Workspace'}
            >
              {workspaceLoading ? (
                <Skeleton className="w-5 h-5" />
              ) : (
                <span className="text-lg leading-none rounded-md w-8 h-8 flex items-center justify-center" style={{
                  backgroundColor: hexToRgba(workspace?.color || '#6366f1', 0.3),
                  color: workspace?.color,
                }}>
                  {workspace?.title?.charAt(0)}
                </span>
              )}
            </button>
          ) : (
            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors">
              {workspaceLoading ? (
                <Skeleton className="w-5 h-5" />
              ) : (
                <span className="text-lg leading-none rounded-md w-6 h-6 flex items-center justify-center" style={{
                  backgroundColor: hexToRgba(workspace?.color || '#6366f1', 0.3),
                  color: workspace?.color,
                }}>
                  {workspace?.title?.charAt(0)}
                </span>
              )}
              <div className="flex-1 text-left min-w-0">
                {workspaceLoading ? (
                  <Skeleton className="w-full h-4" />
                ) : (
                  <div className="font-medium text-sm truncate">{workspace?.title}</div>
                )}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            </button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredWorkspacesLoading && (
              <div className="flex flex-col gap-2 p-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-2 p-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-3" />
                  </div>
                ))}
              </div>
            )}
            {filteredWorkspaces?.length === 0 && !filteredWorkspacesLoading && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No workspaces found</p>
              </div>
            )}
            {filteredWorkspaces?.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => router.push(`/workspace/${id}/${workspace.id}`)}
                className="flex flex-col items-start p-2 m-1 cursor-pointer rounded-md"
              >
                <div className="font-medium text-sm">{workspace.title}</div>
                <div className="text-xs text-muted-foreground capitalize">{workspace.description}</div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
