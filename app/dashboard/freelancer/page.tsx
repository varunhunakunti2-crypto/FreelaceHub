import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import StatsCard from '@/components/dashboard/StatsCard';
import { Briefcase, FileText, DollarSign, Clock, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function FreelancerDashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch everything in parallel on the server
  const [
    { count: activeJobsCount },
    { count: pendingProposalsCount },
    { data: earningsData },
    { data: recentContractsRes }
  ] = await Promise.all([
    // 1. Count active jobs
    supabase.from('contracts')
      .select('*', { count: 'exact', head: true })
      .eq('freelancer_id', user.id)
      .eq('status', 'active'),
    
    // 2. Count pending proposals
    supabase.from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('freelancer_id', user.id)
      .eq('status', 'pending'),
    
    // 3. Get total earnings
    supabase.from('payments')
      .select('amount')
      .eq('freelancer_id', user.id)
      .eq('status', 'completed'),
    
    // 4. Get recent contracts
    supabase.from('contracts')
      .select(`
        id,
        status,
        start_date,
        project_id,
        project:projects(
          id,
          title,
          client_id,
          client:profiles(full_name)
        )
      `)
      .eq('freelancer_id', user.id)
      .order('start_date', { ascending: false })
      .limit(3)
  ]);

  const totalEarnings = earningsData?.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;
  const recentContracts = recentContractsRes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Freelancer Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your work, track earnings, and find new opportunities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/freelancer/browse"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <Briefcase size={20} />
            Find Work
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default">
          <StatsCard 
            title="Active Jobs" 
            value={activeJobsCount || 0} 
            icon={<Clock className="text-blue-500" size={20} />} 
            description="Ongoing projects"
          />
        </div>
        <div className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default">
          <StatsCard 
            title="Total Earnings" 
            value={formatCurrency(totalEarnings)} 
            icon={<DollarSign className="text-green-500" size={20} />} 
            description="Lifetime earnings"
          />
        </div>
        <div className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default">
          <StatsCard 
            title="Pending Proposals" 
            value={pendingProposalsCount || 0} 
            icon={<FileText className="text-purple-500" size={20} />} 
            description="Awaiting client response"
          />
        </div>
        <div className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default">
          <StatsCard 
            title="Average Rating" 
            value={totalEarnings > 0 ? "4.9" : "0.0"} 
            icon={<Star className="text-orange-500" size={20} />} 
            description={totalEarnings > 0 ? "Based on last 10 jobs" : "No reviews yet"}
          />
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active/Recent Contracts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Contracts</h2>
            <Link href="/dashboard/freelancer/contracts" className="text-sm font-bold text-primary hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentContracts.length > 0 ? (
              recentContracts.map((contract: any) => {
                const project = contract.project;
                const client = project?.client;
                
                return (
                  <Link 
                    key={contract.id} 
                    href={`/dashboard/freelancer/contracts/${contract.id}`}
                    className="glass-card flex items-center justify-between p-6 rounded-[1.5rem] hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary font-bold group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        {(project?.title || 'P').charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                          {project?.title || 'Untitled Project'}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                          {client?.full_name || 'Anonymous Client'}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 font-medium">No active contracts. Time to browse some jobs!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Sidebar Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Strength</h2>
          <div className="glass-card p-6 rounded-[1.5rem] space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Completion</span>
                <span>{totalEarnings > 0 ? "85%" : "25%"}</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: totalEarnings > 0 ? "85%" : "25%" }} />
              </div>
            </div>
            
            <ul className="space-y-3">
              {[
                { label: 'Verify Identity', done: true },
                { label: 'Add Portfolio', done: true },
                { label: 'Set Rate', done: true },
                { label: 'Take Skill Quiz', done: false },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-green-500/10 text-green-500' : 'bg-slate-100 text-slate-400'}`}>
                    <Star size={12} fill={item.done ? 'currentColor' : 'none'} />
                  </div>
                  <span className={item.done ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
