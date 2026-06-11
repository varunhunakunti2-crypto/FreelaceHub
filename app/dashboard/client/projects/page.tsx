import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Plus, Briefcase } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';
import ProjectFilters from '@/components/dashboard/ProjectFilters';

export default async function ClientProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string; query?: string };
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const status = searchParams.status || 'all';
  const query = searchParams.query || '';

  let dbQuery = supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  if (status !== 'all') {
    dbQuery = dbQuery.eq('status', status);
  }

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`);
  }

  const { data: projects, error } = await dbQuery;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Projects</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track all your posted projects.</p>
        </div>
        <Link 
          href="/dashboard/client/projects/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          Post a New Project
        </Link>
      </div>

      <ProjectFilters initialStatus={status} initialQuery={query} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects && projects.length > 0 ? (
          projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon={Briefcase}
              title="No projects yet"
              description="There are no projects matching your filters. Post a new project to get started."
              actionLabel="Post a New Project"
              actionHref="/dashboard/client/projects/new"
            />
          </div>
        )}
      </div>
    </div>
  );
}
