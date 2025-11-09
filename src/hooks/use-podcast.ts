"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { usePusherPodcast } from "@/hooks/pusher/use-pusher-podcast";
import { RouterOutputs } from "@goscribe/server";
import { toast } from "sonner";

type Episode = RouterOutputs['podcast']['getEpisode'];
type Segment = Episode['segments'][number];

/**
 * Custom hook for podcast operations and state management
 * 
 * Features:
 * - Fetch podcast episode data
 * - Handle audio playback state
 * - Manage segment operations (edit, regenerate, download, delete)
 * - Real-time updates via Pusher
 * - Error handling and loading states
 * 
 * @param workspaceId - The workspace ID
 * @param podcastId - The podcast episode ID
 * @returns Object containing podcast data and operations
 */
export const usePodcast = (workspaceId: string, podcastId: string) => {
  const router = useRouter();
  
  // State management
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [playingSegment, setPlayingSegment] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElements, setAudioElements] = useState<HTMLAudioElement[]>([]);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  // tRPC queries and mutations
  const { data: episode, isLoading, error, refetch } = trpc.podcast.getEpisode.useQuery({ 
    episodeId: podcastId 
  }, {
    enabled: !!podcastId,
  });

  const deleteEpisodeMutation = trpc.podcast.deleteEpisode.useMutation();
  const updateEpisodeMutation = trpc.podcast.updateEpisode.useMutation();
  const deleteSegmentMutation = trpc.podcast.deleteSegment.useMutation();

  // Real-time podcast events
  // Pass refetch callback to pusher hook for automatic refetching on podcast events
  const { state: pusherState } = usePusherPodcast(workspaceId, () => refetch());

  // Sort segments by order
  const sortedSegments = episode?.segments ? [...episode.segments].sort((a, b) => a.order - b.order) : [];

  // Log pusher state changes for debugging
  useEffect(() => {
    if (!pusherState) return;
    
    const { latestPodcastInfo, lastCompleted, lastError } = pusherState;
    
    if (latestPodcastInfo?.artifactId === podcastId) {
      console.log('Current podcast info updated:', latestPodcastInfo);
    }
    
    if (lastCompleted?.artifactId === podcastId) {
      console.log('Current podcast completed:', lastCompleted);
    }
    
    if (lastError?.artifactId === podcastId) {
      console.log('Current podcast error:', lastError);
    }
  }, [pusherState, podcastId]);

  /**
   * Handles segment play/pause
   */
  const handleSegmentPlayPause = async (segmentIndex: number) => {
    if (playingSegment === segmentIndex) {
      // Pause current segment
      if (audioElements[segmentIndex]) {
        audioElements[segmentIndex].pause();
      }
      setPlayingSegment(null);
    } else {
      // Stop any currently playing segment first
      if (playingSegment !== null && audioElements[playingSegment]) {
        audioElements[playingSegment].pause();
        // Wait a tick for pause to complete
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Play new segment
      if (audioElements[segmentIndex]) {
        try {
          await audioElements[segmentIndex].play();
          setPlayingSegment(segmentIndex);
        } catch (error) {
          console.error('Error playing audio:', error);
          toast.error('Failed to play audio segment');
        }
      }
    }
  };

  /**
   * Handles podcast renaming
   */
  const handleRenamePodcast = async (title: string, description?: string) => {
    try {
      setIsRenaming(true);
      
      await updateEpisodeMutation.mutateAsync({
        episodeId: podcastId,
        title,
        description
      });
      
      // Refresh the episode data
      await refetch();
      
    } catch (error) {
      console.error("Failed to rename podcast:", error);
      throw error; // Re-throw to let the dialog handle the error
    } finally {
      setIsRenaming(false);
    }
  };



  /**
   * Handles segment download
   */
  const handleDownloadSegment = (segment: Segment) => {
    if (segment.audioUrl) {
      const link = document.createElement('a');
      link.href = segment.audioUrl;
      link.download = `${segment.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /**
   * Handles segment deletion
   */
  const handleDeleteSegment = async (segmentId: string) => {
    try {
      await deleteSegmentMutation.mutateAsync({ segmentId });
      
      toast.success("Segment deleted");
      
      // Refresh the episode data
      await refetch();
      
    } catch (error) {
      console.error("Failed to delete segment:", error);
      toast.error("Failed to delete segment");
      throw error;
    }
  };

  /**
   * Handles episode deletion
   */
  const handleDeleteEpisode = async () => {
    try {
      await deleteEpisodeMutation.mutateAsync({ episodeId: podcastId });
      router.push(`/workspace/${workspaceId}/podcasts`);
    } catch (error) {
      console.error("Failed to delete episode:", error);
    }
  };

  /**
   * Handles episode refresh
   */
  const refreshEpisode = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh episode:", error);
    }
  };

  // Initialize audio elements when segments change
  useEffect(() => {
    if (!episode?.segments || episode.segments.length === 0) return;
    
    const sortedSegments = [...episode.segments].sort((a, b) => a.order - b.order);
    const newAudioElements: HTMLAudioElement[] = [];
    
    sortedSegments.forEach((segment, index) => {
      if (!segment.audioUrl) return;
      
      const audio = new Audio(segment.audioUrl);
      
      // Track time updates
      const onTimeUpdate = () => {
        // Update current time based on segment's start time + audio current time
        setCurrentTime(segment.startTime + audio.currentTime);
      };
      
      // Handle segment end - auto-play next segment
      const onEnded = () => {
        if (index < sortedSegments.length - 1) {
          // Auto-play next segment
          const nextAudio = newAudioElements[index + 1];
          if (nextAudio) {
            nextAudio.play().catch(err => {
              console.error('Failed to auto-play next segment:', err);
            });
            setPlayingSegment(index + 1);
          }
        } else {
          // Last segment finished
          setPlayingSegment(null);
          setCurrentTime(0);
        }
      };
      
      const onPlay = () => {
        setPlayingSegment(index);
      };
      
      const onPause = () => {
        // Only clear if this is the currently playing segment
        setPlayingSegment(prev => prev === index ? null : prev);
      };
      
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      
      newAudioElements.push(audio);
    });
    
    setAudioElements(newAudioElements);
    
    // Cleanup function
    return () => {
      newAudioElements.forEach(audio => {
        audio.pause();
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('play', () => {});
        audio.removeEventListener('pause', () => {});
      });
    };
  }, [episode?.segments]); // REMOVED playingSegment from dependencies!

  return {
    // Data
    episode,
    sortedSegments,
    isLoading,
    error,
    
    // State
    isBookmarked,
    playingSegment,
    currentTime,
    isRenameDialogOpen,
    selectedSegment,
    isRenaming,
    
    // Actions
    setIsBookmarked,
    setIsRenameDialogOpen,
    setSelectedSegment,
    handleSegmentPlayPause,
    handleRenamePodcast,
    handleDownloadSegment,
    handleDeleteSegment,
    handleDeleteEpisode,
    refreshEpisode,
  };
};
