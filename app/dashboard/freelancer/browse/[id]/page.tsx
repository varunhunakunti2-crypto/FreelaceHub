import React from 'react';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Briefcase, 
  ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import ApplyButton from './ApplyButton';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const adminSupabase = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // We use admin client here because RLS might block viewing projects 
  // that are already 'in_progress' from the browse page.
  const { data: project, error } = await adminSupabase
    .from('projects')
    .select(`
      *,
      client:profiles!projects_client_id_fkey(full_name, avatar_url, bio, created_at)
    `)
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching project:', error);
  }

  if (!project) {
    notFound();
  }

  const client = project.client;

  // Check if user already submitted a proposal
  const { data: existingProposal } = await supabase
    .from('proposals')
    .select('id')
    .eq('project_id', params.id)
    .eq('freelancer_id', user.id)
    .maybeSingle();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      <Link 
        href="/dashboard/freelancer/browse"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold mb-8"
      >
        <ChevronLeft size={20} />
        Back to Browse
      </Link>

      {project.status !== 'open' && (
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-amber-800 dark:text-amber-400">
          <AlertCircle size={20} />
          <p className="text-sm font-bold text-slate-900 dark:text-white">This project is no longer accepting applications (Status: {project.status}).</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Project Details */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Briefcase size={14} />
                {project.category || 'General'}
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500 dark:text-slate-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin size={18} className="text-indigo-600" />
                  Remote
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={18} className="text-indigo-600" />
                  Posted {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Payment Verified
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Fixed Budget</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Project Type</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">Fixed Price</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Experience</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">Intermediate</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Description</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {project.skills_required?.map((tag: string) => (
                  <span key={tag} className="px-5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 sticky top-24">
            <div className="space-y-6">
              {project.status === 'open' ? (
                <ApplyButton 
                  projectId={project.id} 
                  projectTitle={project.title} 
                  hasSubmitted={!!existingProposal}
                  defaultBid={project.budget_min.toString()}
                />
              ) : (
                <div className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-4 rounded-2xl font-black text-center cursor-not-allowed">
                  Applications Closed
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={20} className="text-indigo-600" />
                About the Client
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-2xl border border-indigo-100 dark:border-indigo-800">
                  {(client as any)?.full_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">{(client as any)?.full_name || 'Anonymous Client'}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Member since {(client as any)?.created_at ? new Date((client as any).created_at).getFullYear() : '2026'}</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                "{(client as any)?.bio || 'No client bio available.'}"
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Total Spent</p>
                  <p className="font-black text-slate-900 dark:text-white">$10k+</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Hire Rate</p>
                  <p className="font-black text-indigo-600">85%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
