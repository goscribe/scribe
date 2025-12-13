"use client";

import { useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface BreadcrumbPathItem {
  id: string;
  name: string;
  color?: string;
}

interface StorageBreadcrumbProps {
  items: BreadcrumbPathItem[];
  onNavigate?: (folderId: string) => void;
}

/**
 * Breadcrumb component for storage navigation
 * 
 * Features:
 * - Shows folder hierarchy path
 * - Clickable navigation to parent folders
 * - Visual separator between items
 * 
 * @param props - StorageBreadcrumbProps
 * @returns JSX element containing the breadcrumb navigation
 */
export function StorageBreadcrumb({ items, onNavigate }: StorageBreadcrumbProps) {
  const router = useRouter();

  const handleClick = (folderId: string, isLast: boolean) => {
    if (isLast) return; // Don't navigate if it's the current folder
    
    if (onNavigate) {
      onNavigate(folderId);
    } else {
      router.push(`/storage/workspaces/${folderId}`);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Root/Storage link */}
        <BreadcrumbItem>
          <BreadcrumbLink 
            href="/storage" 
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.preventDefault();
              router.push("/storage");
            }}
          >
            Storage
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Folder hierarchy */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <div key={item.id} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-sm font-medium">
                    {item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={`/storage/workspaces/${item.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(item.id, false);
                    }}
                  >
                    {item.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

