import { Card, CardContent } from "@/components/ui/card";
import { iconToEmoji } from "@/lib/workspace-icons";

interface FileListItemProps {
  id: string;
  name: string;
  icon?: string;
  onClick: (id: string) => void;
}

export function FileListItem({ id, name, icon, onClick }: FileListItemProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className="text-lg leading-none">
            {icon ? iconToEmoji(icon) : '📄'}
          </div>
          <h3 className="font-medium text-sm">{name}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

