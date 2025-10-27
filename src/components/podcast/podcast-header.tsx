"use client";

import { Bookmark, BookmarkPlus, Share2, RefreshCw, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

/**
 * Props for the PodcastHeader component
 */
interface PodcastHeaderProps {
  /** Podcast title */
  title: string;
  /** Whether the podcast is bookmarked */
  isBookmarked: boolean;
  /** Callback when bookmark status changes */
  onToggleBookmark: () => void;
  /** Callback when refresh is clicked */
  onRefresh: () => void;
  /** Callback when rename is clicked */
  onRename: () => void;
  /** Callback when delete is clicked */
  onDelete: () => void;
}

/**
 * Podcast header component with title and action buttons
 * 
 * Features:
 * - Podcast title and description
 * - Bookmark toggle
 * - Share, refresh, rename, and delete actions
 * - Consistent styling with app design system
 * 
 * @param props - PodcastHeaderProps
 * @returns JSX element containing the podcast header
 */
export const PodcastHeader = ({
  title,
  isBookmarked,
  onToggleBookmark,
  onRefresh,
  onRename,
  onDelete
}: PodcastHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          AI-generated podcast episode
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onToggleBookmark}
          variant="ghost"
          size="sm"
        >
          {isBookmarked ? (
            <Bookmark className="h-4 w-4" />
          ) : (
            <BookmarkPlus className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button 
          onClick={onRefresh}
          variant="ghost" 
          size="sm"
          title="Refresh episode data"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onRename}
          title="Rename podcast"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Podcast</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
