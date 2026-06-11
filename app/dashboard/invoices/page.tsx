'use client';

import { FileText, Download, Filter, Search, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

const mockInvoices = [
  {
    id: 'inv-001',
    project: 'E-commerce Redesign',
    client: 'Urban Outfitters',
    amount: 1500,
    status: 'Paid',
    date: '2026-05-15',
    dueDate: '2026-05-20'
  },
  {
    id: 'inv-002',
    project: 'Next.js API Integration',
    client: 'TechVision Inc.',
    amount: 3200,
    status: 'Pending',
    date: '2026-06-05',
    dueDate: '2026-06-15'
  },
  {
    id: 'inv-003',
    project: 'Brand Identity',
    client: 'Global Logistics',
    amount: 2500,
    status: 'Overdue',
    date: '2026-04-10',
    dueDate: '2026-04-20'
  },
  {
    id: 'inv-004',
    project: 'Mobile App Wireframes',
    client: 'HealthFlow',
    amount: 1200,
    status: 'Paid',
    date: '2026-05-20',
    dueDate: '2026-05-25'
  },
  {
    id: 'inv-005',
    project: 'SEO Optimization',
    client: 'Organic Greens',
    amount: 800,
    status: 'Pending',
    date: '2026-06-01',
    dueDate: '2026-06-10'
  },
  {
    id: 'inv-006',
    project: 'Social Media Assets',
    client: 'SnapSync',
    amount: 600,
    status: 'Paid',
    date: '2026-05-10',
    dueDate: '2026-05-15'
  },
  {
    id: 'inv-007',
    project: 'Landing Page Dev',
    client: 'LaunchPad',
    amount: 2000,
    status: 'Pending',
    date: '2026-06-02',
    dueDate: '2026-06-08'
  },
  {
    id: 'inv-008',
    project: 'Copywriting Services',
    client: 'WordSmith',
    amount: 450,
    status: 'Overdue',
    date: '2026-04-25',
    dueDate: '2026-05-01'
  },
  {
    id: 'inv-009',
    project: 'React Native App',
    client: 'FinTrack',
    amount: 5000,
    status: 'Pending',
    date: '2026-06-04',
    dueDate: '2026-06-20'
  },
  {
    id: 'inv-010',
    project: 'Database Migration',
    client: 'DataKeep',
    amount: 1800,
    status: 'Paid',
    date: '2026-05-28',
    dueDate: '2026-06-02'
  }
];

const statusStyles = {
  Paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Overdue: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
};

export default function InvoicesPage() {
  const handleExport = () => {
    const headers = ['Invoice ID', 'Project', 'Client', 'Amount', 'Status', 'Date', 'Due Date'];
    const csvContent = [
      headers.join(','),
      ...mockInvoices.map(inv => [
        inv.id,
        `"${inv.project}"`,
        `"${inv.client}"`,
        inv.amount,
        inv.status,
        inv.date,
        inv.dueDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage your billings and track payment status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-secondary transition-all font-bold text-sm"
          >
            <Download size={18} />
            Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border-transparent bg-emerald-500/5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Paid</p>
          <p className="text-3xl font-black text-emerald-600">{formatCurrency(1500)}</p>
        </div>
        <div className="glass-card p-6 rounded-3xl border-transparent bg-amber-500/5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Pending</p>
          <p className="text-3xl font-black text-amber-600">{formatCurrency(3200)}</p>
        </div>
        <div className="glass-card p-6 rounded-3xl border-transparent bg-rose-500/5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Overdue</p>
          <p className="text-3xl font-black text-rose-600">{formatCurrency(2500)}</p>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border-border/50">
        <div className="p-6 border-b border-border/50 bg-secondary/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border">
              <Filter size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-secondary/10">
                <th className="px-8 py-4">Invoice ID</th>
                <th className="px-8 py-4">Project & Client</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Due Date</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockInvoices.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className="hover:bg-primary/5 transition-colors group cursor-pointer"
                  onClick={() => window.location.href = `/dashboard/invoices/${invoice.id}`}
                >
                  <td className="px-8 py-6 font-bold text-sm">
                    <Link href={`/dashboard/invoices/${invoice.id}`} onClick={(e) => e.stopPropagation()}>
                      {invoice.id}
                    </Link>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-base leading-none mb-1 group-hover:text-primary transition-colors">{invoice.project}</p>
                    <p className="text-xs text-muted-foreground font-medium">{invoice.client}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-lg font-black tracking-tight">{formatCurrency(invoice.amount)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusStyles[invoice.status as keyof typeof statusStyles]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock size={14} />
                      {invoice.dueDate}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <Link 
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
