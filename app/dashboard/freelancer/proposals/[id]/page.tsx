'use client';

import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Clock, 
  DollarSign, 
  FileText, 
  MessageSquare, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Building2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

const mockProposals: Record<string, any> = {
  '1': {
    id: 1,
    projectTitle: 'E-commerce Platform Redesign',
    client: 'Urban Outfitters',
    bidAmount: '$4,500',
    status: 'Pending',
    submittedAt: 'May 15, 2026',
    coverLetter: "I have over 5 years of experience in e-commerce redesigns. I've worked with brands like Urban Outfitters before through third-party agencies and understand your aesthetic and technical requirements. My approach focuses on improving conversion rates by 20% while maintaining the unique brand identity.",
    milestones: [
      { name: 'UI/UX Discovery & Wireframes', amount: '$1,500' },
      { name: 'High-Fidelity Design', amount: '$1,500' },
      { name: 'Front-end Development', amount: '$1,500' }
    ]
  },
  '2': {
    id: 2,
    projectTitle: 'SaaS Dashboard Components',
    client: 'DataFlow Systems',
    bidAmount: '$75/hr',
    status: 'Shortlisted',
    submittedAt: 'June 2, 2026',
    clientMessage: 'Interested in a technical interview.',
    coverLetter: "I specialize in building modular React components for SaaS products. I have a library of pre-built accessible components that can speed up your development cycle by 40%. I'd love to discuss how I can help DataFlow achieve its performance goals.",
    milestones: [
      { name: 'Component Library Audit', amount: '$75/hr' },
      { name: 'Core Dashboard Refactor', amount: '$75/hr' }
    ]
  },
  '3': {
    id: 3,
    projectTitle: 'Marketing Landing Page',
    client: 'FreshBite Delivery',
    bidAmount: '$1,200',
    status: 'Declined',
    submittedAt: 'April 20, 2026',
    clientMessage: 'Position filled by another candidate.',
    coverLetter: "I can deliver a high-converting landing page in 48 hours. I've built dozens of these for food delivery startups and know exactly what works for this industry.",
    milestones: [
      { name: 'Full Delivery', amount: '$1,200' }
    ]
  }
};

const statusColors = {
  Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Shortlisted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Declined: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
};

export default function ProposalDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const proposal = mockProposals[id] || mockProposals['1'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-8 px-4">
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/freelancer/proposals"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold"
        >
          <ChevronLeft size={20} />
          Back to Proposals
        </Link>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${statusColors[proposal.status as keyof typeof statusColors]}`}>
            {proposal.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 md:p-10 rounded-[2.5rem] space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{proposal.projectTitle}</h1>
              <div className="flex items-center gap-4 text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <Building2 size={18} className="text-primary" />
                  {proposal.client}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={18} className="text-primary" />
                  Submitted {proposal.submittedAt}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold border-b border-border/50 pb-2">Cover Letter</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {proposal.coverLetter}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold border-b border-border/50 pb-2">Proposed Milestones</h2>
              <div className="space-y-3">
                {proposal.milestones.map((m: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-secondary/30 border border-border/50">
                    <span className="font-bold text-sm">{m.name}</span>
                    <span className="font-black text-primary">{m.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {proposal.clientMessage && (
            <div className="glass-card p-8 rounded-[2.5rem] bg-emerald-500/5 border-emerald-500/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <MessageSquare size={20} />
                <h2 className="text-xl font-bold">Message from Client</h2>
              </div>
              <p className="text-emerald-800 dark:text-emerald-200 font-medium leading-relaxed">
                "{proposal.clientMessage}"
              </p>
              {proposal.status === 'Shortlisted' && (
                <button className="w-full mt-4 bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all">
                  Schedule Interview
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
            <div className="text-center space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Bid</p>
              <h2 className="text-4xl font-black tracking-tight text-primary">{proposal.bidAmount}</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]">
                <ExternalLink size={20} />
                View Original Job
              </button>
              <Link 
                href="/dashboard/messages"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-secondary font-bold text-sm hover:bg-secondary/80 transition-all"
              >
                <MessageSquare size={20} />
                Contact Client
              </Link>
            </div>
            
            <div className="pt-6 border-t border-border/50 text-center">
              <button className="text-sm font-bold text-rose-500 hover:underline">
                Withdraw Proposal
              </button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-[2rem] space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <AlertCircle size={18} className="text-primary" />
              Application Tips
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium list-disc pl-4">
              <li>Client usually responds within 48 hours.</li>
              <li>Keep your portfolio link up to date.</li>
              <li>Shortlisted freelancers are 5x more likely to be hired.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
