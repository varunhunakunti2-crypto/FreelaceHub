'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, Loader2, Send, DollarSign, Clock } from 'lucide-react';
import { submitProposal } from '@/app/dashboard/freelancer/actions';
import toast from 'react-hot-toast';

interface ProposalFormProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

export default function ProposalForm({ projectId, projectTitle, onClose }: ProposalFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coverLetter.trim() || !bidAmount || !estimatedDays) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      const result = await submitProposal({
        projectId,
        coverLetter,
        bidAmount: parseFloat(bidAmount),
        estimatedDays: parseInt(estimatedDays),
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Proposal submitted successfully!');
        onClose();
      }
    } catch (error: any) {
      console.error('Error submitting proposal:', error);
      toast.error(error.message || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Submit Proposal</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{projectTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-indigo-500" />
                Your Bid Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-indigo-500" />
                Estimated Time (Days)
              </label>
              <input
                type="number"
                required
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                placeholder="e.g. 7"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Cover Letter
            </label>
            <textarea
              required
              rows={8}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all resize-none"
              placeholder="Describe why you are the best fit for this project..."
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
