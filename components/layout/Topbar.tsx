'use client';

import { usePathname } from 'next/navigation';
import { Moon, Sun, User, Settings, LogOut } from 'lucide-react';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useUser } from '@/lib/context/UserContext';
import NotificationBell from '../notifications/NotificationBell';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import SearchBar from '../ui/SearchBar';

export default function Topbar() {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { profile } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Simple title generator from pathname
  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Dashboard';
    
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="h-20 border-b bg-background/80 backdrop-blur-md px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-8 flex-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground lg:ml-0 ml-12 shrink-0">
          {getPageTitle()}
        </h1>

        <div className="hidden md:flex flex-1 max-w-lg">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center space-x-3 lg:space-x-5">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-all active:scale-90"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="p-0.5">
          <NotificationBell />
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-3 p-1.5 rounded-2xl hover:bg-secondary transition-all active:scale-95 border border-transparent hover:border-border/50"
          >
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-md shadow-primary/20 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                profile?.full_name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden sm:block text-left mr-1">
               <p className="text-sm font-bold leading-none">{profile?.full_name?.split(' ')[0]}</p>
               <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">{profile?.role}</p>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-card border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-sm font-bold truncate">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
              </div>
              
              <div className="p-1.5 space-y-1">
                <button
                  onClick={() => {
                    router.push(`/dashboard/${profile?.role}/profile`);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-colors"
                >
                  <User size={16} className="mr-3 text-muted-foreground" /> Profile
                </button>
                
                <button
                  onClick={() => {
                    router.push(`/dashboard/${profile?.role}/settings`);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-colors"
                >
                  <Settings size={16} className="mr-3 text-muted-foreground" /> Settings
                </button>
              </div>
              
              <div className="p-1.5 border-t border-border/50 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                >
                  <LogOut size={16} className="mr-3" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
