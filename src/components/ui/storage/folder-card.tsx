import { Card, CardContent } from "@/components/ui/card";
import { FolderClosed } from "lucide-react";

interface FolderCardProps {
  id: string;
  name: string;
  color: string;
  lastModified: string;
  onClick: (id: string) => void;
}

export function FolderCard({ id, name, color, lastModified, onClick }: FolderCardProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <FolderClosed className="h-6 w-6" fill="currentColor" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-1 mb-1">{name}</h3>
            <p className="text-xs text-muted-foreground">{lastModified}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

