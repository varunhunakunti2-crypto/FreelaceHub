import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export type LoadingSkeletonVariant =
  | 'card'
  | 'list-item'
  | 'table-row'
  | 'profile'
  | 'stat-card';

interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LoadingSkeletonVariant;
  count?: number;
}

const base = 'animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700';

const variantStyles: Record<LoadingSkeletonVariant, string> = {
  card: 'h-52 w-full rounded-3xl',
  'list-item': 'h-16 w-full rounded-2xl',
  'table-row': 'h-5 w-full rounded-full',
  profile: 'h-24 w-24 rounded-full',
  'stat-card': 'h-32 w-full rounded-3xl',
};

const rowCells = [
  'w-1/3',
  'w-1/4',
  'w-1/5',
  'w-1/6',
];

export default function LoadingSkeleton({
  variant = 'card',
  count = 1,
  className,
  ...props
}: LoadingSkeletonProps) {
  if (variant === 'table-row') {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <tr key={index} className="border-b border-slate-200/80 dark:border-slate-800">
            {rowCells.map((width, cellIndex) => (
              <td key={cellIndex} className="px-6 py-4">
                <div className={cn(base, 'h-4', width)} />
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }

  return (
    <div
      className={cn('space-y-3', className)}
      {...props}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={cn(base, variantStyles[variant])} />
      ))}
    </div>
  );
}
