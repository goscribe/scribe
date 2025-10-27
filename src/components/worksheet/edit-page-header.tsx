"use client";

import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/**
 * Props for the EditPageHeader component
 */
interface EditPageHeaderProps {
  /** Whether the form is currently saving */
  isSaving: boolean;
  /** Callback when save button is clicked */
  onSave: () => void;
  /** Callback when back button is clicked */
  onBack: () => void;
}

/**
 * Edit page header component with navigation and save actions
 * 
 * Features:
 * - Back navigation button
 * - Save button with loading state
 * - Consistent styling with other pages
 * 
 * @param props - EditPageHeaderProps
 * @returns JSX element containing the edit page header
 */
export const EditPageHeader = ({
  isSaving,
  onSave,
  onBack
}: EditPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="h-8 -ml-2"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
        Back
      </Button>
      
      <Button
        onClick={onSave}
        disabled={isSaving}
        className="h-8"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
};
