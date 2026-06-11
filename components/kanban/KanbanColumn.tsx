'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Circle } from 'lucide-react';
import { Database } from '@/types/database';
import KanbanCard from './KanbanCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type KanbanColumn = Database['public']['Tables']['kanban_columns']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: Task[];
  onAddTask: (columnId: string, columnTitle: string) => void;
  onTaskClick: (task: Task) => void;
}

export default function KanbanColumn({ column, tasks, onAddTask, onTaskClick }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-80 min-w-[320px] h-full bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 dark:text-white">{column.title}</h3>
          <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onAddTask(column.id, column.title)}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
          >
            <Plus size={18} />
          </button>
          <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 p-3 min-h-[150px] transition-colors overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-hide',
              snapshot.isDraggingOver && 'bg-indigo-50/50 dark:bg-indigo-900/10'
            )}
          >
            {tasks.map((task, index) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                index={index} 
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2">
                <Circle size={20} strokeWidth={1} />
                <p className="text-xs font-medium">No tasks yet</p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      <div className="p-3 mt-auto">
        <button
          onClick={() => onAddTask(column.id, column.title)}
          className="w-full py-2 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>
    </div>
  );
}
