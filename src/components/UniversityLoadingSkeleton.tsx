import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const UniversityCardSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export const UniversityLoadingSkeleton = () => {
  return (
    <section id="universities" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore Universities</h2>
          <div className="flex items-center justify-center gap-2 text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <span className="ml-2 text-lg font-medium">Loading amazing universities for you</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filters Sidebar Skeleton */}
          <div className="xl:col-span-1">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-5 w-20 mb-3" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-16 mb-3" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-3" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-20 mb-3" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </Card>
          </div>

          {/* Results Skeleton */}
          <div className="xl:col-span-3">
            {/* Results Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* University Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <UniversityCardSkeleton key={index} />
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
              
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}