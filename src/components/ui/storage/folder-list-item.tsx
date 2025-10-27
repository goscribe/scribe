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

interface FolderListItemProps {
  id: string;
  name: string;
  color: string;
  onClick: (id: string) => void;
  onRename?: (id: string, name: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export function FolderListItem({ id, name, color, onClick, onRename, onDelete }: FolderListItemProps) {
  return (
    <Card
      className="linear-list-item cursor-pointer group"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <FolderClosed className="h-5 w-5" fill="currentColor" style={{ color }} />
            </div>
            <div>
              <h3 className="font-medium text-sm">{name}</h3>
            </div>
          </div>
          
          {(onRename || onDelete) && (
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

