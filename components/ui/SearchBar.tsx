'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, User, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ projects: any[]; profiles: any[] }>({ projects: [], profiles: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        handleSearch();
      } else {
        setResults({ projects: [], profiles: [] });
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    setIsLoading(true);
    setIsOpen(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
          placeholder="Search projects, freelancers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (query.length >= 2) && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {results.projects.length === 0 && results.profiles.length === 0 && !isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No results found for "{query}"
              </div>
            ) : (
              <>
                {results.projects.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                      Projects
                    </h3>
                    {results.projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/dashboard/projects/${project.id}`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                      >
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 truncate">{project.title}</span>
                      </button>
                    ))}
                  </div>
                )}
                {results.profiles.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                      Users
                    </h3>
                    {results.profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/dashboard/profile/${profile.id}`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 truncate">{profile.full_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }}
            className="w-full bg-gray-50 px-4 py-2 text-sm font-medium text-primary hover:bg-gray-100 text-center border-t border-gray-200"
          >
            View all results
          </button>
        </div>
      )}
    </div>
  );
}
