import { Card, CardContent } from "@/components/ui/card";
import { FolderClosed } from "lucide-react";

interface FolderListItemProps {
  id: string;
  name: string;
  color: string;
  onClick: (id: string) => void;
}

export function FolderListItem({ id, name, color, onClick }: FolderListItemProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <FolderClosed className="h-5 w-5" fill="currentColor" style={{ color }} />
          <h3 className="font-medium text-sm">{name}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

