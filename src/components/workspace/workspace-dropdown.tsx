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
    <div className={cn("px-3 py-3", isCollapsed ? "flex items-center justify-center px-2" : "")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed ? (
            <button
              className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
              title={workspace?.title || 'Workspace'}
            >
              {workspaceLoading ? (
                <Skeleton className="w-7 h-7 rounded-md" />
              ) : (
                <span className="text-xs font-bold rounded-md w-7 h-7 flex items-center justify-center" style={{
                  backgroundColor: hexToRgba(workspace?.color || '#6366f1', 0.12),
                  color: workspace?.color,
                }}>
                  {workspace?.title?.charAt(0).toUpperCase()}
                </span>
              )}
            </button>
          ) : (
            <button className="w-full flex items-center gap-3 hover:bg-accent rounded-md px-1.5 py-1 transition-colors text-left">
              {workspaceLoading ? (
                <Skeleton className="w-8 h-8 rounded-lg" />
              ) : (
                <span className="text-sm font-bold rounded-lg w-8 h-8 flex items-center justify-center shrink-0" style={{
                  backgroundColor: hexToRgba(workspace?.color || '#6366f1', 0.12),
                  color: workspace?.color,
                }}>
                  {workspace?.title?.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="flex-1 min-w-0">
                {workspaceLoading ? (
                  <Skeleton className="w-full h-4" />
                ) : (
                  <span className="font-semibold text-[13px] truncate block">{workspace?.title}</span>
                )}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="start" sideOffset={4}>
          <div className="p-1.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search workspaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredWorkspacesLoading && (
              <div className="flex flex-col gap-1 p-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-2">
                    <Skeleton className="w-6 h-6 rounded" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="w-3/4 h-3.5" />
                      <Skeleton className="w-1/2 h-2.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filteredWorkspaces?.length === 0 && !filteredWorkspacesLoading && (
              <div className="py-4 text-center">
                <p className="text-xs text-muted-foreground">No workspaces found</p>
              </div>
            )}
            {filteredWorkspaces?.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => router.push(`/workspace/${ws.id}`)}
                className="flex items-center gap-2.5 p-2 cursor-pointer rounded-md"
              >
                <span className="text-[10px] font-semibold rounded w-6 h-6 flex items-center justify-center shrink-0" style={{
                  backgroundColor: hexToRgba(ws.color || '#6366f1', 0.15),
                  color: ws.color || '#6366f1',
                }}>
                  {ws.title?.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{ws.title}</div>
                  {ws.description && (
                    <div className="text-xs text-muted-foreground truncate">{ws.description}</div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
