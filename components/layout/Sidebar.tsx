'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Settings, 
  Search, 
  CheckSquare,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const sidebarLinks = {
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Projects', href: '/dashboard/admin/projects', icon: Briefcase },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
  client: [
    { name: 'Dashboard', href: '/dashboard/client', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/client/projects', icon: Briefcase },
    { name: 'Proposals', href: '/dashboard/client/proposals', icon: FileText },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  ],
  freelancer: [
    { name: 'Dashboard', href: '/dashboard/freelancer', icon: LayoutDashboard },
    { name: 'Browse', href: '/dashboard/freelancer/browse', icon: Search },
    { name: 'My Proposals', href: '/dashboard/freelancer/proposals', icon: FileText },
    { name: 'Active Jobs', href: '/dashboard/freelancer/contracts', icon: CheckSquare },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  ]
};

export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const role = profile?.role || 'freelancer';
  const links = sidebarLinks[role as keyof typeof sidebarLinks] || [];

  const handleLogout = async () => {
    // Clear cookies manually to be safe
    document.cookie = "user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-xl shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-card border-r flex flex-col shadow-sm",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:scale-110 transition-transform p-1">
                <img src="/mailchimp.svg" alt="Mailchimp Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight">FreelanceHub</span>
            </Link>
          )}
          <button 
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors ml-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center p-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <link.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="font-semibold text-sm">{link.name}</span>}
                {isActive && !isCollapsed && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t bg-secondary/30 mt-auto">
          <div className={cn(
            "flex items-center p-2 rounded-xl transition-all",
            isCollapsed ? "justify-center" : "space-x-3"
          )}>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                profile?.full_name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate leading-none mb-1">{profile?.full_name || 'User'}</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-wider">{profile?.role}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={cn(
              "w-full mt-3 flex items-center p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors group",
              isCollapsed ? "justify-center" : "px-3"
            )}
          >
            <LogOut className={cn("h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
