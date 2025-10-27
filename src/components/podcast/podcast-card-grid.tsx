"use client";

import { RouterOutputs } from "@goscribe/server";
import { PodcastCard } from "./podcast-card";

type PodcastEpisode = RouterOutputs['podcast']['listEpisodes'][number];

/**
 * Props for the PodcastCardGrid component
 */
interface PodcastCardGridProps {
  /** Array of podcast episodes to display */
  podcasts: PodcastEpisode[];
  /** Callback when a podcast card is clicked */
  onPodcastClick: (podcastId: string) => void;
  /** Callback when play button is clicked */
  onPlayClick: (e: React.MouseEvent, podcastId: string) => void;
  /** Format duration helper function */
  formatDuration: (seconds: number) => string;
  /** Maximum number of podcasts to display (default: 4) */
  maxItems?: number;
}

/**
 * Podcast card grid component for displaying featured/recent podcasts
 * 
 * Features:
 * - Responsive grid layout (1-4 columns based on screen size)
 * - Album art placeholders with gradients
 * - Hover effects and play button overlays
 * - Episode metadata display
 * 
 * @param props - PodcastCardGridProps
 * @returns JSX element containing the podcast grid
 */
export const PodcastCardGrid = ({
  podcasts,
  onPodcastClick,
  onPlayClick,
  formatDuration,
  maxItems = 4
}: PodcastCardGridProps) => {
  const displayPodcasts = podcasts.slice(0, maxItems);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {displayPodcasts.map((podcast) => (
        <PodcastCard
          key={podcast.id}
          podcast={podcast}
          onClick={onPodcastClick}
          onPlayClick={onPlayClick}
          formatDuration={formatDuration}
          variant="grid"
        />
      ))}
    </div>
  );
};
