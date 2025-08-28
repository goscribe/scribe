"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Loader2,
  List,
  Disc
} from "lucide-react";

export interface PodcastSegment {
  id: string;
  title: string;
  audioUrl?: string;
  objectKey?: string;
  startTime: number;
  duration: number;
  order: number;
}

export interface PodcastPlayerProps {
  segments: PodcastSegment[];
  totalDuration: number;
  fullEpisodeUrl?: string; // New: URL for the complete joined episode
  onSegmentChange?: (segmentId: string) => void;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function PodcastPlayer({
  segments,
  totalDuration,
  fullEpisodeUrl,
  onSegmentChange,
  onPlayPause,
  onSeek,
  isLoading = false,
  className = ""
}: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [useFullEpisode, setUseFullEpisode] = useState(false); // New: toggle between segments and full episode
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
    onPlayPause?.();
  };

  const handleSeek = (newTime: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    onSeek?.(newTime);
    
    if (!useFullEpisode) {
      // Find current segment when using individual segments
      const segmentIndex = segments.findIndex(segment => {
        const segmentEnd = segment.startTime + segment.duration;
        return newTime >= segment.startTime && newTime < segmentEnd;
      });
      
      if (segmentIndex !== -1 && segmentIndex !== currentSegment) {
        setCurrentSegment(segmentIndex);
        onSegmentChange?.(segments[segmentIndex].id);
      }
    }
  };

  const handleProgressChange = (progress: number) => {
    const newTime = (progress / 100) * totalDuration;
    handleSeek(newTime);
  };

  const handleSegmentClick = (segmentIndex: number) => {
    if (useFullEpisode) {
      // When using full episode, seek to segment start time
      const segment = segments[segmentIndex];
      handleSeek(segment.startTime);
    } else {
      // When using individual segments, switch to that segment
      const segment = segments[segmentIndex];
      setCurrentSegment(segmentIndex);
      onSegmentChange?.(segment.id);
      
      // Update audio source if needed
      if (audioRef.current && segment.audioUrl) {
        const wasPlaying = isPlaying;
        audioRef.current.src = segment.audioUrl;
        audioRef.current.currentTime = 0;
        
        if (wasPlaying) {
          audioRef.current.play();
        }
      }
    }
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 10);
    handleSeek(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(totalDuration, currentTime + 30);
    handleSeek(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const togglePlaybackMode = () => {
    const newMode = !useFullEpisode;
    setUseFullEpisode(newMode);
    
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      const currentTime = audioRef.current.currentTime;
      
      if (newMode && fullEpisodeUrl) {
        // Switch to full episode
        audioRef.current.src = fullEpisodeUrl;
        audioRef.current.currentTime = currentTime;
      } else if (!newMode && segments.length > 0) {
        // Switch to individual segments
        const currentSegment = segments.find(segment => {
          const segmentEnd = segment.startTime + segment.duration;
          return currentTime >= segment.startTime && currentTime < segmentEnd;
        }) || segments[0];
        
        if (currentSegment.audioUrl) {
          audioRef.current.src = currentSegment.audioUrl;
          audioRef.current.currentTime = currentTime - currentSegment.startTime;
        }
      }
      
      if (wasPlaying) {
        audioRef.current.play();
      }
    }
  };

  // Initialize audio element when segments change or mode changes
  useEffect(() => {
    if (useFullEpisode && fullEpisodeUrl) {
      setIsLoadingAudio(true);
      const audio = new Audio(fullEpisodeUrl);
      
      audio.addEventListener('loadedmetadata', () => {
        setIsLoadingAudio(false);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
        
        // Update current segment based on time
        const segmentIndex = segments.findIndex(segment => {
          const segmentEnd = segment.startTime + segment.duration;
          return audio.currentTime >= segment.startTime && audio.currentTime < segmentEnd;
        });
        
        if (segmentIndex !== -1 && segmentIndex !== currentSegment) {
          setCurrentSegment(segmentIndex);
          onSegmentChange?.(segments[segmentIndex].id);
        }
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audio.addEventListener('error', () => {
        setIsLoadingAudio(false);
        console.error('Audio loading error');
      });
      
      audioRef.current = audio;
      
      return () => {
        audio.pause();
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('error', () => {});
      };
    } else if (!useFullEpisode && segments.length > 0 && segments[0].audioUrl) {
      setIsLoadingAudio(true);
      const audio = new Audio(segments[0].audioUrl);
      
      audio.addEventListener('loadedmetadata', () => {
        setIsLoadingAudio(false);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
        
        // Update current segment
        const segmentIndex = segments.findIndex(segment => {
          const segmentEnd = segment.startTime + segment.duration;
          return audio.currentTime >= segment.startTime && audio.currentTime < segmentEnd;
        });
        
        if (segmentIndex !== -1 && segmentIndex !== currentSegment) {
          setCurrentSegment(segmentIndex);
          onSegmentChange?.(segments[segmentIndex].id);
        }
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audio.addEventListener('error', () => {
        setIsLoadingAudio(false);
        console.error('Audio loading error');
      });
      
      audioRef.current = audio;
      
      return () => {
        audio.pause();
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('error', () => {});
      };
    }
  }, [segments, useFullEpisode, fullEpisodeUrl]);

  // Update audio source when current segment changes (only for individual segments mode)
  useEffect(() => {
    if (!useFullEpisode && audioRef.current && segments[currentSegment]?.audioUrl) {
      const wasPlaying = isPlaying;
      audioRef.current.src = segments[currentSegment].audioUrl;
      audioRef.current.currentTime = 0;
      
      if (wasPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSegment, segments, useFullEpisode]);

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading podcast player...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Audio Player</span>
          <div className="flex items-center gap-2">
            {fullEpisodeUrl && (
              <div className="flex items-center gap-2">
                <Label htmlFor="playback-mode" className="text-xs">
                  {useFullEpisode ? 'Full Episode' : 'Segments'}
                </Label>
                <Switch
                  id="playback-mode"
                  checked={useFullEpisode}
                  onCheckedChange={togglePlaybackMode}
                  disabled={isLoadingAudio}
                />
              </div>
            )}
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Ready
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 cursor-pointer"
            onValueChange={handleProgressChange}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSkipBack}
              size="sm"
              variant="outline"
              disabled={isLoadingAudio}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
              disabled={isLoadingAudio || segments.length === 0}
            >
              {isLoadingAudio ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              onClick={handleSkipForward}
              size="sm"
              variant="outline"
              disabled={isLoadingAudio}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleMute}
              size="sm"
              variant="outline"
              disabled={isLoadingAudio}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-20"
              disabled={isLoadingAudio}
            />
          </div>
        </div>

        {/* Segments */}
        {segments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {useFullEpisode ? (
                <Disc className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
              <h4 className="text-sm font-medium">
                {useFullEpisode ? 'Full Episode' : 'Segments'}
              </h4>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {segments.map((segment, index) => (
                <div
                  key={segment.id}
                  className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                    index === currentSegment
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => handleSegmentClick(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{segment.title}</span>
                    <span className="text-muted-foreground">
                      {formatTime(segment.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
