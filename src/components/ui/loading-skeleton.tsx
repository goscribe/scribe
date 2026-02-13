import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LoadingSkeletonProps {
  type: 'flashcards' | 'study-guide' | 'worksheets' | 'podcast' | 'members';
  isGenerating?: boolean;
  generationProgress?: number;
}

export function LoadingSkeleton({ type, isGenerating = false, generationProgress = 0 }: LoadingSkeletonProps) {
  const renderFlashcardsSkeleton = () => (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-5 w-24 mb-1.5" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[72px] rounded-md" />
          <Skeleton className="h-8 w-[88px] rounded-md" />
          <Skeleton className="h-8 w-[88px] rounded-md" />
        </div>
      </div>

      {isGenerating ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <div>
                <p className="text-sm font-medium">Generating flashcards...</p>
                <p className="text-xs text-muted-foreground">This may take a few moments</p>
              </div>
              <Progress value={generationProgress} className="w-full max-w-xs mx-auto" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Flip card area */}
          <div className="space-y-4">
            {/* Stats row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-6" />
                <Skeleton className="h-5 w-3" />
                <Skeleton className="h-5 w-6" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            {/* Progress bar */}
            <Skeleton className="h-1.5 w-full rounded-full" />
            {/* Flip card */}
            <Card className="border border-border">
              <CardContent className="p-10 flex flex-col justify-center items-center min-h-[240px]">
                <div className="text-center space-y-3">
                  <Skeleton className="h-3 w-16 mx-auto" />
                  <Skeleton className="h-6 w-64 mx-auto" />
                  <Skeleton className="h-3 w-40 mx-auto" />
                </div>
              </CardContent>
            </Card>
            {/* Nav buttons */}
            <div className="flex justify-center gap-1">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Card list */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 mb-4" />
            {/* Section header */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-border" />
              <Skeleton className="h-5 w-28" />
              <div className="flex-1 h-px bg-border" />
            </div>
            {/* Cards */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative bg-card border border-border rounded-2xl p-6">
                <Skeleton className="absolute left-4 top-4 w-3 h-3 rounded-full" />
                <div className="flex items-center min-h-[80px] pl-6">
                  <div className="flex-1 pr-6 flex justify-center">
                    <Skeleton className="h-4 w-44" />
                  </div>
                  <div className="w-px h-16 bg-border" />
                  <div className="flex-1 pl-6 flex justify-center">
                    <Skeleton className="h-3.5 w-52" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStudyGuideSkeleton = () => (
    <div className="h-[calc(100vh-4rem)] overflow-hidden relative">
      {isGenerating ? (
        <div className="flex items-center justify-center h-full">
          <Card className="border-primary/20 bg-primary/5 max-w-md w-full mx-4">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <div>
                  <p className="text-sm font-medium">Generating study guide...</p>
                  <p className="text-xs text-muted-foreground">Analyzing your content</p>
                </div>
                <Progress value={generationProgress} className="w-full max-w-xs mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Floating button skeleton */}
          <div className="sticky top-4 z-10 flex justify-end px-8 lg:px-16">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>

          {/* Markdown content skeleton */}
          <div className="px-8 py-6 lg:px-16 mt-2 space-y-6">
            {/* Title */}
            <Skeleton className="h-9 w-2/3" />
            
            {/* Intro paragraph */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>

            {/* Section heading */}
            <div className="pt-4">
              <Skeleton className="h-7 w-1/3 mb-2" />
              <Skeleton className="h-px w-full" />
            </div>

            {/* Paragraph */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>

            {/* List items */}
            <div className="space-y-2 pl-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            </div>

            {/* Another section */}
            <div className="pt-4">
              <Skeleton className="h-7 w-2/5 mb-2" />
              <Skeleton className="h-px w-full" />
            </div>

            {/* Paragraph */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>

            {/* Code block */}
            <Skeleton className="h-24 w-full rounded-lg" />

            {/* More content */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderWorksheetsSkeleton = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-5 w-24 mb-1.5" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-[120px] rounded-md" />
      </div>
      
      {isGenerating ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <div>
                <p className="text-sm font-medium">Generating worksheet...</p>
                <p className="text-xs text-muted-foreground">Creating practice problems</p>
              </div>
              <Progress value={generationProgress} className="w-full max-w-xs mx-auto" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-border">
              <div className="p-4">
                {/* Top row: icon + title + badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-36 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>

                {/* Progress section */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-3 w-12" />
                  </div>
                  {/* Segmented bar */}
                  <div className="flex items-center gap-[3px]">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <Skeleton key={j} className="h-1.5 flex-1 rounded-full" />
                    ))}
                  </div>
                  {/* Bottom row: date + button */}
                  <div className="flex items-center justify-between mt-3">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-7 w-[72px] rounded-md" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderPodcastSkeleton = () => (
    <div className="space-y-4">
      {/* Header skeleton - matches PodcastHeader */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Audio Player skeleton - matches PodcastPlayer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Album Art Placeholder */}
            <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
            
            {/* Player Controls */}
            <div className="flex-1 space-y-2">
              <div>
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Segments List skeleton - matches SegmentList */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4" />
                    <div className="mt-3 flex gap-1">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar skeleton - matches PodcastSidebar */}
        <div className="space-y-4">
          {/* Podcast Info */}
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderMembersSkeleton = () => (
    <div className="space-y-4">
      {/* Header skeleton - matches MemberHeader */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>

      {/* Search bar skeleton */}
      <div className="relative">
        <Skeleton className="h-9 w-full" />
      </div>

      {/* Role info skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>

      {/* Member cards skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar skeleton */}
                  <Skeleton className="h-10 w-10 rounded-full" />
                  
                  {/* Member info skeleton */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>

                {/* Actions skeleton */}
                <Skeleton className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'flashcards':
      return renderFlashcardsSkeleton();
    case 'study-guide':
      return renderStudyGuideSkeleton();
    case 'worksheets':
      return renderWorksheetsSkeleton();
    case 'podcast':
      return renderPodcastSkeleton();
    case 'members':
      return renderMembersSkeleton();
    default:
      return <div>Loading...</div>;
  }
}
