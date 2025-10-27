"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { WORKSPACE_ICONS, iconToEmoji } from "@/lib/workspace-icons";

/**
 * Props for the WorkspaceIconPicker component
 */
interface WorkspaceIconPickerProps {
  /** Currently selected icon name */
  selectedIcon: string;
  /** Callback when icon is selected */
  onIconSelect: (icon: string) => void;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

/**
 * Workspace icon picker component
 * 
 * Features:
 * - Grid of emoji icons with labels
 * - Popover interface
 * - Current selection highlighting
 * - Search functionality (future enhancement)
 * 
 * @param props - WorkspaceIconPickerProps
 * @returns JSX element containing the icon picker
 */
export const WorkspaceIconPicker = ({
  selectedIcon,
  onIconSelect,
  disabled = false
}: WorkspaceIconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-12 p-0 text-2xl"
          disabled={disabled}
        >
          {iconToEmoji(selectedIcon)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Choose an icon</h4>
          <div className="grid grid-cols-5 gap-2">
            {WORKSPACE_ICONS.map(({ emoji, icon, label }) => (
              <Button
                key={icon}
                variant={selectedIcon === icon ? "default" : "ghost"}
                size="sm"
                className="h-12 w-12 p-0 text-2xl relative"
                onClick={() => {
                  onIconSelect(icon);
                  setIsOpen(false);
                }}
                title={label}
              >
                {emoji}
                {selectedIcon === icon && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
