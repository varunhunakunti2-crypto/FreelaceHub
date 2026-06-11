'use client';

import React, { useTransition } from 'react';
import { acceptProposal, rejectProposal } from '@/app/dashboard/client/actions';
import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, Clock, Send, MessageSquare } from 'lucide-react';

interface ProposalCardProps {
  proposal: {
    id: string;
    project_id: string;
    bid_amount: number;
    estimated_days: number;
    cover_letter: string;
    status: string;
    created_at: string;
    freelancer: {
      full_name: string;
      avatar_url: string;
      role: string;
    };
  };
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    if (confirm('Are you sure you want to accept this proposal? This will create a contract and notify the freelancer.')) {
      startTransition(async () => {
        try {
          const result = await acceptProposal(proposal.id, proposal.project_id);
          if (result?.success) {
            toast.success('Proposal accepted successfully!');
          } else {
            toast.error('Failed to accept proposal.');
          }
        } catch (error) {
          toast.error('An error occurred.');
        }
      });
    }
  };

  const handleReject = () => {
    if (confirm('Are you sure you want to reject this proposal?')) {
      startTransition(async () => {
        try {
          const result = await rejectProposal(proposal.id, proposal.project_id);
          if (result?.success) {
            toast.success('Proposal rejected.');
          } else {
            toast.error('Failed to reject proposal.');
          }
        } catch (error) {
          toast.error('An error occurred.');
        }
      });
    }
  };

  return (
    <div className="h-full flex flex-col group bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div className="relative">
          <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/30 border-2 border-white dark:border-slate-800 shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-500">
            {proposal.freelancer.avatar_url ? (
              <img src={proposal.freelancer.avatar_url} alt={proposal.freelancer.full_name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl font-black">
                {proposal.freelancer.full_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" title="Freelancer Online" />
        </div>
        
        <div className="space-y-1">
          <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{proposal.freelancer.full_name}</h4>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Top Rated Freelancer
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            Verified
          </p>
        </div>
        
        <div className="md:ml-auto text-left md:text-right space-y-1">
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">${proposal.bid_amount.toLocaleString()}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center md:justify-end gap-1.5">
            <Clock size={12} className="text-indigo-500" />
            {proposal.estimated_days} Days Delivery
          </p>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[1.5rem] mb-8 border border-slate-100 dark:border-slate-800 group-hover:border-indigo-500/10 transition-colors h-full">
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap line-clamp-4">
            {proposal.cover_letter}
          </p>
          <button className="absolute bottom-4 right-6 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
            Read Full
          </button>
        </div>
      </div>

      <div className="mt-auto">
        {proposal.status === 'pending' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAccept}
              disabled={isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? 'Processing...' : (
                <>
                  <CheckCircle2 size={20} />
                  Accept Proposal
                </>
              )}
            </button>
            <div className="flex gap-2">
               <button
                onClick={handleReject}
                disabled={isPending}
                className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                title="Reject Proposal"
              >
                <XCircle size={24} />
              </button>
              <button
                disabled={isPending}
                className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                title="Message Freelancer"
              >
                <MessageSquare size={24} />
              </button>
            </div>
          </div>
        )}

        {proposal.status !== 'pending' && (
          <div className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black tracking-widest uppercase text-xs border ${
            proposal.status === 'accepted' 
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
          }`}>
            {proposal.status === 'accepted' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {proposal.status}
          </div>
        )}
      </div>
    </div>
  );
}
