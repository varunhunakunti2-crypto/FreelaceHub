import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { FileText, Clock, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  accepted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
};

export default async function MyProposalsPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: proposals, error } = await supabase
    .from('proposals')
    .select(`
      *,
      project:projects(title, client:profiles(full_name))
    `)
    .eq('freelancer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Proposals</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage your submitted applications.</p>
      </div>

      <div className="grid gap-4">
        {proposals && proposals.length > 0 ? (
          proposals.map((proposal: any) => (
            <div key={proposal.id} className="bg-white dark:bg-slate-900 p-6 rounded-[1.75rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColors[proposal.status] || 'bg-slate-100 text-slate-600'}`}>
                      {proposal.status}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{proposal.project?.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Client: {proposal.project?.client?.full_name || 'Anonymous'}</p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">${proposal.bid_amount.toLocaleString()}</span>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Your Bid</p>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                  <Link 
                    href={`/dashboard/messages?project=${proposal.project_id}`}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <MessageSquare size={20} />
                  </Link>
                  <Link 
                    href={`/dashboard/freelancer/browse/${proposal.project_id}`}
                    className="flex items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>

              {proposal.status === 'accepted' && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                  <AlertCircle className="text-emerald-500 shrink-0" size={18} />
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium leading-relaxed">
                    <span className="font-bold">Good News!</span> Your proposal has been accepted. A contract has been created and you can now start working on this project.
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="mx-auto h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No proposals yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              You haven&apos;t submitted any proposals yet. Browse projects to find your first opportunity!
            </p>
            <div className="mt-6">
              <Link 
                href="/dashboard/freelancer/browse"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
