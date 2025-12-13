"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkspaceIconPicker } from "./workspace-icon-picker";
import { iconToEmoji, WORKSPACE_COLORS } from "@/lib/workspace-icons";

/**
 * Props for workspace settings
 */
interface WorkspaceSettings {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

/**
 * Props for the WorkspaceSettingsForm component
 */
interface WorkspaceSettingsFormProps {
  /** Initial workspace settings */
  initialSettings: WorkspaceSettings;
  /** Callback when settings are saved */
  onSave: (settings: WorkspaceSettings) => void;
  /** Whether the form is in a loading state */
  isLoading?: boolean;
}

/**
 * Workspace settings form component
 * 
 * Features:
 * - Name and description inputs
 * - Icon picker with emoji mapping
 * - Color picker (future enhancement)
 * - Form validation
 * - Save functionality
 * 
 * @param props - WorkspaceSettingsFormProps
 * @returns JSX element containing the settings form
 */
export const WorkspaceSettingsForm = ({
  initialSettings,
  onSave,
  isLoading = false
}: WorkspaceSettingsFormProps) => {
  const [settings, setSettings] = useState<WorkspaceSettings>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Update form when initial settings change
  useEffect(() => {
    setSettings(initialSettings);
    setHasChanges(false);
  }, [initialSettings]);

  /**
   * Handles input changes and tracks if there are unsaved changes
   */
  const handleInputChange = (field: keyof WorkspaceSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasChanges) {
      onSave(settings);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Icon Selection */}
        {/* <div className="space-y-3">
          <Label className="text-sm font-medium">Icon</Label>
          <div className="flex items-center gap-4">
            <WorkspaceIconPicker
              selectedIcon={settings.icon || 'file-text'}
              onIconSelect={(icon) => handleInputChange('icon', icon)}
              disabled={isLoading}
            />
            <div className="text-sm text-muted-foreground">
              Choose an icon to represent your workspace
            </div>
          </div>
        </div> */}

        {/* Name Input */}
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-medium">Name</Label>
          <Input
            id="name"
            placeholder="Enter workspace name"
            value={settings.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={isLoading}
            maxLength={100}
            className="text-base"
          />
          <div className="text-xs text-muted-foreground">
            {settings.name?.length || 0}/100 characters
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-3">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter workspace description"
            value={settings.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={isLoading}
            rows={3}
            maxLength={500}
            className="text-base resize-none"
          />
          <div className="text-xs text-muted-foreground">
            {settings.description?.length || 0}/500 characters
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Color</Label>
          <div className="flex items-center gap-2 flex-wrap">
            {WORKSPACE_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleInputChange('color', color.value)}
                disabled={isLoading}
                className={`
                  w-8 h-8 rounded-md border-2 transition-all duration-200
                  ${settings.color === color.value 
                    ? 'border-foreground scale-110 shadow-md' 
                    : 'border-border hover:scale-105 hover:shadow-sm'
                  }
                `}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            Choose a color theme for your workspace
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-start pt-4">
          <Button
            type="submit"
            disabled={!hasChanges || isLoading}
            className="min-w-24"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
