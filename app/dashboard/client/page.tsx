import React, { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import StatsCard, { StatsCardSkeleton } from '@/components/dashboard/StatsCard';
import ProjectCard, { ProjectCardSkeleton } from '@/components/dashboard/ProjectCard';
import { LayoutDashboard, Briefcase, FileText, Users, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ClientDashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile to get the name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  // Parallel data fetching for stats
  const [
    { count: activeProjectsCount },
    { data: paymentsData },
    { count: pendingProposalsCount },
    { count: hiredFreelancersCount },
    { data: recentProjects }
  ] = await Promise.all([
    // 1. Active Projects (in_progress)
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('client_id', user.id).eq('status', 'in_progress'),
    
    // 2. Total Spent (completed payments)
    supabase.from('payments').select('amount').eq('client_id', user.id).eq('status', 'completed'),
    
    // 3. Pending Proposals (for my projects)
    supabase.from('proposals')
      .select('id, projects!inner(client_id)', { count: 'exact', head: true })
      .eq('status', 'pending')
      .eq('projects.client_id', user.id),
      
    // 4. Hired Freelancers (unique freelancer_id from contracts)
    // Supabase doesn't support select count(distinct) directly via API easily, 
    // but for demo we can just count contracts or get the data and count in JS.
    supabase.from('contracts').select('freelancer_id').eq('client_id', user.id),
    
    // 5. Recent Projects
    supabase.from('projects').select('*').eq('client_id', user.id).order('created_at', { ascending: false }).limit(5)
  ]);

  const totalSpent = (paymentsData as any)?.reduce((acc: any, curr: any) => acc + Number(curr.amount), 0) || 0;
  
  // Count unique freelancers from contracts
  const uniqueFreelancers = new Set((hiredFreelancersCount as any)?.data?.map((c: any) => c.freelancer_id)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Client Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Welcome back, {profile?.full_name || 'User'}! Here's what's happening with your projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/client/projects/new"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <Plus size={20} />
            Post a Project
          </Link>
          <Link 
            href="/dashboard/messages"
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 px-6 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
          >
            Messages
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default">
          <StatsCard 
            title="Active Projects" 
            value={activeProjectsCount || 0} 
            icon={<Briefcase className="text-blue-500" size={20} />} 
            description="Projects in progress"
          />
        </div>
        <div className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default">
          <StatsCard 
            title="Total Spent" 
            value={`$${totalSpent.toLocaleString()}`} 
            icon={<LayoutDashboard className="text-emerald-500" size={20} />} 
            description="Paid to freelancers"
          />
        </div>
        <div className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default">
          <StatsCard 
            title="Pending Proposals" 
            value={pendingProposalsCount || 0} 
            icon={<FileText className="text-amber-500" size={20} />} 
            description="Awaiting review"
          />
        </div>
        <div className="hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default">
          <StatsCard 
            title="Hired Freelancers" 
            value={uniqueFreelancers || 0} 
            icon={<Users className="text-indigo-500" size={20} />} 
            description="Talent you've worked with"
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Projects</h2>
          <Link href="/dashboard/client/projects" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            View All Projects
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects && recentProjects.length > 0 ? (
            recentProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">No projects found. Post your first project to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
