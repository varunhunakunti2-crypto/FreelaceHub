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
    <header className="h-16 border-b bg-card px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-xl font-semibold text-foreground lg:ml-0 ml-12">
        {getPageTitle()}
      </h1>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <SearchBar />
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-3 p-1 rounded-full hover:bg-accent transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {profile?.full_name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()}
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
              </div>
              
              <button
                onClick={() => {
                  router.push(`/dashboard/${profile?.role}/profile`);
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
              >
                <User size={16} className="mr-2" /> Profile
              </button>
              
              <button
                onClick={() => {
                  router.push(`/dashboard/${profile?.role}/settings`);
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
              >
                <Settings size={16} className="mr-2" /> Settings
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
