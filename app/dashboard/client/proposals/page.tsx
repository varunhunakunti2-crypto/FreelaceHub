import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ChevronLeft, FileText, Filter } from 'lucide-react';
import Link from 'next/link';
import ProposalCard from '@/components/dashboard/ProposalCard';

export default async function ClientProposalsPage() {
  const supabase = createServerClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: proposals, error } = await supabase
    .from('proposals')
    .select(`
      *,
      project:projects!inner(id, title, client_id),
      freelancer:profiles(full_name, avatar_url, role)
    `)
    .eq('projects.client_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching proposals:', error);
  }

  // Group proposals by status or project if needed, but for now just list them
  const pendingProposals = proposals?.filter((p: any) => p.status === 'pending') || [];
  const otherProposals = proposals?.filter((p: any) => p.status !== 'pending') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Proposals</h1>
          <p className="text-slate-500 dark:text-slate-400">Review and manage proposals across all your projects.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {pendingProposals.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              Pending Review ({pendingProposals.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingProposals.map((proposal: any) => (
                <div key={proposal.id} className="relative h-full">
                  <div className="absolute top-4 right-4 z-10">
                    <Link 
                      href={`/dashboard/client/projects/${proposal.project.id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded"
                    >
                      {proposal.project.title}
                    </Link>
                  </div>
                  <ProposalCard proposal={proposal} />
                </div>
              ))}
            </div>
          </section>
        )}

        {otherProposals.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Past Decisions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
              {otherProposals.map((proposal: any) => (
                <div key={proposal.id} className="relative h-full">
                   <div className="absolute top-4 right-4 z-10">
                    <Link 
                      href={`/dashboard/client/projects/${proposal.project.id}`}
                      className="text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
                    >
                      {proposal.project.title}
                    </Link>
                  </div>
                  <ProposalCard proposal={proposal} />
                </div>
              ))}
            </div>
          </section>
        )}

        {(!proposals || proposals.length === 0) && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="mx-auto h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No proposals yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              When freelancers bid on your projects, their proposals will appear here.
            </p>
            <div className="mt-6">
              <Link 
                href="/dashboard/client/projects/new"
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Post a New Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
