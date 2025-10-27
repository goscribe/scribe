"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Headphones } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PodcastGenerationForm, PodcastGenerationForm as PodcastGenerationFormType } from "@/components/podcast-generation-form";
import { Progress } from "@/components/ui/progress";
import { PodcastsPageHeader } from "@/components/podcast/podcasts-page-header";
import { PodcastCardGrid } from "@/components/podcast/podcast-card-grid";
import { PodcastList } from "@/components/podcast/podcast-list";
import { usePodcastList } from "@/hooks/use-podcast-list";

/**
 * Podcasts panel component for managing and viewing podcast episodes
 * 
 * Features:
 * - Display podcast episodes in grid and list views
 * - Create new AI-generated podcasts
 * - Real-time generation progress via Pusher
 * - Play podcast episodes
 * - Navigate to individual podcast pages
 * 
 * @returns JSX element containing the podcasts panel
 */
export default function PodcastsPanel() {
  const params = useParams();
  const workspaceId = params.id as string;

  const [showGenerationForm, setShowGenerationForm] = useState(false);

  // Use the new podcast list hook
  const {
    podcastEpisodes,
    filteredEpisodes,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isGenerating,
    generatePodcast,
    deletePodcast,
    openPodcast,
    handlePlayClick,
    formatDuration,
    pusherState,
  } = usePodcastList({ workspaceId });

  /**
   * Handles podcast generation form submission
   * @param formData - Podcast generation form data
   */
  const handleGeneratePodcast = async (formData: PodcastGenerationFormType) => {
    try {
      setShowGenerationForm(false);
      await generatePodcast(formData);
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to generate podcast:", error);
    }
  };

  // Note: Progress toast handling is now managed by the usePodcastList hook

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <PodcastsPageHeader
          episodeCount={0}
          onCreateClick={() => {}}
          isCreating={false}
          searchQuery=""
          onSearchChange={() => {}}
          sortBy="newest"
          onSortChange={() => {}}
          filteredCount={0}
        />
        <div className="space-y-6">
          {/* Featured section skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted/50 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <div className="aspect-square bg-muted/30 animate-pulse"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-muted/50 rounded w-12 animate-pulse"></div>
                      <div className="h-5 bg-muted/50 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <PodcastsPageHeader
        episodeCount={podcastEpisodes.length}
        onCreateClick={() => setShowGenerationForm(true)}
        isCreating={isGenerating}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filteredCount={filteredEpisodes.length}
      />

      {/* Generation Dialog */}
      <Dialog open={showGenerationForm} onOpenChange={setShowGenerationForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate New Podcast</DialogTitle>
          </DialogHeader>
          <PodcastGenerationForm
            onSubmit={handleGeneratePodcast}
            isLoading={isGenerating}
          />
        </DialogContent>
      </Dialog>

      {/* Content */}
      {podcastEpisodes.length === 0 ? (
        <EmptyState
          icon={Headphones}
          title="No podcasts yet"
          description="Create your first AI-generated podcast to start learning on the go"
          action={{
            label: "New Podcast",
            onClick: () => setShowGenerationForm(true)
          }}
        />
      ) : filteredEpisodes.length === 0 ? (
        <EmptyState
          icon={Headphones}
          title="No podcasts found"
          description={`No podcasts match your search "${searchQuery}"`}
          action={{
            label: "Clear Search",
            onClick: () => setSearchQuery('')
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Featured/Recent Section - only show if no search query */}
          {!searchQuery.trim() && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Recently Created</h2>
              <PodcastCardGrid
                podcasts={filteredEpisodes}
                onPodcastClick={openPodcast}
                onPlayClick={handlePlayClick}
                formatDuration={formatDuration}
                maxItems={4}
              />
            </div>
          )}

          {/* All Episodes Section */}
          {(!searchQuery.trim() && filteredEpisodes.length > 4) || searchQuery.trim() ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                {searchQuery.trim() ? `Search Results (${filteredEpisodes.length})` : 'All Episodes'}
              </h2>
              <PodcastList
                podcasts={filteredEpisodes}
                onPodcastClick={openPodcast}
                onPlayClick={handlePlayClick}
                formatDuration={formatDuration}
                startIndex={searchQuery.trim() ? 0 : 4}
              />
            </div>
          ) : null}
        </div>
      )}

      {/* Sonner toasts handle progress UI */}
    </div>
  );
}