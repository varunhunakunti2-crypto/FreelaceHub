'use client';

import React, { useState } from 'react';
import { Send, FileText, CheckCircle2 } from 'lucide-react';
import ProposalForm from '@/components/dashboard/ProposalForm';

interface ApplyButtonProps {
  projectId: string;
  projectTitle: string;
  hasSubmitted: boolean;
  defaultBid: string;
}

export default function ApplyButton({ projectId, projectTitle, hasSubmitted, defaultBid }: ApplyButtonProps) {
  const [showForm, setShowForm] = useState(false);

  if (hasSubmitted) {
    return (
      <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 py-4 px-6 rounded-2xl font-black text-center border border-emerald-100 dark:border-emerald-800 flex items-center justify-center gap-2">
        <CheckCircle2 size={20} />
        Proposal Submitted
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={() => setShowForm(true)}
        className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
      >
        <Send size={24} />
        Submit a Proposal
      </button>

      {showForm && (
        <ProposalForm 
          projectId={projectId} 
          projectTitle={projectTitle} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </>
  );
}
