import React from 'react';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function ProposalsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <LoadingSkeleton className="h-8 w-48" />
          <LoadingSkeleton className="h-4 w-64" />
        </div>
        <LoadingSkeleton className="h-10 w-24 rounded-lg" />
      </div>

      <div className="space-y-12">
        <section>
          <LoadingSkeleton className="h-6 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <LoadingSkeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
