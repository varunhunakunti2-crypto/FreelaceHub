import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ChevronLeft, Calendar, Tag, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import ProposalCard from '@/components/dashboard/ProposalCard';
import ProjectActions from './ProjectActions';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [
    { data: project, error: projectError },
    { data: proposals, error: proposalsError }
  ] = await Promise.all([
    (supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('client_id', user.id)
      .single() as any),
    supabase
      .from('proposals')
      .select(`
        *,
        freelancer:profiles(full_name, avatar_url, role)
      `)
      .eq('project_id', params.id)
      .order('created_at', { ascending: false })
  ]);

  if (projectError || !project) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    open: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        href="/dashboard/client/projects"
        className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[project.status] || 'bg-slate-100 text-slate-700'}`}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-3">{project.title}</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 py-6 border-y border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Budget</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">${project.budget_min} - ${project.budget_max}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Category</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{project.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Posted</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(project.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Deadline</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Description</h3>
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {project.description}
                </p>
              </div>

              {project.skills_required && project.skills_required.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills_required.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Proposals ({proposals?.length || 0})</h2>
            </div>
            
            <div className="space-y-4">
              {proposals && proposals.length > 0 ? (
                proposals.map((proposal: any) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))
              ) : (
                <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400">No proposals received yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Project Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Total Proposals</span>
                <span className="font-bold text-slate-900 dark:text-white">{proposals?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Avg. Bid Amount</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${proposals && proposals.length > 0 
                    ? Math.round(proposals.reduce((acc: any, curr: any) => acc + curr.bid_amount, 0) / proposals.length) 
                    : 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Client Reliability</span>
                <span className="font-bold text-green-600">100%</span>
              </div>
            </div>
            
            <div className="mt-8">
              <ProjectActions project={{ id: project.id, status: project.status }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
