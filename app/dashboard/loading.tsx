import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LoadingSkeleton variant="stat-card" count={4} className="space-y-0 grid grid-cols-1 gap-6" />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-4">
            <LoadingSkeleton variant="list-item" count={3} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="glass-card p-6 rounded-[1.5rem] space-y-6">
             <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
             </div>
             <div className="space-y-4 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
