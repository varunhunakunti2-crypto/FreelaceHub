import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendObject {
  value: number;
  isPositive: boolean;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: TrendObject | React.ReactNode;
}

function isTrendObject(trend: any): trend is TrendObject {
  return trend && typeof trend === 'object' && 'value' in trend && 'isPositive' in trend;
}

export default function StatsCard({ title, value, icon, description, trend }: StatsCardProps) {
  return (
    <div className="glass-card p-6 rounded-[2rem] border border-border/50 shadow-sm hover:border-primary/20 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-secondary/50 dark:bg-secondary/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-bold",
            isTrendObject(trend) ? (trend.isPositive ? 'text-emerald-500' : 'text-rose-500') : ""
          )}>
            {isTrendObject(trend) ? (
              <>
                {trend.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {trend.value}%
              </>
            ) : (
              trend
            )}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{title}</h3>
        <p className="text-3xl font-black tracking-tight text-foreground">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground font-medium">{description}</p>
        )}
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
      <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4" />
      <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded mb-2" />
      <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
    </div>
  );
}
