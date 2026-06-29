import { LoadingScreen } from "@/components/ui/loading-screen";
import { Skeleton } from "@/components/ui/skeleton";

export default function MembersLoading() {
  return (
    <LoadingScreen messages={["Loading members list...", "Verifying roles..."]}>
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col h-[130px]">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-16 mt-auto" />
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="space-y-6 mt-8">
          {/* Tabs Skeleton */}
          <div className="flex gap-4 border-b border-border pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-36" />
          </div>

          {/* List Skeleton */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex gap-4">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="divide-y divide-border">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <div className="hidden md:flex md:col-span-3 items-center">
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="col-span-4 md:col-span-3">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LoadingScreen>
  );
}
