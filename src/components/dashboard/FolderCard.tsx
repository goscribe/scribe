"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Folder, MoreHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FolderCardProps {
  id: string;
  name: string;
  itemCount?: number;
  lastModified?: string;
  colorClass?: string; // e.g. "from-blue-500 to-blue-600"
  isStarred?: boolean;
  shared?: boolean;
  variant?: "grid" | "list";
  onClick?: (id: string) => void;
  onRename?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function FolderCard(props: FolderCardProps) {
  const {
    id,
    name,
    itemCount,
    lastModified,
    colorClass = "from-blue-500 to-blue-600",
    isStarred,
    shared,
    variant = "grid",
    onClick,
    onRename,
    onShare,
    onDelete,
  } = props;

  if (variant === "list") {
    return (
      <Card
        className="card-hover cursor-pointer"
        onClick={() => onClick?.(id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", colorClass)}>
                <Folder className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{name}</h3>
                <p className="text-sm text-muted-foreground">
                  {itemCount ?? 0} items{lastModified ? ` • ${lastModified}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {shared && (
                <Badge variant="outline" className="text-xs">
                  Shared
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onRename?.(id)}>Rename</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare?.(id)}>Share</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="card-hover cursor-pointer group"
      onClick={() => onClick?.(id)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className={cn("p-3 rounded-xl bg-gradient-to-r text-white", colorClass)}>
              <Folder className="h-8 w-8" />
            </div>
            {isStarred && (
              <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 -right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRename?.(id)}>Rename</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare?.(id)}>Share</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-1 w-full">
            <h3 className="font-medium text-sm line-clamp-2">{name}</h3>
            <p className="text-xs text-muted-foreground">{itemCount ?? 0} items</p>
            {lastModified && (
              <p className="text-xs text-muted-foreground">{lastModified}</p>
            )}
            {shared && (
              <Badge variant="outline" className="text-xs">Shared</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


