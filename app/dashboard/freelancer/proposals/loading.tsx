import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function ProposalsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>

      <div className="grid gap-4">
        <LoadingSkeleton variant="card" count={3} />
      </div>
    </div>
  );
}
