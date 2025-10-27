import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderClosed, MoreHorizontal, Star } from "lucide-react";

interface ItemCardProps {
  id: string;
  name: string;
  type: "file" | "folder";
  icon?: string; // emoji for files, hex color for folders
  lastModified: string;
  isStarred?: boolean;
  isShared?: boolean;
  onClick: (id: string, type: "file" | "folder") => void;
}

export function ItemCard({ 
  id, 
  name, 
  type, 
  icon, 
  lastModified, 
  isStarred, 
  isShared,
  onClick 
}: ItemCardProps) {
  return (
    <Card
      className="card-hover cursor-pointer group"
      onClick={() => onClick(id, type)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="relative flex-shrink-0">
            {type === "folder" ? (
              <FolderClosed className="h-6 w-6" fill="currentColor" style={{ color: icon || "#6366f1" }} />
            ) : (
              <div className="text-2xl leading-none">
                {icon || '📄'}
              </div>
            )}
            {isStarred && (
              <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 mb-1">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lastModified}
            </p>
            {isShared && (
              <Badge variant="outline" className="text-xs mt-1">
                Shared
              </Badge>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              {type === "file" && <DropdownMenuItem>Star</DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

