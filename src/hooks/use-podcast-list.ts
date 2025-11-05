"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { RouterOutputs } from '@goscribe/server';
import { usePusherPodcast } from './pusher/use-pusher-podcast';
import { Progress } from '@/components/ui/progress';
import { RouterInputs } from '@goscribe/server';

type PodcastEpisode = RouterOutputs['podcast']['listEpisodes'][number];

/**
 * Props for the usePodcastList hook
 */
interface UsePodcastListProps {
  /** The workspace ID */
  workspaceId: string;
  /** Whether to enable real-time updates */
  enableRealtime?: boolean;
}

/**
 * Custom hook for managing podcast list with real-time updates
 * 
 * Features:
 * - Fetch podcast episodes list
 * - Real-time updates via Pusher events
 * - Automatic refetching on podcast events
 * - Search and filter functionality
 * - CRUD operations (create, delete)
 * - Error handling and loading states
 * 
 * @param props - UsePodcastListProps
 * @returns Object containing podcast data and operations
 */
export const usePodcastList = ({ 
  workspaceId, 
  enableRealtime = true 
}: UsePodcastListProps) => {
  const router = useRouter();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'duration'>('newest');
  const [isGenerating, setIsGenerating] = useState(false);

  // tRPC queries and mutations
  const { 
    data: podcastEpisodes, 
    isLoading, 
    error, 
    refetch 
  } = trpc.podcast.listEpisodes.useQuery({ workspaceId });

  const generatePodcastMutation = trpc.podcast.generateEpisode.useMutation({
    onSuccess: () => {
      refetchPodcasts();
      setIsGenerating(false);
      toast.success("Podcast generated successfully!");
    },
    onError: (error) => {
      console.error("Failed to generate podcast:", error);
      toast.error("Failed to generate podcast");
    },
  });
  const deletePodcastMutation = trpc.podcast.deleteEpisode.useMutation();

  // Real-time podcast events
  // Pass refetch callback to pusher hook for automatic refetching
  const { state: pusherState } = usePusherPodcast(workspaceId, () => refetch());

  /**
   * Refetch podcast list with error handling
   */
  const refetchPodcasts = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refetch podcasts:', error);
    }
  }, [refetch]);

  /**
   * Handle real-time podcast events
   * Refetching is now handled directly in the pusher hook
   */
  useEffect(() => {
    if (!enableRealtime || !pusherState) return;

    const { latestPodcastInfo, lastCompleted, lastError } = pusherState;

    // Log state changes for debugging
    if (latestPodcastInfo) {
      console.log('Podcast info updated:', latestPodcastInfo);
    }
    
    if (lastCompleted) {
      console.log('Podcast completed:', lastCompleted);
      setIsGenerating(false);
    }
    
    if (lastError) {
      console.log('Podcast error:', lastError);
      setIsGenerating(false);
    }
  }, [pusherState, enableRealtime]);

  /**
   * Filters and sorts podcast episodes based on search query and sort option
   */
  const getFilteredAndSortedEpisodes = useCallback((episodes: PodcastEpisode[]) => {
    if (!episodes) return [];

    // Filter by search query
    let filtered = episodes;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = episodes.filter(episode => 
        episode.title.toLowerCase().includes(query) ||
        (episode.description && episode.description.toLowerCase().includes(query))
      );
    }

    // Sort episodes
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          const aDuration = a.metadata?.totalDuration || 0;
          const bDuration = b.metadata?.totalDuration || 0;
          return bDuration - aDuration;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, sortBy]);

  // Get filtered and sorted episodes
  const filteredEpisodes = getFilteredAndSortedEpisodes(podcastEpisodes || []);

  /**
   * Generates a new podcast episode
   */
  const generatePodcast = async (formData: RouterInputs['podcast']['generateEpisode']['podcastData']) => {
    try {
      setIsGenerating(true);

      const result = generatePodcastMutation.mutateAsync({
        workspaceId,
        podcastData: { ...formData }
      });

      
      // Refetch the list to show the new podcast
      await refetchPodcasts();
    
      return result;
    } catch (error) {
      console.error("Failed to generate podcast:", error);
      setIsGenerating(false);
      toast.error("Failed to start podcast generation");
      throw error;
    }
  };

  /**
   * Deletes a podcast episode
   */
  const deletePodcast = async (podcastId: string) => {
    try {
      await deletePodcastMutation.mutateAsync({ episodeId: podcastId });
      await refetchPodcasts();
      toast.success("Podcast deleted successfully!");
    } catch (error) {
      console.error("Failed to delete podcast:", error);
      toast.error("Failed to delete podcast");
      throw error;
    }
  };

  /**
   * Opens a podcast episode
   */
  const openPodcast = (podcastId: string) => {
    router.push(`/workspace/${workspaceId}/podcasts/${podcastId}`);
  };

  /**
   * Formats duration in seconds to MM:SS format
   */
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * Handles play button clicks
   */
  const handlePlayClick = (e: React.MouseEvent, _podcastId: string) => {
    e.stopPropagation();
    // Handle play logic here
  };

  return {
    // Data
    podcastEpisodes: podcastEpisodes || [],
    filteredEpisodes,
    isLoading,
    error,
    
    // State
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isGenerating,
    
    // Operations
    generatePodcast,
    deletePodcast,
    openPodcast,
    handlePlayClick,
    formatDuration,
    refetchPodcasts,
    
    // Real-time state
    pusherState,
  };
};