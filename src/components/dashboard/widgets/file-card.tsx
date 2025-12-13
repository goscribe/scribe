import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { FileItem } from "@/lib/storage/transformFileFolderInfo";
import { hexToRgba } from "@/lib/color";

interface FileCardProps extends FileItem {
  onClick: (id: string) => void;
  onDelete: (fileId: string) => void;
}

export function FileCard({ id, name, color, lastModified, onClick, onDelete }: FileCardProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors group"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between cursor-pointer" onClick={() => onClick(id)}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
            <span className="text-lg leading-none rounded-md w-8 h-8 flex items-center justify-center" style={{
                  backgroundColor: hexToRgba(color || '#6366f1', 0.3),
                  color: color || "#6366f1",
                }}>
                  {name?.charAt(0)}
                </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:underline">{name}</h3>
              <p className="text-xs text-muted-foreground">{lastModified}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 flex-shrink-0"
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

