'use client';

import React, { useState, useTransition } from 'react';
import { createProject } from '@/app/dashboard/client/actions';
import { ChevronLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function NewProjectPage() {
  const [isPending, startTransition] = useTransition();
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (formData: FormData) => {
    // Add skills to formData as a comma-separated string
    formData.append('skills_required', skills.join(','));
    
    startTransition(async () => {
      try {
        const result = await createProject(formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error('An unexpected error occurred.');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        href="/dashboard/client/projects"
        className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Projects
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Post a New Project</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Fill out the details below to find the perfect freelancer.</p>
        </div>

        <form action={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g. Build a Modern E-commerce Website"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                placeholder="Describe your project in detail..."
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all appearance-none"
              >
                <option value="">Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="Writing & Translation">Writing & Translation</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Business & Finance">Business & Finance</option>
              </select>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Skills Required (Press Enter to add)
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  id="skills"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="e.g. React, Node.js, UI/UX"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                />
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-800"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-indigo-800 dark:hover:text-indigo-200 font-bold">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info size={18} className="text-indigo-600" />
              Budget & Deadline
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="budget_min" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Min Budget ($)
                </label>
                <input
                  type="number"
                  id="budget_min"
                  name="budget_min"
                  required
                  min="0"
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="budget_max" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Max Budget ($)
                </label>
                <input
                  type="number"
                  id="budget_max"
                  name="budget_max"
                  required
                  min="0"
                  placeholder="e.g. 2000"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Project Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/dashboard/client/projects"
              className="px-6 py-2.5 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? 'Posting...' : 'Post Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
