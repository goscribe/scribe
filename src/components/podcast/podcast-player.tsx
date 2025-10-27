"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Props for the PodcastPlayer component
 */
interface PodcastPlayerProps {
  /** Podcast title */
  title: string;
  /** Podcast description */
  description?: string;
  /** Total duration in seconds */
  duration: number;
  /** Playback speed */
  speed: number;
  /** Voice type */
  voice: string;
  /** Callback when play button is clicked */
  onPlay: () => void;
}

/**
 * Podcast player component with controls and metadata
 * 
 * Features:
 * - Album art placeholder with play icon
 * - Episode title and description
 * - Progress bar (static for now)
 * - Play button
 * - Speed and voice information
 * 
 * @param props - PodcastPlayerProps
 * @returns JSX element containing the podcast player
 */
export const PodcastPlayer = ({
  title,
  description,
  duration,
  speed,
  voice,
  onPlay
}: PodcastPlayerProps) => {
  /**
   * Formats duration from seconds to MM:SS format
   */
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Album Art Placeholder */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-lg overflow-hidden flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-4 h-4 text-white/80" />
              </div>
            </div>
          </div>
          
          {/* Player Controls */}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-base font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {description || 'AI-generated podcast episode'}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0:00</span>
                <span>{formatDuration(duration)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="rounded-full w-10 h-10"
                onClick={onPlay}
              >
                <Play className="w-4 h-4 ml-0.5" />
              </Button>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Speed: {speed}x</span>
                <span>Voice: {voice}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
