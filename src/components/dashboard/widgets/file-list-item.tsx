import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { iconToEmoji } from "@/lib/workspace-icons";
import { hexToRgba } from "@/lib/color";
import { FileItem } from "@/lib/storage/transformFileFolderInfo";

interface FileListItemProps extends FileItem {
  onClick: (id: string) => void;
  onDelete: (fileId: string) => void;
}

export function FileListItem({ id, name, color, onClick, onDelete }: FileListItemProps) {

  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors group"
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => onClick(id)}>
          <div className="flex items-center space-x-3">
          <span className="text-lg leading-none rounded-md w-8 h-8 flex items-center justify-center" style={{
                  backgroundColor: hexToRgba(color || '#6366f1', 0.3),
                  color: color || "#6366f1",
                }}>
                  {name?.charAt(0)}
                </span>
            <h3 className="font-medium text-sm hover:underline">{name}</h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

