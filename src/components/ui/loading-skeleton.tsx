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
    <div className="space-y-4">
      {/* Header skeleton - matches FlashcardHeader */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      
      {isGenerating ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <div>
                <p className="text-sm font-medium">Generating flashcards...</p>
                <p className="text-xs text-muted-foreground">This may take a few moments</p>
              </div>
              <Progress value={generationProgress} className="w-full max-w-xs mx-auto" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search bar skeleton - matches FlashcardSearch */}
          <div className="relative w-80">
            <Skeleton className="h-9 w-full" />
          </div>
          
          {/* Table skeleton - matches FlashcardTable */}
          <Card className="border-border overflow-hidden">
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">
                      <Skeleton className="h-3 w-12" />
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">
                      <Skeleton className="h-3 w-16" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-48" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-64" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );

  const renderStudyGuideSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
      
      {isGenerating ? (
        <Card className="border-primary/20 bg-primary/5">
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
      ) : (
        <>
          <Card className="shadow-soft">
            <CardContent className="p-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderWorksheetsSkeleton = () => (
    <div className="space-y-4">
      {/* Header skeleton - matches worksheet page header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
      
      {isGenerating ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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
            <Card key={i} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Title and Difficulty */}
                    <div className="flex items-start gap-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    
                    {/* Description */}
                    <Skeleton className="h-3 w-64" />

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-6" />
                      </div>
                      <Skeleton className="h-1.5 w-full rounded-full" />
                    </div>

                    {/* Metadata and Actions */}
                    <div className="flex items-center justify-between">
                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-xs">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-14" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
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
