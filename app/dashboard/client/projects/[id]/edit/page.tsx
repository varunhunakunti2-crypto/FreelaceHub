import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EditProjectForm from './EditProjectForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('client_id', user.id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        href={`/dashboard/client/projects/${params.id}`}
        className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Project Details
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Project</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Update your project details below.</p>
        </div>

        <EditProjectForm project={project} />
      </div>
    </div>
  );
}
