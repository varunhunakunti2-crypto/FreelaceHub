'use client';

import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  MessageSquare, 
  Calendar,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function ContractDetailPage() {
  const { id } = useParams();

  // Mock data for the specific contract
  const contract = {
    id,
    title: 'E-commerce Redesign',
    client: 'Urban Outfitters',
    status: 'Active',
    startDate: '2026-05-01',
    agreedAmount: 4500,
    paidAmount: 1500,
    category: 'Design',
    description: 'Complete overhaul of the mobile shopping experience, focusing on conversion optimization and brand alignment.',
    milestones: [
      { id: 1, title: 'Discovery & Wireframes', status: 'Completed', amount: 1500, dueDate: '2026-05-15' },
      { id: 2, title: 'UI Design Phase', status: 'In Progress', amount: 1500, dueDate: '2026-06-15' },
      { id: 3, title: 'Final Handover', status: 'Pending', amount: 1500, dueDate: '2026-07-01' },
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link 
        href="/dashboard/freelancer/contracts" 
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ChevronLeft size={16} />
        Back to Active Jobs
      </Link>

      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              {contract.status}
            </span>
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{contract.category}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{contract.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">{contract.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full lg:w-80">
          <div className="glass-card p-6 rounded-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Value</p>
            <p className="text-xl font-black">{formatCurrency(contract.agreedAmount)}</p>
          </div>
          <div className="glass-card p-6 rounded-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Received</p>
            <p className="text-xl font-black text-emerald-600">{formatCurrency(contract.paidAmount)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        <div className="lg:col-span-8 space-y-6">
          <h2 className="section-title">Project Milestones</h2>
          <div className="space-y-4">
            {contract.milestones.map((milestone) => (
              <div key={milestone.id} className="glass-card p-6 rounded-[2rem] flex items-center justify-between gap-6 border-transparent hover:border-border/50">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    milestone.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                    milestone.status === 'In Progress' ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {milestone.status === 'Completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{milestone.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {milestone.dueDate}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14} /> {formatCurrency(milestone.amount)}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                    milestone.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' : 
                    milestone.status === 'In Progress' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {milestone.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <h2 className="section-title">Client Context</h2>
          <div className="glass-card p-8 rounded-[2rem] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl border border-primary/20">
                {contract.client.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{contract.client}</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Enterprise Client</p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                <MessageSquare size={18} />
                Contact Client
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-secondary text-foreground py-4 rounded-2xl font-bold hover:bg-secondary/80 transition-all">
                <FileText size={18} />
                View Full Contract
              </button>
            </div>
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs font-medium leading-relaxed">Next milestone payment of <span className="font-bold">{formatCurrency(1500)}</span> is due on June 15th.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
