"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Eye, Edit3, Download, Calendar, Clock, Loader2, Mic, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// removed Progress overlay in favor of Sonner toasts
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { RouterOutputs } from "@goscribe/server";
import { PodcastGenerationForm, PodcastGenerationForm as PodcastGenerationFormType } from "@/components/podcast-generation-form";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { usePusherPodcast } from "@/hooks/use-pusher-podcast";

type PodcastEpisode = RouterOutputs['podcast']['listEpisodes'][number];

export default function PodcastsPanel() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  const [showGenerationForm, setShowGenerationForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePodcastMutation = trpc.podcast.generateEpisode.useMutation();
  const deletePodcastMutation = trpc.podcast.deleteEpisode.useMutation();
  const { data: podcastEpisodes, isLoading, refetch } = trpc.podcast.listEpisodes.useQuery({ workspaceId });

  // Real-time podcast events
  const { state: pusherState } = usePusherPodcast(workspaceId);

  const generatePodcast = async (formData: PodcastGenerationFormType) => {
    try {
      setIsGenerating(true);
      setShowGenerationForm(false);

      const result = await generatePodcastMutation.mutateAsync({
        workspaceId,
        podcastData: formData
      });

      console.log("Generated podcast:", result);
      
      // Refetch the list to show the new podcast
      await refetch();
      
      // Navigate to the new podcast after a short delay
      setTimeout(() => {
        router.push(`/workspace/${workspaceId}/podcasts/${result.id}`);
      }, 2000);
    } catch (error) {
      console.error("Failed to generate podcast:", error);
      setIsGenerating(false);
      toast.error("Failed to start podcast generation");
    }
  };

  const deletePodcast = async (podcastId: string) => {
    try {
      await deletePodcastMutation.mutateAsync({ episodeId: podcastId });
      await refetch();
    } catch (error) {
      console.error("Failed to delete podcast:", error);
    }
  };

  const openPodcast = (podcastId: string) => {
    router.push(`/workspace/${workspaceId}/podcasts/${podcastId}`);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Sonner custom progress toast with progress bar
  useEffect(() => {
    if (!pusherState) return;
    const { isGenerating: generating, progress } = pusherState;

    if (generating) {
      if (progress.errors && progress.errors.length > 0) {
        toast.error(progress.errors[0] || 'An error occurred during generation', { id: 'podcast-gen' });
        toast.dismiss('podcast-gen-progress');
        setIsGenerating(false);
        return;
      }

      if (progress.stage === 'complete') {
        toast.success('Podcast generated successfully!', { id: 'podcast-gen' });
        toast.dismiss('podcast-gen-progress');
        setIsGenerating(false);
        return;
      }

      toast.custom(() => (
        <div className="w-80 rounded-lg border bg-background shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium">
                {progress.stage === 'structuring' && 'Structuring content'}
                {progress.stage === 'generating_audio' && 'Generating audio'}
                {progress.stage === 'preparing_segments' && 'Preparing segments'}
                {progress.stage === 'creating_summary' && 'Creating summary'}
                {progress.stage === 'complete' && 'Completed'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{Math.round(progress.progress || 0)}%</span>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {progress.currentStep || 'Working on it...'}
          </div>
          {progress.stage === 'generating_audio' && progress.totalSegments ? (
            <div className="text-[11px] text-muted-foreground mb-2">
              Segment {Math.max(1, (progress.currentSegment || 0))} of {progress.totalSegments}
            </div>
          ) : null}
          <Progress value={Math.round(progress.progress || 0)} className="h-2" />
        </div>
      ), { id: 'podcast-gen-progress', duration: Infinity });
    } else if (!generating && isGenerating) {
      setIsGenerating(false);
      toast.dismiss('podcast-gen');
      toast.dismiss('podcast-gen-progress');
    }
  }, [pusherState, isGenerating]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Podcasts</h3>
            <p className="text-sm text-muted-foreground">
              AI-generated audio content for learning on the go
            </p>
          </div>
          <Button disabled size="sm" className="gradient-primary">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-soft">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Podcasts</h3>
          <p className="text-sm text-muted-foreground">
            AI-generated audio content for learning on the go
          </p>
        </div>
        <Dialog open={showGenerationForm} onOpenChange={setShowGenerationForm}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="gradient-primary"
              disabled={isGenerating}
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate Podcast
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate New Podcast</DialogTitle>
            </DialogHeader>
            <PodcastGenerationForm
              onSubmit={generatePodcast}
              isLoading={isGenerating}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {podcastEpisodes?.map((podcast: PodcastEpisode) => (
          <Card key={podcast.id} className="shadow-soft hover:shadow-md transition-shadow card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base mb-2">{podcast.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">
                    {podcast.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {podcast.metadata ? formatDuration(podcast.metadata.totalDuration) : 'Unknown'} duration
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(podcast.createdAt.toISOString())}
                    </div>
                    {podcast.segments && (
                      <div className="flex items-center gap-1">
                        <span>{podcast.segments.length} segments</span>
                      </div>
                    )}
                    {podcast.metadata?.voice && (
                      <div className="flex items-center gap-1">
                        <Mic className="h-3 w-3" />
                        <span className="capitalize">{podcast.metadata.voice}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Ready
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Summary Preview */}
              {podcast.metadata?.summary && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {podcast.metadata.summary.executiveSummary}
                  </p>
                  {podcast.metadata.summary.keyConcepts && podcast.metadata.summary.keyConcepts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {podcast.metadata.summary.keyConcepts.slice(0, 3).map((concept, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                      {podcast.metadata.summary.keyConcepts.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{podcast.metadata.summary.keyConcepts.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => openPodcast(podcast.id)}
                  size="sm" 
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Episode
                </Button>
                <Button 
                  onClick={() => openPodcast(podcast.id)}
                  size="sm" 
                  variant="outline"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Podcast</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{podcast.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePodcast(podcast.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {podcastEpisodes?.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 rounded-full bg-muted">
                <Mic className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No podcasts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first AI-generated podcast to start learning on the go
                </p>
                <Button onClick={() => setShowGenerationForm(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate your first podcast
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sonner toasts handle progress UI */}
    </div>
  );
}