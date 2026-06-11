import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Briefcase, ArrowRight, DollarSign, Tag } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    status: string;
    budget_min: number;
    budget_max: number;
    category: string;
    created_at: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    open: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    in_progress: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    completed: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    cancelled: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-6">
        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[project.status] || 'bg-slate-100 text-slate-700'}`}>
          {project.status.replace('_', ' ')}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {format(new Date(project.created_at), 'MMM d, yyyy')}
        </span>
      </div>
      
      <Link href={`/dashboard/client/projects/${project.id}`}>
        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer leading-tight mb-3">
          {project.title}
        </h3>
      </Link>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
        {project.description}
      </p>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
            <DollarSign size={10} className="text-indigo-500" />
            Budget Range
          </p>
          <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            ${project.budget_min.toLocaleString()} <span className="text-slate-300 font-medium mx-1">-</span> ${project.budget_max.toLocaleString()}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
             <Tag size={12} className="text-indigo-500" />
             <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">{project.category}</span>
          </div>
          <Link 
            href={`/dashboard/client/projects/${project.id}`}
            className="flex items-center gap-2 text-sm font-black text-indigo-600 hover:gap-3 transition-all"
          >
            Manage <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
      <div className="flex justify-between mb-6">
        <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
        <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-8 w-3/4 bg-slate-100 dark:bg-slate-800 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded" />
        <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}
