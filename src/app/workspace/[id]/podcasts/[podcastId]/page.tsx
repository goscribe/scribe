"use client";

import { useParams } from "next/navigation";
import { PodcastHeader } from "@/components/podcast/podcast-header";
import { PodcastPlayer } from "@/components/podcast/podcast-player";
import { SegmentList } from "@/components/podcast/segment-list";
import { PodcastSidebar } from "@/components/podcast/podcast-sidebar";
import { PodcastRenameDialog } from "@/components/podcast/podcast-rename-dialog";
import { SegmentRegenerateDialog } from "@/components/podcast/segment-regenerate-dialog";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { usePodcast } from "@/hooks/use-podcast";

/**
 * Podcast detail page component for viewing and managing individual podcast episodes
 * 
 * Features:
 * - View podcast information and metadata
 * - Play/pause individual segments
 * - Rename podcast title and description
 * - Regenerate segments with custom prompts
 * - Download segment audio files
 * - Real-time updates via Pusher
 * 
 * @returns JSX element containing the podcast detail page
 */
export default function PodcastDetailPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const podcastId = params.podcastId as string;

  // Custom hook for podcast operations
  const {
    episode,
    sortedSegments,
    isLoading,
    error,
    isBookmarked,
    playingSegment,
    isRenameDialogOpen,
    isRegenerateDialogOpen,
    selectedSegment,
    isRenaming,
    isRegenerating,
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
  } = usePodcast(workspaceId, podcastId);

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton type="podcast" />;
  }

  // Error state
  if (error || !episode) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Podcast</h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || 'Podcast not found'}
          </p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <PodcastHeader
        title={episode.title}
        isBookmarked={isBookmarked}
        onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
        onRefresh={refreshEpisode}
        onRename={() => setIsRenameDialogOpen(true)}
        onDelete={handleDeleteEpisode}
      />

      {/* Audio Player */}
      <PodcastPlayer
        title={episode.title}
        description={episode.description}
        duration={episode.metadata?.totalDuration || 0}
        speed={episode.metadata?.speed || 1.0}
        voice={episode.metadata?.voice || 'Unknown'}
        onPlay={() => {
          if (sortedSegments.length > 0) {
            handleSegmentPlayPause(0);
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <SegmentList
            segments={sortedSegments}
            playingSegment={playingSegment}
            onSegmentPlayPause={handleSegmentPlayPause}
            onEditSegment={handleEditSegment}
            onRegenerateSegment={(segment) => {
              setSelectedSegment(segment);
              setIsRegenerateDialogOpen(true);
            }}
            onDownloadSegment={handleDownloadSegment}
            onDeleteSegment={handleDeleteSegment}
            isProcessing={isRegenerating}
          />
        </div>

        {/* Sidebar */}
        <PodcastSidebar
          episode={episode}
          playingSegment={playingSegment}
          onEdit={() => setIsRenameDialogOpen(true)}
          onDelete={handleDeleteEpisode}
        />
              </div>
              
      {/* Rename Dialog */}
      <PodcastRenameDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        currentTitle={episode.title}
        currentDescription={episode.description}
        onRename={handleRenamePodcast}
        isRenaming={isRenaming}
      />

      {/* Regenerate Segment Dialog */}
      <SegmentRegenerateDialog
        isOpen={isRegenerateDialogOpen}
        onOpenChange={setIsRegenerateDialogOpen}
        segment={selectedSegment}
        onRegenerate={handleSegmentRegenerate}
        isRegenerating={isRegenerating}
      />
    </div>
  );
}