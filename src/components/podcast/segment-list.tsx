"use client";

import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouterOutputs } from "@goscribe/server";

type Segment = RouterOutputs['podcast']['getEpisode']['segments'][number];

/**
 * Props for the SegmentList component
 */
interface SegmentListProps {
  /** Array of segments */
  segments: Segment[];
  /** Currently playing segment index */
  playingSegment: number | null;
  /** Callback when segment play/pause is clicked */
  onSegmentPlayPause: (index: number) => void;
  /** Callback when segment is edited */
  onEditSegment: (segment: Segment) => void;
  /** Callback when segment is regenerated */
  onRegenerateSegment: (segment: Segment) => void;
  /** Callback when segment is downloaded */
  onDownloadSegment: (segment: Segment) => void;
  /** Callback when segment is deleted */
  onDeleteSegment: (segment: Segment) => void;
  /** Whether any action is in progress */
  isProcessing?: boolean;
}

/**
 * Segment list component for displaying podcast segments
 * 
 * Features:
 * - List of segments with play/pause controls
 * - Segment actions (edit, regenerate, download, delete)
 * - Playing state indicators
 * - Key points display
 * - Responsive design
 * 
 * @param props - SegmentListProps
 * @returns JSX element containing the segment list
 */
export const SegmentList = ({
  segments,
  playingSegment,
  onSegmentPlayPause,
  onEditSegment,
  onRegenerateSegment,
  onDownloadSegment,
  onDeleteSegment,
  isProcessing = false
}: SegmentListProps) => {
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Segments</h2>
          <Badge variant="secondary">
            {segments.length} segments
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {segments.length > 0 ? (
          <div className="space-y-3">
            {segments.map((segment, index) => (
              <div
                key={segment.id}
                className={`p-3 rounded-lg border transition-all ${
                  playingSegment === index
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                      <Button
                        onClick={() => onSegmentPlayPause(index)}
                        size="sm"
                        variant={playingSegment === index ? "default" : "outline"}
                        className="h-8 w-8 p-0"
                      >
                        {playingSegment === index ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-medium">{segment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Duration: {formatDuration(segment.duration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {playingSegment === index && (
                      <Badge variant="secondary" className="animate-pulse">
                        Playing
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {segment.content}
                </div>
                
                {segment.keyPoints && segment.keyPoints.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Key Points:</p>
                    <div className="flex flex-wrap gap-1">
                      {segment.keyPoints.slice(0, 3).map((point, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {point}
                        </Badge>
                      ))}
                      {segment.keyPoints.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{segment.keyPoints.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No segments available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
