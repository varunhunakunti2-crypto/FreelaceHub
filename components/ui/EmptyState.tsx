import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  actionOnClick,
  className,
}: EmptyStateProps) {
  return (
    <div className={`rounded-3xl border border-dashed border-slate-300/80 bg-white/80 dark:border-slate-700/80 dark:bg-slate-950/80 px-8 py-12 text-center shadow-sm ${className ?? ''}`}>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400 mb-6">
        {Icon ? <Icon className="h-10 w-10" /> : <span className="text-3xl">📭</span>}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400 mb-6">{description}</p>
      {actionLabel && (actionHref || actionOnClick) ? (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={actionOnClick}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {actionLabel}
          </button>
        )
      ) : null}
    </div>
  );
}
