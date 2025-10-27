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

interface ItemListItemProps {
  id: string;
  name: string;
  type: "file" | "folder";
  icon?: string; // emoji for files, hex color for folders
  isStarred?: boolean;
  isShared?: boolean;
  onClick: (id: string, type: "file" | "folder") => void;
}

export function ItemListItem({ 
  id, 
  name, 
  type, 
  icon, 
  isStarred, 
  isShared,
  onClick 
}: ItemListItemProps) {
  return (
    <Card
      className="linear-list-item cursor-pointer group"
      onClick={() => onClick(id, type)}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {type === "folder" ? (
                <FolderClosed className="h-5 w-5" fill="currentColor" style={{ color: icon || "#6366f1" }} />
              ) : (
                <div className="text-lg leading-none">
                  {icon || '📄'}
                </div>
              )}
              {isStarred && (
                <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm">{name}</h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isShared && (
              <Badge variant="outline" className="text-xs">
                Shared
              </Badge>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
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
        </div>
      </CardContent>
    </Card>
  );
}

