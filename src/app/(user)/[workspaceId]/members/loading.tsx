export default function MembersLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-neutral-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-neutral-100 rounded-lg"></div>
        </div>
        <div className="h-11 w-40 bg-neutral-200 rounded-xl"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-sm flex flex-col h-[130px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100"></div>
              <div className="h-4 w-24 bg-neutral-100 rounded"></div>
            </div>
            <div className="h-10 w-16 bg-neutral-200 rounded mt-auto"></div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="space-y-6 mt-8">
        {/* Tabs Skeleton */}
        <div className="flex gap-4 border-b border-neutral-200 pb-2">
          <div className="h-5 w-24 bg-neutral-200 rounded"></div>
          <div className="h-5 w-32 bg-neutral-100 rounded"></div>
          <div className="h-5 w-36 bg-neutral-100 rounded"></div>
        </div>

        {/* List Skeleton */}
        <div className="bg-white border border-neutral-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex gap-4">
            <div className="h-4 w-32 bg-neutral-200 rounded"></div>
          </div>
          <div className="divide-y divide-neutral-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-neutral-200 rounded"></div>
                    <div className="h-3 w-48 bg-neutral-100 rounded"></div>
                  </div>
                </div>
                <div className="hidden md:flex md:col-span-3 items-center">
                  <div className="h-6 w-16 bg-neutral-100 rounded-md"></div>
                </div>
                <div className="col-span-4 md:col-span-3">
                  <div className="h-4 w-24 bg-neutral-100 rounded"></div>
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  <div className="h-8 w-8 bg-neutral-100 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
