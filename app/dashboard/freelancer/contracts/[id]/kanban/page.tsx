'use client';

import { useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  Briefcase,
  Users,
  Calendar,
  Settings2,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import KanbanBoard from '@/components/kanban/KanbanBoard';

const mockContracts: Record<string, any> = {
  'c1': { id: 'c1', title: 'E-commerce Redesign', client: 'Urban Outfitters' },
  'inv-001': { id: 'inv-001', title: 'E-commerce Redesign', client: 'Urban Outfitters' },
  'inv-002': { id: 'inv-002', title: 'Next.js API Integration', client: 'TechVision Inc.' },
};

const mockColumns = [
  { id: 'col-1', title: 'To Do', position: 0, contract_id: 'mock' },
  { id: 'col-2', title: 'In Progress', position: 1, contract_id: 'mock' },
  { id: 'col-3', title: 'Review', position: 2, contract_id: 'mock' },
  { id: 'col-4', title: 'Done', position: 3, contract_id: 'mock' },
];

const mockTasks = [
  { id: 't1', title: 'Research competitors', description: 'Analyze top 5 e-commerce sites', column_id: 'col-1', position: 0, priority: 'medium', contract_id: 'mock', created_at: '', updated_at: '', due_date: null, assignee_id: null },
  { id: 't2', title: 'Design mobile homepage', description: 'Focus on conversion flow', column_id: 'col-2', position: 0, priority: 'high', contract_id: 'mock', created_at: '', updated_at: '', due_date: null, assignee_id: null },
  { id: 't3', title: 'Setup Supabase Auth', description: 'Implement Google login', column_id: 'col-2', position: 1, priority: 'high', contract_id: 'mock', created_at: '', updated_at: '', due_date: null, assignee_id: null },
  { id: 't4', title: 'Write API documentation', description: 'For frontend team', column_id: 'col-3', position: 0, priority: 'low', contract_id: 'mock', created_at: '', updated_at: '', due_date: null, assignee_id: null },
  { id: 't5', title: 'Fix CSS grid bugs', description: 'Safari specific issues', column_id: 'col-4', position: 0, priority: 'medium', contract_id: 'mock', created_at: '', updated_at: '', due_date: null, assignee_id: null },
];

export default function KanbanPage() {
  const params = useParams();
  const id = params.id as string;
  const contract = mockContracts[id] || mockContracts['c1'];

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-700">
      {/* Kanban Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link 
              href="/dashboard/freelancer/contracts"
              className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground"
            >
              <ChevronLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              <span className="text-sm font-bold text-muted-foreground">{contract.client}</span>
              <span className="text-sm font-bold text-muted-foreground">/</span>
              <h1 className="text-lg font-black tracking-tight">{contract.title}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="flex -space-x-3 mr-4">
              {[1, 2].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                  {i === 1 ? 'A' : 'U'}
                </div>
              ))}
              <button className="w-8 h-8 rounded-full border-2 border-background bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                +1
              </button>
           </div>
           <button className="p-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-all">
             <Share2 size={18} />
           </button>
           <button className="p-2.5 bg-secondary hover:bg-secondary/80 rounded-xl transition-all">
             <Settings2 size={18} />
           </button>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-hidden px-4 pb-4">
        <KanbanBoard 
          contractId={id} 
          initialColumns={mockColumns as any} 
          initialTasks={mockTasks as any} 
        />
      </div>
    </div>
  );
}
