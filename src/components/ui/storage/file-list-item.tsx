import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star } from "lucide-react";

interface FileListItemProps {
  id: string;
  name: string;
  icon?: string;
  isStarred?: boolean;
  onClick: (id: string) => void;
}

export function FileListItem({ id, name, icon, isStarred, onClick }: FileListItemProps) {
  return (
    <Card
      className="linear-list-item cursor-pointer group"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="text-lg leading-none">
                {icon || '📄'}
              </div>
              {isStarred && (
                <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm">{name}</h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
                <DropdownMenuItem>Star</DropdownMenuItem>
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

