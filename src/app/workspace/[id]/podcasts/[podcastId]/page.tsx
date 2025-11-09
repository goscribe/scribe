"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Play, Pause, Clock, Calendar, Mic2, Zap, Download, Share2, MoreVertical, Pencil, Trash2, Info  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PodcastRenameDialog } from "@/components/podcast/podcast-rename-dialog";
import { SegmentRegenerateDialog } from "@/components/podcast/segment-regenerate-dialog";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { usePodcast } from "@/hooks/use-podcast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";


/**
 * Redesigned podcast detail page - cleaner, more focused UX
 */
export default function PodcastDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const podcastId = params.podcastId as string;

  const {
    episode,
    sortedSegments,
    isLoading,
    error,
    playingSegment,
    currentTime,
    isRenameDialogOpen,
    selectedSegment,
    isRenaming,
    setIsRenameDialogOpen,
    setSelectedSegment,
    handleSegmentPlayPause,
    handleRenamePodcast,
    handleDownloadSegment,
    handleDeleteEpisode,
  } = usePodcast(workspaceId, podcastId);

  // Helper functions
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatDurationLong = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getCurrentSegmentTime = () => {
    if (!currentSegment) return 0;
    // Time elapsed within the current segment
    return Math.max(0, currentTime - currentSegment.startTime);
  };

  const calculateProgress = () => {
    if (!currentSegment || currentSegment.duration === 0) return 0;
    
    // Calculate progress within current segment
    const segmentTime = getCurrentSegmentTime();
    const segmentProgress = (segmentTime / currentSegment.duration) * 100;
    return Math.min(100, Math.max(0, segmentProgress));
  };
  
  const calculateOverallProgress = () => {
    if (totalDuration === 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));
  };

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton type="podcast" />;
  }

  // Error state
  if (error || !episode) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-destructive text-lg font-medium">
            {error?.message || 'Podcast not found'}
        </div>
            <Button onClick={() => router.push(`/workspace/${workspaceId}/podcasts`)}>
              Back to Podcasts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSegment = playingSegment !== null ? sortedSegments[playingSegment] : null;
  const totalDuration = episode.metadata?.totalDuration || 0;

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar - Minimal & Clean */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{episode.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDurationLong(totalDuration)}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(episode.createdAt).toLocaleDateString()}
              </div>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                {sortedSegments.length} segments
              </Badge>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Download All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={handleDeleteEpisode}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Player & Current Segment */}
        <div className="lg:col-span-2 space-y-4">
          {/* Now Playing Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              {currentSegment ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Segment {playingSegment! + 1} of {sortedSegments.length}
                        </Badge>
                        <Badge className="text-xs bg-primary/20 text-primary border-0 animate-pulse">
                          Now Playing
                        </Badge>
                      </div>
                      <h2 className="text-xl font-bold mb-2">{currentSegment.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {currentSegment.content}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleSegmentPlayPause(playingSegment!)}
                      size="lg"
                      className="rounded-full h-12 w-12 p-0 ml-4"
                    >
                      <Pause className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Segment Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={calculateProgress()} className="h-1" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDuration(getCurrentSegmentTime())}</span>
                      <span>{formatDuration(currentSegment.duration)}</span>
                    </div>
                  </div>

                  {/* Key Points */}
                  {currentSegment.keyPoints && currentSegment.keyPoints.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xs font-medium mb-2">Key Points:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentSegment.keyPoints.map((point, i) => (
                          <Badge key={i} variant="outline" className="text-xs font-normal">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to Listen</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a segment below to start playing
                  </p>
                  {sortedSegments.length > 0 && (
                    <Button
                      onClick={() => handleSegmentPlayPause(0)}
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Play from Start
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overall Episode Progress */}
          {/* {playingSegment !== null && (
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-muted-foreground">
                      Segment {playingSegment + 1} of {sortedSegments.length} • {Math.round(calculateOverallProgress())}%
                    </span>
                  </div>
                  <Progress value={calculateOverallProgress()} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* Segments List - Cleaner Design */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="p-4 space-y-2">
                  {sortedSegments.map((segment, index) => (
                    <div
                      key={segment.id}
                      className={`
                        group relative p-4 rounded-lg border transition-all cursor-pointer
                        ${playingSegment === index 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-transparent hover:border-border hover:bg-muted/50'}
                      `}
                      onClick={() => handleSegmentPlayPause(index)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Play Button */}
                        <Button
                          variant={playingSegment === index ? "default" : "outline"}
                          size="sm"
                          className="h-10 w-10 rounded-full p-0 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSegmentPlayPause(index);
                          }}
                        >
                          {playingSegment === index ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="font-medium truncate">{segment.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {segment.content}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{formatDuration(segment.duration)}</span>
                            {segment.keyPoints && segment.keyPoints.length > 0 && (
                              <>
                                <span>•</span>
                                <span>{segment.keyPoints.length} key points</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions - Show on Hover */}
                        {/* <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
              setSelectedSegment(segment);
              setIsRegenerateDialogOpen(true);
            }}
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              Regenerate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadSegment(segment);
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu> */}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right: Episode Info & Insights */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold mb-4">Episode Details</h3>
              {episode.imageUrl && (
                <Image 
                  src={episode.imageUrl} 
                  alt={episode.title} 
                  width={400} 
                  height={400} 
                  className="w-full h-auto rounded-lg object-cover"
                  unoptimized 
                />
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{formatDuration(totalDuration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{format(new Date(episode.metadata?.generatedAt), 'MMM d, yyyy') || 'No date available'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{episode.metadata?.description || 'No description available'}</span>
              </div>
              <Separator />
              <h4 className="text-sm font-semibold mb-2">Speakers ({episode.metadata?.speakers.length})</h4>
                  {episode.metadata?.speakers.map((speaker) => (
                    <div className="flex items-center gap-2" key={speaker.id}>
                      <Image src={'https://api.dicebear.com/9.x/open-peeps/svg?seed=' + speaker.name} alt={speaker.name || ''} width={20} height={20} unoptimized />
                      <span className="text-sm font-medium">{speaker.name}</span>
                      <Badge variant="secondary" className="text-xs">{speaker.role}</Badge>
                    </div>
                  ))}
            </CardContent>
          </Card>

          {/* Episode Summary */}
          {episode.metadata?.summary && (
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Executive Summary */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {episode.metadata.summary.executiveSummary}
                      </p>
                    </div>

                    <Separator />

                    {/* Learning Objectives */}
                    {episode.metadata.summary.learningObjectives?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">You'll Learn</h4>
                        <ul className="space-y-2">
                          {episode.metadata.summary.learningObjectives.slice(0, 3).map((obj, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">✓</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    {/* Key Concepts */}
                    {episode.metadata.summary.keyConcepts?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Key Concepts</h4>
                        <div className="flex flex-wrap gap-1">
                          {episode.metadata.summary.keyConcepts.map((concept, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Tags */}
                    {episode.metadata.summary.tags?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {episode.metadata.summary.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Target Audience */}
                    {episode.metadata.summary.targetAudience && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-semibold mb-2">For</h4>
                          <p className="text-sm text-muted-foreground">
                            {episode.metadata.summary.targetAudience}
                          </p>
                        </div>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
              </div>
              
      {/* Dialogs */}
      <PodcastRenameDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        currentTitle={episode.title}
        currentDescription={episode.description}
        onRename={handleRenamePodcast}
        isRenaming={isRenaming}
      />

      {/* <SegmentRegenerateDialog
        isOpen={isRegenerateDialogOpen}
        onOpenChange={setIsRegenerateDialogOpen}
        segment={selectedSegment}
        onRegenerate={handleSegmentRegenerate}
        isRegenerating={isRegenerating}
      /> */}
    </div>
  );
}