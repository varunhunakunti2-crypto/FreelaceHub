import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { Briefcase, Calendar, DollarSign, ChevronRight, Clock, FileText, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export default async function ContractsListPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: contracts, error } = await supabase
    .from('contracts')
    .select(`
      *,
      project:projects(
        id,
        title,
        category,
        client:profiles(full_name)
      )
    `)
    .eq('freelancer_id', user.id)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching contracts:', error);
  }

  const contractList = contracts || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Active Jobs</h1>
        <p className="text-muted-foreground mt-1 font-medium">Manage your ongoing contracts and deliverable milestones.</p>
      </div>

      <div className="grid gap-6">
        {contractList.length > 0 ? (
          contractList.map((contract: any) => (
            <Link 
              key={contract.id} 
              href={`/dashboard/freelancer/contracts/${contract.id}`}
              className="glass-card group p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all border border-border/50"
            >
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                    {contract.project?.category || 'General'}
                  </span>
                  <span className="text-[10px] font-black text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full border border-border/50 uppercase tracking-widest">
                    STARTED {format(new Date(contract.start_date), 'PPP')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      contract.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {contract.project?.title || 'Untitled Project'}
                  </h3>
                  <p className="text-muted-foreground font-bold mt-1">
                    {contract.project?.client?.full_name || 'Anonymous Client'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-8 self-end md:self-auto border-t md:border-t-0 pt-6 md:pt-0 border-border/50">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Contract Value</p>
                  <span className="text-3xl font-black tracking-tighter text-foreground">{formatCurrency(contract.agreed_amount)}</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
                  <ChevronRight size={28} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
             <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground mb-4">
               <Briefcase size={32} />
             </div>
             <p className="text-xl font-bold text-slate-900 dark:text-white">No active contracts found</p>
             <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto font-medium">When you get hired for a project, it will appear here.</p>
             <Link 
               href="/dashboard/freelancer/browse"
               className="inline-flex items-center gap-2 mt-6 text-primary font-black hover:underline"
             >
               Browse Jobs <ArrowUpRight size={18} />
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
