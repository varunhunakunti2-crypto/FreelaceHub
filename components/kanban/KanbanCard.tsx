'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, AlertCircle, Clock, User } from 'lucide-react';
import { Database } from '@/types/database';
import { format, isPast, isToday } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Task = Database['public']['Tables']['tasks']['Row'];

interface KanbanCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={cn(
            'group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-3 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-pointer',
            snapshot.isDragging && 'shadow-2xl ring-2 ring-indigo-500 border-indigo-500 scale-[1.02]'
          )}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
              priorityColors[task.priority as keyof typeof priorityColors]
            )}>
              {task.priority}
            </span>
            {task.due_date && (
              <div className={cn(
                'flex items-center gap-1 text-[11px] font-medium',
                isOverdue ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'
              )}>
                <Clock size={12} />
                {format(new Date(task.due_date), 'MMM d')}
              </div>
            )}
          </div>

          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {task.title}
          </h3>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 dark:border-slate-700/50">
            <div className="flex -space-x-2">
              {task.assignee_id ? (
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 overflow-hidden">
                  <User size={12} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                  ?
                </div>
              )}
            </div>
            
            {task.description && (
              <div className="text-slate-400 dark:text-slate-600">
                <AlertCircle size={14} />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
