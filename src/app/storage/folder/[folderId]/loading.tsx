import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <div>
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-9 w-80" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      {/* Items Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="card-hover">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


