import { Card, CardContent } from "@/components/ui/card";
import { iconToEmoji } from "@/lib/workspace-icons";

interface FileCardProps {
  id: string;
  name: string;
  icon?: string;
  lastModified: string;
  onClick: (id: string) => void;
}

export function FileCard({ id, name, icon, lastModified, onClick }: FileCardProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="text-2xl leading-none">
              {icon ? iconToEmoji(icon) : '📄'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 mb-1">{name}</h3>
            <p className="text-xs text-muted-foreground">{lastModified}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

