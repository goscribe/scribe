import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderClosed, MoreHorizontal } from "lucide-react";

interface FolderCardProps {
  id: string;
  name: string;
  color: string;
  lastModified: string;
  onClick: (id: string) => void;
  onRename?: (id: string, name: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export function FolderCard({ id, name, color, lastModified, onClick, onRename, onDelete }: FolderCardProps) {
  return (
    <Card
      className="card-hover cursor-pointer group"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <FolderClosed className="h-6 w-6" fill="currentColor" style={{ color }} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-1 mb-1">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lastModified}
            </p>
          </div>
          
          {(onRename || onDelete) && (
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
                {onRename && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onRename(id, name);
                  }}>
                    Rename
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id, name);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

