"use client";

import { Clock, Calendar, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RouterOutputs } from "@goscribe/server";

type Episode = RouterOutputs['podcast']['getEpisode'];

/**
 * Props for the PodcastSidebar component
 */
interface PodcastSidebarProps {
  /** The podcast episode data */
  episode: Episode;
  /** Currently playing segment index */
  playingSegment: number | null;
  /** Callback when edit is clicked */
  onEdit?: () => void;
  /** Callback when delete is clicked */
  onDelete?: () => void;
}

/**
 * Podcast sidebar component with episode information and quick actions
 * 
 * Features:
 * - Episode description and metadata
 * - Duration, creation date, voice, and speed info
 * - Currently playing segment indicator
 * - Target audience and prerequisites
 * - Tags and key concepts
 * - Quick action buttons
 * 
 * @param props - PodcastSidebarProps
 * @returns JSX element containing the podcast sidebar
 */
export const PodcastSidebar = ({
  episode,
  playingSegment,
  onEdit,
  onDelete
}: PodcastSidebarProps) => {
  /**
   * Formats duration from seconds to MM:SS format
   */
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Podcast Info */}
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold">Information</h3>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {episode.description}
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Duration: {formatDuration(episode.metadata?.totalDuration || 0)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created: {new Date(episode.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Voice:</span>
              <span className="capitalize">{episode.metadata?.voice || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Speed:</span>
              <span>{episode.metadata?.speed || 1.0}x</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Segments:</span>
              <span>{episode.segments?.length || 0}</span>
            </div>
            {playingSegment !== null && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Currently Playing:</span>
                <Badge variant="secondary" className="text-xs">
                  Segment {playingSegment + 1}
                </Badge>
              </div>
            )}
          </div>

          {episode.metadata?.summary && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Target Audience</h4>
                <p className="text-sm text-muted-foreground">
                  {episode.metadata.summary.targetAudience}
                </p>
              </div>

              {episode.metadata.summary.prerequisites && episode.metadata.summary.prerequisites.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
                    <div className="space-y-1">
                      {episode.metadata.summary.prerequisites.map((prereq, i) => (
                        <div key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{prereq}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {episode.metadata.summary.tags && episode.metadata.summary.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {episode.metadata.summary.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
