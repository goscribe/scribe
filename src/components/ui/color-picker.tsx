"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Check } from "lucide-react";

interface ColorPickerProps {
  /** Current color value */
  value?: string;
  /** Callback when color changes */
  onChange?: (color: string) => void;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Trigger button variant */
  variant?: "default" | "outline" | "ghost" | "secondary";
  /** Trigger button size */
  size?: "default" | "sm" | "lg" | "icon";
  /** Show color name/label */
  showLabel?: boolean;
}

// Predefined color palette
const PRESET_COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Green", value: "#22c55e" },
  { name: "Lime", value: "#84cc16" },
  { name: "Yellow", value: "#eab308" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Pink", value: "#ec4899" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Purple", value: "#a855f7" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Slate", value: "#64748b" },
  { name: "Gray", value: "#6b7280" },
  { name: "Zinc", value: "#71717a" },
  { name: "Neutral", value: "#737373" },
];

// Additional custom colors
const CUSTOM_COLORS = [
  "#dc2626", // red-600
  "#ea580c", // orange-600
  "#ca8a04", // yellow-600
  "#16a34a", // green-600
  "#0891b2", // cyan-600
  "#2563eb", // blue-600
  "#7c3aed", // violet-600
  "#c026d3", // fuchsia-600
  "#db2777", // pink-600
  "#475569", // slate-600
];

export function ColorPicker({
  value = "#6366f1",
  onChange,
  disabled = false,
  className,
  variant = "outline",
  size = "default",
  showLabel = false,
}: ColorPickerProps) {
  const [customColor, setCustomColor] = React.useState(value);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleColorSelect = (color: string) => {
    setCustomColor(color);
    onChange?.(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange?.(color);
  };

  const getColorName = (color: string) => {
    const preset = PRESET_COLORS.find(c => c.value.toLowerCase() === color.toLowerCase());
    return preset?.name || color;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
          disabled={disabled}
        >
          <div
            className="h-4 w-4 rounded-sm border border-border"
            style={{ backgroundColor: value }}
          />
          {showLabel && <span>{getColorName(value)}</span>}
          {!showLabel && <Palette className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="space-y-3">
          {/* Preset Colors */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Preset Colors</Label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "h-8 w-full rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    value === color.value ? "border-foreground" : "border-transparent"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorSelect(color.value)}
                  title={color.name}
                  disabled={disabled}
                >
                  {value === color.value && (
                    <Check className="h-4 w-4 text-white mx-auto drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Custom Colors</Label>
            <div className="grid grid-cols-5 gap-2">
              {CUSTOM_COLORS.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "h-8 w-full rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    value === color ? "border-foreground" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  disabled={disabled}
                >
                  {value === color && (
                    <Check className="h-4 w-4 text-white mx-auto drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Input */}
          <div className="space-y-2">
            <Label htmlFor="custom-color" className="text-xs font-medium">
              Custom Hex Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="custom-color"
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="h-9 w-20 p-1 cursor-pointer"
                disabled={disabled}
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => {
                  const color = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(color) || color === "") {
                    handleCustomColorChange(e);
                  }
                }}
                placeholder="#000000"
                className="flex-1 h-9"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Current Color Display */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2">
            <span className="text-xs font-medium">Current</span>
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-md border border-border"
                style={{ backgroundColor: value }}
              />
              <span className="text-xs font-mono">{value}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Simple color swatch component for displaying a color
 */
export function ColorSwatch({ 
  color, 
  size = "md",
  className 
}: { 
  color: string; 
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div
      className={cn(
        "rounded-md border border-border shadow-sm",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
    />
  );
}
