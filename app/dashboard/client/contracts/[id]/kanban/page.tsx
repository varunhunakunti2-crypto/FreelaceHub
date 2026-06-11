import { createServerClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import KanbanBoard from '@/components/kanban/KanbanBoard';

interface KanbanPageProps {
  params: {
    id: string;
  };
}

export default async function KanbanPage({ params }: KanbanPageProps) {
  const supabase = createServerClient();
  const { id: contractId } = params;

  // 1. Fetch Contract & verify access
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .select(`
      *,
      project:projects(title)
    `)
    .eq('id', contractId)
    .single();

  if (contractError || !contract) {
    notFound();
  }

  // 2. Fetch Columns
  let { data: columns, error: columnsError } = await supabase
    .from('kanban_columns')
    .select('*')
    .eq('contract_id', contractId)
    .order('position', { ascending: true });

  if (columnsError) {
    console.error('Error fetching columns:', columnsError);
  }

  // 3. If no columns, create default ones
  if (!columns || columns.length === 0) {
    const defaultColumns = [
      { contract_id: contractId, title: 'To Do', position: 0 },
      { contract_id: contractId, title: 'In Progress', position: 1 },
      { contract_id: contractId, title: 'Review', position: 2 },
      { contract_id: contractId, title: 'Done', position: 3 },
    ];

    const { data: createdColumns, error: createError } = await supabase
      .from('kanban_columns')
      .insert(defaultColumns)
      .select();

    if (createError) {
      console.error('Error creating default columns:', createError);
    } else {
      columns = createdColumns;
    }
  }

  // 4. Fetch Tasks
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('contract_id', contractId)
    .order('position', { ascending: true });

  if (tasksError) {
    console.error('Error fetching tasks:', tasksError);
  }

  return (
    <div className="p-6 h-[calc(100vh-80px)] overflow-hidden">
      <KanbanBoard 
        contractId={contractId} 
        initialColumns={columns || []} 
        initialTasks={tasks || []} 
      />
    </div>
  );
}
