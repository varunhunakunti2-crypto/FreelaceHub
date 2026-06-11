import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function InvoicesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="h-10 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LoadingSkeleton variant="stat-card" count={3} className="space-y-0 grid grid-cols-1 gap-6" />
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border-border/50">
        <div className="p-6 border-b border-border/50 bg-secondary/30 flex justify-between items-center">
          <div className="h-10 w-96 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
        <div className="p-8">
          <table className="w-full">
            <LoadingSkeleton variant="table-row" count={5} />
          </table>
        </div>
      </div>
    </div>
  );
}
