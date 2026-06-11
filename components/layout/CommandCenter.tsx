'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Command, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Settings, 
  User, 
  Plus, 
  ArrowRight,
  CreditCard,
  Briefcase,
  X,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  category: 'Navigation' | 'Actions' | 'Recently Viewed';
}

export default function CommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    { id: 'dash', title: 'Go to Dashboard', subtitle: 'Overview of your active projects', icon: LayoutDashboard, href: '/dashboard/freelancer', category: 'Navigation' },
    { id: 'msg', title: 'Open Messages', subtitle: 'Chat with Urban Outfitters', icon: MessageSquare, href: '/dashboard/messages', category: 'Navigation' },
    { id: 'pay', title: 'View Payments', subtitle: 'Check your balance and payouts', icon: CreditCard, href: '/dashboard/payments', category: 'Navigation' },
    { id: 'browse', title: 'Browse New Projects', subtitle: 'Find your next big gig', icon: Search, href: '/dashboard/freelancer/browse', category: 'Navigation' },
    { id: 'task', title: 'Create New Task', subtitle: 'Add a task to your current board', icon: Plus, action: () => router.push('/dashboard/freelancer/contracts/c1/kanban'), category: 'Actions' },
    { id: 'profile', title: 'Edit Public Profile', subtitle: 'Update your skills and rate', icon: User, href: '/dashboard/freelancer/profile', category: 'Navigation' },
    { id: 'settings', title: 'Account Settings', subtitle: 'Manage security and notifications', icon: Settings, href: '/dashboard/freelancer/settings', category: 'Navigation' },
    { id: 'inv-1', title: 'Invoice inv-001', subtitle: 'E-commerce Redesign • Paid', icon: FileText, href: '/dashboard/invoices/inv-001', category: 'Recently Viewed' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (cmd: CommandItem) => {
    if (cmd.href) router.push(cmd.href);
    if (cmd.action) cmd.action();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-top-4 duration-300">
        {/* Search Bar */}
        <div className="flex items-center px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <Search className="text-primary mr-4" size={24} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xl font-bold dark:text-white placeholder:text-slate-400"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
              }
              if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
                handleSelect(filteredCommands[selectedIndex]);
              }
            }}
          />
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm text-slate-400">
            <span className="text-[10px] font-black tracking-widest uppercase">ESC</span>
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {filteredCommands.length > 0 ? (
            <div className="space-y-6">
              {['Navigation', 'Actions', 'Recently Viewed'].map((category) => {
                const catCmds = filteredCommands.filter(c => c.category === category);
                if (catCmds.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {category}
                    </p>
                    {catCmds.map((cmd) => {
                      const globalIndex = filteredCommands.indexOf(cmd);
                      const isSelected = selectedIndex === globalIndex;

                      return (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                            isSelected 
                              ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]" 
                              : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          )}
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className={cn(
                              "p-2.5 rounded-xl transition-colors",
                              isSelected ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                              <cmd.icon size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-sm leading-tight">{cmd.title}</p>
                              <p className={cn(
                                "text-xs font-medium mt-0.5",
                                isSelected ? "text-primary-foreground/70" : "text-slate-400"
                              )}>{cmd.subtitle}</p>
                            </div>
                          </div>
                          {isSelected && <ArrowRight size={18} className="animate-in slide-in-from-left-2" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto">
                 <Zap size={32} className="text-slate-300" />
               </div>
               <div className="space-y-1">
                 <p className="font-black text-slate-900 dark:text-white">No results found</p>
                 <p className="text-sm text-slate-400 font-medium">Try searching for "Messages" or "Dashboard"</p>
               </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded-md border dark:border-slate-700 bg-white dark:bg-slate-800">↑↓</span> Navigate</span>
            <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded-md border dark:border-slate-700 bg-white dark:bg-slate-800">Enter</span> Select</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            <Command size={10} /> Powered by Spotlight
          </div>
        </div>
      </div>
    </div>
  );
}
