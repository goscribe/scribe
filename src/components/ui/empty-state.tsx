import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  secondaryAction 
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-md">
        <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {description}
        </p>
        {(action || secondaryAction) && (
          <div className="flex items-center justify-center gap-2">
            {secondaryAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            {action && (
              <Button
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

