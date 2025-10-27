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

interface FileCardProps {
  id: string;
  name: string;
  icon?: string;
  lastModified: string;
  isStarred?: boolean;
  onClick: (id: string) => void;
}

export function FileCard({ id, name, icon, lastModified, isStarred, onClick }: FileCardProps) {
  return (
    <Card
      className="card-hover cursor-pointer group"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="relative flex-shrink-0">
            <div className="text-2xl leading-none">
              {icon || '📄'}
            </div>
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
              <DropdownMenuItem>Star</DropdownMenuItem>
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

