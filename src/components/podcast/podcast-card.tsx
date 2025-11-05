"use client";

import { Play, Music, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RouterOutputs } from "@goscribe/server";

type PodcastEpisode = RouterOutputs['podcast']['listEpisodes'][number];

/**
 * Props for the PodcastCard component
 */
interface PodcastCardProps {
  /** Podcast episode data */
  podcast: PodcastEpisode;
  /** Callback when card is clicked */
  onClick: (podcastId: string) => void;
  /** Callback when play button is clicked */
  onPlayClick: (e: React.MouseEvent, podcastId: string) => void;
  /** Format duration helper function */
  formatDuration: (seconds: number) => string;
  /** Card variant - 'grid' for featured view, 'list' for episodes list */
  variant?: 'grid' | 'list';
}

/**
 * Podcast card component for displaying individual podcast episodes
 * 
 * Features:
 * - Album art placeholder with gradient background
 * - Play button overlay on hover
 * - Episode metadata (duration, status)
 * - Responsive design for grid and list views
 * 
 * @param props - PodcastCardProps
 * @returns JSX element containing the podcast card
 */
export const PodcastCard = ({
  podcast,
  onClick,
  onPlayClick,
  formatDuration,
  variant = 'grid'
}: PodcastCardProps) => {
  if (variant === 'list') {
    return (
      <Card 
        className="group cursor-pointer border border-border/50 hover:shadow-sm transition-all"
        onClick={() => onClick(podcast.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Small album art */}
            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-lg overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                {podcast.generating ? (
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                ) : (
                  <Music className="w-4 h-4 text-muted-foreground/60" />
                )}
              </div>
              {/* Play button overlay - only show if not generating */}
              {!podcast.generating && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button 
                    size="sm" 
                    className="rounded-full w-6 h-6 bg-white/90 hover:bg-white text-black p-0"
                    onClick={(e) => onPlayClick(e, podcast.id)}
                  >
                    <Play className="w-3 h-3 ml-0.5" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Episode info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {podcast.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {podcast.generating && podcast.generatingMetadata && typeof podcast.generatingMetadata === 'object' && 'message' in podcast.generatingMetadata 
                      ? (podcast.generatingMetadata as { message: string }).message 
                      : podcast.description || 'AI-generated podcast episode'}
                  </p>
                </div>
                {podcast.generating ? (
                  <Badge variant="outline" className="text-[10px] bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 flex-shrink-0 flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    Generating
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 flex-shrink-0">
                    Ready
                  </Badge>
                )}
              </div>
              
              {/* Metadata */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70 mt-1">
                <span>{podcast.metadata ? formatDuration(podcast.metadata.totalDuration) : 'Unknown'}</span>
                <span>•</span>
                <span>{formatDate(podcast.createdAt.toISOString())}</span>
                {podcast.segments && (
                  <>
                    <span>•</span>
                    <span>{podcast.segments.length} segments</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card 
      className="group cursor-pointer border border-border/50 hover:shadow-md transition-all duration-200 h-[300px] flex flex-col"
      onClick={() => onClick(podcast.id)}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Album Art Placeholder */}
        <div className="relative h-[160px] shrink-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-t-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              {podcast.generating ? (
                <Loader2 className="w-6 h-6 text-muted-foreground/60 animate-spin" />
              ) : (
                <Music className="w-6 h-6 text-muted-foreground/60" />
              )}
            </div>
          </div>
          {/* Play button overlay - only show if not generating */}
          {!podcast.generating && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button 
                size="lg" 
                className="rounded-full w-10 h-10 bg-white/90 hover:bg-white text-black shadow-md"
                onClick={(e) => onPlayClick(e, podcast.id)}
              >
                <Play className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {podcast.title}
          </h3>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
            {podcast.generating && podcast.generatingMetadata && typeof podcast.generatingMetadata === 'object' && 'message' in podcast.generatingMetadata 
              ? (podcast.generatingMetadata as { message: string }).message 
              : podcast.description || 'AI-generated podcast episode'}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2">
            <span>
              {podcast.generating 
                ? '' 
                : podcast.metadata 
                  ? formatDuration(podcast.metadata.totalDuration) 
                  : ''}
            </span>
            {podcast.generating ? (
              <Badge variant="outline" className="text-[10px] bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 flex items-center gap-1">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Generating
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                Ready
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Helper function to format dates
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};
