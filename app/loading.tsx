import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-7xl space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl animate-pulse" />
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </div>
    </div>
  );
}
