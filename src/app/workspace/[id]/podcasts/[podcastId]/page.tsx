"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  Calendar, 
  Clock, 
  Share2, 
  Edit3,
  ArrowLeft,
  Bookmark,
  BookmarkPlus,
  RefreshCw,
  Trash2,
  Plus,
  Play,
  Pause,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { usePusherPodcast } from "@/hooks/use-pusher-podcast";
import { RouterOutputs } from "@goscribe/server";

export default function PodcastDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const podcastId = params.podcastId as string;

  // TRPC queries
  const { data: episode, isLoading, error, refetch } = trpc.podcast.getEpisode.useQuery({ 
    episodeId: podcastId 
  }, {
    enabled: !!podcastId,
  });

  // Mutations
  const deleteEpisodeMutation = trpc.podcast.deleteEpisode.useMutation();
  const updateEpisodeMutation = trpc.podcast.updateEpisode.useMutation();

  // Real-time podcast events
  const { state: pusherState } = usePusherPodcast(workspaceId);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [editingSegment, setEditingSegment] = useState<string | null>(null);
  const [playingSegment, setPlayingSegment] = useState<number | null>(null);
  const [audioElements, setAudioElements] = useState<HTMLAudioElement[]>([]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const goBack = () => {
    router.push(`/workspace/${workspaceId}/podcasts`);
  };

  const refreshEpisode = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh episode:", error);
    }
  };

  const handleDeleteEpisode = async () => {
    try {
      await deleteEpisodeMutation.mutateAsync({ episodeId: podcastId });
      router.push(`/workspace/${workspaceId}/podcasts`);
    } catch (error) {
      console.error("Failed to delete episode:", error);
    }
  };

  const handleSegmentSave = async (segmentId: string, updates: RouterOutputs['podcast']['getEpisode']['segments'][number]) => {
    try {
      console.log("Saving segment:", segmentId, updates);
    } catch (error) {
      console.error("Failed to save segment:", error);
    }
  };

  const handleSegmentRegenerate = async (segmentId: string, newContent?: string) => {
    try {
      console.log("Regenerating segment:", segmentId, newContent);
    } catch (error) {
      console.error("Failed to regenerate segment:", error);
    }
  };

  // Handle segment play/pause
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
  }, [episode?.segments]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Podcasts
          </Button>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-2"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={goBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Podcasts
          </Button>
        </div>
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Podcast</h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || 'Podcast not found'}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const sortedSegments = episode.segments ? [...episode.segments].sort((a, b) => a.order - b.order) : [];

  // Build transcript from segments
  const transcript = episode.segments 
    ? episode.segments
        .sort((a, b) => a.order - b.order)
        .map(segment => `## ${segment.title}\n\n${segment.content}`)
        .join('\n\n')
    : episode.content || 'No transcript available';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={goBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Podcasts
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{episode.title}</h1>
            <p className="text-sm text-muted-foreground">
              AI-generated podcast episode
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsBookmarked(!isBookmarked)}
            variant="outline"
            size="sm"
          >
            {isBookmarked ? (
              <Bookmark className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            onClick={refreshEpisode}
            variant="outline" 
            size="sm"
            title="Refresh episode data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit3 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Podcast</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{episode.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteEpisode}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Segments List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Podcast Segments</span>
                <Badge variant="outline">
                  {sortedSegments.length} segments
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedSegments.length > 0 ? (
                <div className="space-y-4">
                  {sortedSegments.map((segment, index) => (
                    <div
                      key={segment.id}
                      className={`p-4 rounded-lg border transition-all ${
                        playingSegment === index
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-muted hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {index + 1}
                            </span>
                            <Button
                              onClick={() => handleSegmentPlayPause(index)}
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
                        {playingSegment === index && (
                          <Badge variant="secondary" className="animate-pulse">
                            Playing
                          </Badge>
                        )}
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

          {/* Content Tabs */}
          <Tabs defaultValue="transcript" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="transcript">
              <Card>
                <CardHeader>
                  <CardTitle>Full Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {transcript}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary">
              {episode.metadata?.summary ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">
                        {episode.metadata.summary.executiveSummary}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {episode.metadata.summary.learningObjectives.map((objective, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-primary font-medium">{i + 1}.</span>
                            <span className="text-sm">{objective}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Concepts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {episode.metadata.summary.keyConcepts.map((concept, i) => (
                          <Badge key={i} variant="secondary">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Follow-up Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {episode.metadata.summary.followUpActions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No summary available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Podcast Info */}
          <Card>
            <CardHeader>
              <CardTitle>Podcast Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {episode.description}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {formatDuration(episode.metadata?.totalDuration || 0)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created: {new Date(episode.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Voice:</span>
                  <span className="capitalize">{episode.metadata?.voice || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Speed:</span>
                  <span>{episode.metadata?.speed || 1.0}x</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Segments:</span>
                  <span>{episode.segments?.length || 0}</span>
                </div>
                {playingSegment !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Currently Playing:</span>
                    <Badge variant="secondary" className="text-xs">
                      Segment {playingSegment + 1}
                    </Badge>
                  </div>
                )}
              </div>

              {episode.metadata?.summary && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Target Audience</h4>
                    <p className="text-sm text-muted-foreground">
                      {episode.metadata.summary.targetAudience}
                    </p>
                  </div>

                  {episode.metadata.summary.prerequisites && episode.metadata.summary.prerequisites.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
                        <div className="space-y-1">
                          {episode.metadata.summary.prerequisites.map((prereq, i) => (
                            <div key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{prereq}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {episode.metadata.summary.tags && episode.metadata.summary.tags.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {episode.metadata.summary.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Generate Flashcards
              </Button>
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Study Guide
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Transcript
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
