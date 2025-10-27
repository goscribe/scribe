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
  const [audioElements, setAudioElements] = useState<HTMLAudioElement[]>([]);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // tRPC queries and mutations
  const { data: episode, isLoading, error, refetch } = trpc.podcast.getEpisode.useQuery({ 
    episodeId: podcastId 
  }, {
    enabled: !!podcastId,
  });

  const deleteEpisodeMutation = trpc.podcast.deleteEpisode.useMutation();
  const updateEpisodeMutation = trpc.podcast.updateEpisode.useMutation();
  const regenerateSegmentMutation = trpc.podcast.regenerateSegment.useMutation();
  const updateSegmentMutation = trpc.podcast.updateSegment.useMutation();
  const deleteSegmentMutation = trpc.podcast.deleteSegment.useMutation();

  // Real-time podcast events
  const { state: _pusherState } = usePusherPodcast(workspaceId);
  
  // TODO: Use _pusherState for real-time updates (currently unused)

  // Sort segments by order
  const sortedSegments = episode?.segments ? [...episode.segments].sort((a, b) => a.order - b.order) : [];

  /**
   * Handles segment play/pause
   */
  const handleSegmentPlayPause = (segmentIndex: number) => {
    if (playingSegment === segmentIndex) {
      // Pause current segment
      if (audioElements[segmentIndex]) {
        audioElements[segmentIndex].pause();
      }
      setPlayingSegment(null);
    } else {
      // Stop any currently playing segment
      if (playingSegment !== null && audioElements[playingSegment]) {
        audioElements[playingSegment].pause();
      }
      
      // Play new segment
      if (audioElements[segmentIndex]) {
        audioElements[segmentIndex].play();
        setPlayingSegment(segmentIndex);
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
   * Handles segment regeneration
   */
  const handleSegmentRegenerate = async (segmentId: string, prompt: string) => {
    try {
      setIsRegenerating(true);
      
      await regenerateSegmentMutation.mutateAsync({
        segmentId,
        prompt
      });
      
      toast.success("Segment regeneration started");
      
      // Refresh the episode data
      await refetch();
      
    } catch (error) {
      console.error("Failed to regenerate segment:", error);
      toast.error("Failed to regenerate segment");
      throw error;
    } finally {
      setIsRegenerating(false);
    }
  };

  /**
   * Handles segment editing
   */
  const handleEditSegment = async (segmentId: string, updates: { title?: string; content?: string }) => {
    try {
      await updateSegmentMutation.mutateAsync({
        segmentId,
        ...updates
      });
      
      toast.success("Segment updated");
      
      // Refresh the episode data
      await refetch();
      
    } catch (error) {
      console.error("Failed to update segment:", error);
      toast.error("Failed to update segment");
      throw error;
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
    if (episode?.segments) {
      const sortedSegments = [...episode.segments].sort((a, b) => a.order - b.order);
      const newAudioElements: HTMLAudioElement[] = [];
      
      sortedSegments.forEach((segment, index) => {
        const audio = new Audio(segment.audioUrl!);
        
        // Handle segment end - auto-play next segment
        audio.addEventListener('ended', () => {
          if (index < sortedSegments.length - 1) {
            // Auto-play next segment
            const nextAudio = newAudioElements[index + 1];
            if (nextAudio) {
              nextAudio.play();
              setPlayingSegment(index + 1);
            }
          } else {
            // Last segment finished
            setPlayingSegment(null);
          }
        });
        
        // Handle play/pause events
        audio.addEventListener('play', () => {
          setPlayingSegment(index);
        });
        
        audio.addEventListener('pause', () => {
          if (playingSegment === index) {
            setPlayingSegment(null);
          }
        });
        
        newAudioElements.push(audio);
      });
      
      setAudioElements(newAudioElements);
      
      // Cleanup function
      return () => {
        newAudioElements.forEach(audio => {
          audio.pause();
          audio.removeEventListener('ended', () => {});
          audio.removeEventListener('play', () => {});
          audio.removeEventListener('pause', () => {});
        });
      };
    }
  }, [episode?.segments, playingSegment]);

  return {
    // Data
    episode,
    sortedSegments,
    isLoading,
    error,
    
    // State
    isBookmarked,
    playingSegment,
    isRenameDialogOpen,
    isRegenerateDialogOpen,
    selectedSegment,
    isRenaming,
    isRegenerating,
    
    // Actions
    setIsBookmarked,
    setIsRenameDialogOpen,
    setIsRegenerateDialogOpen,
    setSelectedSegment,
    handleSegmentPlayPause,
    handleRenamePodcast,
    handleSegmentRegenerate,
    handleEditSegment,
    handleDownloadSegment,
    handleDeleteSegment,
    handleDeleteEpisode,
    refreshEpisode,
  };
};
