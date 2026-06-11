'use client';

import React, { useTransition } from 'react';
import { deleteProject, updateProjectStatus } from '@/app/dashboard/client/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface ProjectActionsProps {
  project: {
    id: string;
    status: string;
  };
}

export default function ProjectActions({ project }: ProjectActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      startTransition(async () => {
        try {
          const result = await deleteProject(project.id);
          if (result?.error) {
            toast.error(result.error);
          } else {
            toast.success('Project deleted successfully.');
          }
        } catch (error) {
          toast.error('An unexpected error occurred.');
        }
      });
    }
  };

  const handleStatusUpdate = (status: string) => {
    const message = status === 'completed' ? 'Mark this project as completed?' : 'Cancel this project?';
    if (confirm(message)) {
      startTransition(async () => {
        try {
          const result = await updateProjectStatus(project.id, status);
          if (result?.success) {
            toast.success(`Project status updated to ${status}.`);
          } else {
            toast.error('Failed to update status.');
          }
        } catch (error) {
          toast.error('An error occurred.');
        }
      });
    }
  };

  return (
    <div className="space-y-3">
      <Link 
        href={`/dashboard/client/projects/${project.id}/edit`}
        className="block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
      >
        Edit Project
      </Link>

      {project.status === 'in_progress' && (
        <button 
          onClick={() => handleStatusUpdate('completed')}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          <CheckCircle size={18} />
          Mark as Completed
        </button>
      )}

      {(project.status === 'open' || project.status === 'in_progress') && (
        <button 
          onClick={() => handleStatusUpdate('cancelled')}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          <XCircle size={18} />
          Cancel Project
        </button>
      )}

      {project.status === 'cancelled' && (
        <button 
          onClick={handleDelete}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 size={18} />
          Delete Project
        </button>
      )}
    </div>
  );
}
