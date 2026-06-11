'use client';

import React, { useState } from 'react';
import { Calendar, Tag, DollarSign, Clock, Send } from 'lucide-react';
import ProposalForm from './ProposalForm';
import { format } from 'date-fns';

interface ProjectBrowseCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    budget_min: number;
    budget_max: number;
    category: string;
    skills_required: string[];
    deadline: string;
    created_at: string;
    client?: {
      full_name: string;
      avatar_url: string;
    };
  };
}

export default function ProjectBrowseCard({ project }: ProjectBrowseCardProps) {
  const [showProposalForm, setShowProposalForm] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mb-2">
            {project.category}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Fixed Price</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.skills_required?.map((skill) => (
          <span key={skill} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium flex items-center gap-1">
            <Tag size={12} /> {skill}
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>Posted {format(new Date(project.created_at), 'PPP')}</span>
          </div>
          {project.deadline && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>Due {format(new Date(project.deadline), 'PPP')}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowProposalForm(true)}
          className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Send size={18} />
          Submit Proposal
        </button>
      </div>

      {showProposalForm && (
        <ProposalForm 
          projectId={project.id} 
          projectTitle={project.title}
          onClose={() => setShowProposalForm(false)} 
        />
      )}
    </div>
  );
}
