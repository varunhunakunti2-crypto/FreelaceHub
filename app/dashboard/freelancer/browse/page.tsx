import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { Search, Filter, Briefcase, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default async function BrowseProjectsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const supabase = createServerClient();
  
  let query = supabase
    .from('projects')
    .select(`
      *,
      client:profiles(full_name, avatar_url)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`);
  }

  if (searchParams.category && searchParams.category !== 'All Categories') {
    query = query.eq('category', searchParams.category);
  }

  const { data: projects, error } = await query;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Browse Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Discover opportunities that match your expertise.</p>
        </div>
        
        <form className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              name="q"
              type="text" 
              defaultValue={searchParams.q}
              placeholder="Search projects..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {['All Categories', 'Web Development', 'Mobile Development', 'Design', 'AI & Machine Learning', 'Writing', 'Marketing'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/dashboard/freelancer/browse?category=${cat}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                    className={`block text-sm py-1 transition-colors ${
                      (searchParams.category === cat || (!searchParams.category && cat === 'All Categories'))
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Project List */}
        <div className="lg:col-span-3 space-y-4">
          {projects && projects.length > 0 ? (
            projects.map((project: any) => (
              <Link 
                key={project.id} 
                href={`/dashboard/freelancer/browse/${project.id}`}
                className="block bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group relative shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      <Briefcase size={14} />
                      {project.category || 'General'}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{project.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{project.client?.full_name || 'Anonymous Client'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">Fixed Price</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-6 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-slate-400" />
                    Remote
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-slate-400" />
                    {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex flex-wrap gap-2">
                    {project.skills_required?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                        {tag}
                      </span>
                    ))}
                    {project.skills_required?.length > 3 && (
                      <span className="text-xs text-slate-400 self-center font-bold">+{project.skills_required.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm group-hover:gap-3 transition-all">
                    View Details
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <div className="mx-auto h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Briefcase size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No projects found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                We couldn&apos;t find any projects matching your current filters. Try adjusting your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
