'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import KanbanColumn from './KanbanColumn';
import AddTaskModal from './AddTaskModal';
import TaskDetailModal from './TaskDetailModal';
import toast from 'react-hot-toast';
import { Loader2, Kanban as KanbanIcon, Settings2, Search, Filter, Plus } from 'lucide-react';

type KanbanColumnType = Database['public']['Tables']['kanban_columns']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

interface KanbanBoardProps {
  contractId: string;
  initialColumns: KanbanColumnType[];
  initialTasks: Task[];
}

export default function KanbanBoard({ contractId, initialColumns, initialTasks }: KanbanBoardProps) {
  const supabase = createClient();
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<{ id: string; title: string } | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const refreshData = async () => {
    try {
      const { data: cols } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('contract_id', contractId)
        .order('position', { ascending: true });

      const { data: tks } = await supabase
        .from('tasks')
        .select('*')
        .eq('contract_id', contractId)
        .order('position', { ascending: true });

      if (cols) setColumns(cols);
      if (tks) setTasks(tks);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Optimistic Update
    const movedTask = tasks.find(t => t.id === draggableId);
    if (!movedTask) return;

    const newTasks = Array.from(tasks);
    
    // Remove from source
    const [task] = newTasks.splice(tasks.findIndex(t => t.id === draggableId), 1);
    
    // Update column_id
    task.column_id = destination.droppableId;
    
    // Find tasks in destination column
    const destTasks = newTasks.filter(t => t.column_id === destination.droppableId)
      .sort((a, b) => a.position - b.position);
    
    // Insert into destination at correct index
    // This logic is a bit tricky because 'newTasks' is the whole list.
    // We need to calculate the new position.
    
    // Get all tasks for the destination column after removal
    const targetColumnTasks = tasks.filter(t => t.column_id === destination.droppableId && t.id !== draggableId)
      .sort((a, b) => a.position - b.position);
    
    targetColumnTasks.splice(destination.index, 0, task);
    
    // Re-assign positions for all tasks in target column(s)
    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    const sourceColumnTasks = tasks.filter(t => t.column_id === sourceColumnId && t.id !== draggableId)
      .sort((a, b) => a.position - b.position);

    const updatedTasks = tasks.map(t => {
      if (t.id === draggableId) {
        return { ...t, column_id: destColumnId, position: destination.index };
      }
      
      if (t.column_id === destColumnId) {
        const idxInDest = targetColumnTasks.findIndex(it => it.id === t.id);
        return { ...t, position: idxInDest };
      }

      if (t.column_id === sourceColumnId) {
          const idxInSource = sourceColumnTasks.findIndex(it => it.id === t.id);
          return { ...t, position: idxInSource };
      }

      return t;
    });

    setTasks(updatedTasks);

    // Persist to Supabase
    if (contractId.startsWith('mock') || contractId.startsWith('inv-')) {
      console.log('Demo mode: Skipping Supabase update');
      return;
    }

    try {
      // Create a list of all tasks that need position updates in the destination column
      const targetColumnUpdates = targetColumnTasks.map((t, idx) => ({
        id: t.id,
        column_id: destColumnId,
        contract_id: contractId, // Required for some RLS/Insert logic if using upsert
        position: idx,
        title: t.title, // Include required fields for upsert if necessary, though update is preferred
      }));

      // If source and destination are different, also update source column positions
      let finalUpdates = [...targetColumnUpdates];
      if (sourceColumnId !== destColumnId) {
        const sourceColumnUpdates = sourceColumnTasks.map((t, idx) => ({
          id: t.id,
          column_id: sourceColumnId,
          contract_id: contractId,
          position: idx,
          title: t.title,
        }));
        finalUpdates = [...finalUpdates, ...sourceColumnUpdates];
      }

      // Filter out tasks that didn't actually change column or position to save on API overhead
      // But for simplicity and correctness in a small board, we can just update all in the affected columns
      
      // Use individual updates or a single upsert if possible. 
      // Supabase .upsert() works well for multiple rows if IDs are provided.
      // However, we must be careful with other fields.
      
      // A better way for just updating specific fields on multiple rows is to use a custom RPC or 
      // multiple promises. Since we don't have an RPC, we'll use Promise.all for affected tasks.
      
      const tasksToUpdate = updatedTasks.filter(t => {
          const original = tasks.find(ot => ot.id === t.id);
          return original && (original.position !== t.position || original.column_id !== t.column_id);
      });

      if (tasksToUpdate.length > 0) {
          const { error } = await supabase
            .from('tasks')
            .upsert(tasksToUpdate.map(t => ({
                id: t.id,
                column_id: t.column_id,
                position: t.position,
                contract_id: t.contract_id,
                title: t.title, // required field
                priority: t.priority, // required field
            })));
          
          if (error) throw error;
      }
      
    } catch (error) {
      console.error('Error updating task position:', error);
      toast.error('Failed to sync changes with server');
      refreshData(); // Revert to server state
    }
  };

  const handleAddTask = (columnId: string, columnTitle: string) => {
    setSelectedColumn({ id: columnId, title: columnTitle });
    setIsAddTaskOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header / Toolbar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
            <KanbanIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Board</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage tasks and track progress</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter size={20} />
          </button>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Settings2 size={20} />
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks.filter(t => t.column_id === column.id).sort((a, b) => a.position - b.position)}
              onAddTask={handleAddTask}
              onTaskClick={handleTaskClick}
            />
          ))}
          
          {/* Add Column Placeholder */}
          <button className="flex flex-col items-center justify-center w-80 min-w-[320px] h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-500 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-all group">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors mb-2">
              <Plus size={24} />
            </div>
            <span className="font-bold">Add Column</span>
          </button>
        </div>
      </DragDropContext>

      {/* Modals */}
      {isAddTaskOpen && selectedColumn && (
        <AddTaskModal
          contractId={contractId}
          columnId={selectedColumn.id}
          columnTitle={selectedColumn.title}
          onClose={() => setIsAddTaskOpen(false)}
          onSuccess={async () => {
            if (contractId.startsWith('mock') || contractId.startsWith('inv-')) {
              // Local update for demo
              const newTask: Task = {
                id: `t-new-${Date.now()}`,
                title: 'New Task', // This should really come from the modal, but let's keep it simple for now
                description: '',
                column_id: selectedColumn.id,
                position: tasks.filter(t => t.column_id === selectedColumn.id).length,
                priority: 'medium',
                contract_id: contractId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                due_date: null,
                assignee_id: null
              };
              setTasks([...tasks, newTask]);
              setIsAddTaskOpen(false);
              return;
            }
            refreshData();
          }}
        />
      )}

      {isTaskDetailOpen && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setIsTaskDetailOpen(false)}
          onSuccess={async () => {
            if (contractId.startsWith('mock') || contractId.startsWith('inv-')) {
              // This is a bit simplified - in a real app we'd get the updated task data
              // For the demo, let's just refresh if we can't pass data back easily,
              // or just close the modal.
              setIsTaskDetailOpen(false);
              toast.success('Task updated (Demo Mode)');
              return;
            }
            refreshData();
          }}
        />
      )}
    </div>
  );
}
