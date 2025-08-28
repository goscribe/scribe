import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LoadingSkeletonProps {
  type: 'flashcards' | 'study-guide' | 'worksheets';
  isGenerating?: boolean;
  generationProgress?: number;
}

export function LoadingSkeleton({ type, isGenerating = false, generationProgress = 0 }: LoadingSkeletonProps) {
  const renderFlashcardsSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-48">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-40" />
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
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="shadow-soft">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-64" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  switch (type) {
    case 'flashcards':
      return renderFlashcardsSkeleton();
    case 'study-guide':
      return renderStudyGuideSkeleton();
    case 'worksheets':
      return renderWorksheetsSkeleton();
    default:
      return <div>Loading...</div>;
  }
}
