"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  audioUrl: string;
  objectKey: string;
  startTime: number;
  duration: number;
  order: number;
}

export interface VirtualPodcastPlayerProps {
  segments: PodcastSegment[];
  totalDuration: number;
  onSegmentChange?: (segmentId: string) => void;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  onPlayFullEpisode?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function VirtualPodcastPlayer({
  segments,
  totalDuration,
  onSegmentChange,
  onPlayPause,
  onSeek,
  onPlayFullEpisode,
  isLoading = false,
  className = ""
}: VirtualPodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playbackMode, setPlaybackMode] = useState<'segments' | 'full'>('segments');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const segmentQueueRef = useRef<PodcastSegment[]>([]);
  const isPlayingFullEpisodeRef = useRef(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (playbackMode === 'full') {
      if (isPlayingFullEpisodeRef.current) {
        stopFullEpisode();
      } else {
        playFullEpisode();
      }
    } else {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
        onPlayPause?.();
      }
    }
  };

  const handleSeek = (newTime: number) => {
    if (playbackMode === 'full') {
      seekInFullEpisode(newTime);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        onSeek?.(newTime);
        
        // Find current segment
        const segmentIndex = segments.findIndex(segment => {
          const segmentEnd = segment.startTime + segment.duration;
          return newTime >= segment.startTime && newTime < segmentEnd;
        });
        
        if (segmentIndex !== -1 && segmentIndex !== currentSegment) {
          setCurrentSegment(segmentIndex);
          onSegmentChange?.(segments[segmentIndex].id);
        }
      }
    }
  };

  const handleProgressChange = (progress: number) => {
    const newTime = (progress / 100) * totalDuration;
    handleSeek(newTime);
  };

  const handleSegmentClick = (segmentIndex: number) => {
    if (playbackMode === 'full') {
      // When using full episode mode, seek to segment start time
      const segment = segments[segmentIndex];
      seekInFullEpisode(segment.startTime);
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
    const newMode = playbackMode === 'segments' ? 'full' : 'segments';
    setPlaybackMode(newMode);
    
    if (newMode === 'segments') {
      stopFullEpisode();
      // Switch to individual segment mode
      if (segments.length > 0) {
        const segment = segments[currentSegment];
        if (audioRef.current && segment.audioUrl) {
          audioRef.current.src = segment.audioUrl;
          audioRef.current.currentTime = 0;
        }
      }
    } else {
      // Switch to full episode mode
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Virtual joining implementation
  const playFullEpisode = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    isPlayingFullEpisodeRef.current = true;
    setIsPlaying(true);
    onPlayPause?.();

    const sortedSegments = [...segments].sort((a, b) => a.order - b.order);
    segmentQueueRef.current = sortedSegments;

    for (let i = 0; i < sortedSegments.length; i++) {
      if (!isPlayingFullEpisodeRef.current) break;

      const segment = sortedSegments[i];
      setCurrentSegment(i);
      onSegmentChange?.(segment.id);

      try {
        await playSegment(segment);
      } catch (error) {
        console.error('Error playing segment:', error);
        break;
      }
    }

    if (isPlayingFullEpisodeRef.current) {
      setIsPlaying(false);
      onPlayPause?.();
    }
  };

  const playSegment = async (segment: PodcastSegment): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!audioContextRef.current) {
        reject(new Error('Audio context not initialized'));
        return;
      }

      fetch(segment.audioUrl)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContextRef.current!.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          if (!isPlayingFullEpisodeRef.current) {
            resolve();
            return;
          }

          const source = audioContextRef.current!.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current!.destination);
          
          currentSourceRef.current = source;

          // Update current time during playback
          const startTime = audioContextRef.current!.currentTime;
          const updateTime = () => {
            if (isPlayingFullEpisodeRef.current) {
              const elapsed = audioContextRef.current!.currentTime - startTime;
              const totalElapsed = segment.startTime + elapsed;
              setCurrentTime(totalElapsed);
              
              if (elapsed < audioBuffer.duration) {
                requestAnimationFrame(updateTime);
              }
            }
          };
          updateTime();

          source.onended = () => {
            resolve();
          };

          source.start();
        })
        .catch(reject);
    });
  };

  const stopFullEpisode = () => {
    isPlayingFullEpisodeRef.current = false;
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
    }
    setIsPlaying(false);
    onPlayPause?.();
  };

  const seekInFullEpisode = (timeInSeconds: number) => {
    if (!isPlayingFullEpisodeRef.current) return;

    // Stop current playback
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
    }

    // Find which segment contains this time
    let accumulatedTime = 0;
    for (let i = 0; i < segments.length; i++) {
      if (accumulatedTime + segments[i].duration >= timeInSeconds) {
        const segmentTime = timeInSeconds - accumulatedTime;
        setCurrentSegment(i);
        onSegmentChange?.(segments[i].id);
        setCurrentTime(timeInSeconds);
        onSeek?.(timeInSeconds);
        
        // Continue playing from this point
        playSegmentFromTime(segments[i], segmentTime);
        break;
      }
      accumulatedTime += segments[i].duration;
    }
  };

  const playSegmentFromTime = async (segment: PodcastSegment, startTime: number) => {
    // Implementation for playing segment from specific time
    // This would require more complex audio buffer manipulation
    console.log('Playing segment from time:', startTime);
  };

  // Initialize audio element when segments change or mode changes
  useEffect(() => {
    if (playbackMode === 'segments' && segments.length > 0 && segments[0].audioUrl) {
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
  }, [segments, playbackMode]);

  // Update audio source when current segment changes (only for individual segments mode)
  useEffect(() => {
    if (playbackMode === 'segments' && audioRef.current && segments[currentSegment]?.audioUrl) {
      const wasPlaying = isPlaying;
      audioRef.current.src = segments[currentSegment].audioUrl;
      audioRef.current.currentTime = 0;
      
      if (wasPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSegment, segments, playbackMode]);

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
          <span>Virtual Podcast Player</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs">
                {playbackMode === 'segments' ? 'Segments' : 'Full Episode'}
              </span>
              <Button
                onClick={togglePlaybackMode}
                size="sm"
                variant="outline"
                disabled={isLoadingAudio}
              >
                {playbackMode === 'segments' ? <List className="h-4 w-4" /> : <Disc className="h-4 w-4" />}
              </Button>
            </div>
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
              {playbackMode === 'full' ? (
                <Disc className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
              <h4 className="text-sm font-medium">
                {playbackMode === 'full' ? 'Full Episode' : 'Segments'}
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
