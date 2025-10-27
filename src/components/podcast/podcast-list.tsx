"use client";

import { RouterOutputs } from "@goscribe/server";
import { PodcastCard } from "./podcast-card";

type PodcastEpisode = RouterOutputs['podcast']['listEpisodes'][number];

/**
 * Props for the PodcastList component
 */
interface PodcastListProps {
  /** Array of podcast episodes to display */
  podcasts: PodcastEpisode[];
  /** Callback when a podcast card is clicked */
  onPodcastClick: (podcastId: string) => void;
  /** Callback when play button is clicked */
  onPlayClick: (e: React.MouseEvent, podcastId: string) => void;
  /** Format duration helper function */
  formatDuration: (seconds: number) => string;
  /** Starting index for podcasts to display (for pagination) */
  startIndex?: number;
}

/**
 * Podcast list component for displaying all episodes in a list format
 * 
 * Features:
 * - Vertical list layout with compact cards
 * - Episode metadata (duration, date, segments)
 * - Hover effects and play button overlays
 * - Responsive design
 * 
 * @param props - PodcastListProps
 * @returns JSX element containing the podcast list
 */
export const PodcastList = ({
  podcasts,
  onPodcastClick,
  onPlayClick,
  formatDuration,
  startIndex = 0
}: PodcastListProps) => {
  const displayPodcasts = podcasts.slice(startIndex);

  return (
    <div className="space-y-2">
      {displayPodcasts.map((podcast) => (
        <PodcastCard
          key={podcast.id}
          podcast={podcast}
          onClick={onPodcastClick}
          onPlayClick={onPlayClick}
          formatDuration={formatDuration}
          variant="list"
        />
      ))}
    </div>
  );
};
