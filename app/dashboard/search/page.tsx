import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { Search, User, Briefcase, MapPin, Tag } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const supabase = createServerClient();

  // Search projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*, profiles(full_name, avatar_url)')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  // Search profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .or(`full_name.ilike.%${query}%,bio.ilike.%${query}%,skills.cs.{${query}}`)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Search className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
          <p className="text-gray-500">
            Showing results for <span className="font-medium text-gray-900">"{query}"</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Projects ({projects?.length || 0})</span>
            </h2>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project: any) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="block p-6 bg-white border rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills_required?.map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                        {project.profiles?.avatar_url && (
                          <img src={project.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span>{project.profiles?.full_name}</span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${project.budget_min} - ${project.budget_max}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No projects found"
              description="Try modifying your search terms or removing filters to discover projects."
            />
          )}
        </div>

        {/* Profiles Column */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Freelancers & Clients ({profiles?.length || 0})</span>
          </h2>

          {profiles && profiles.length > 0 ? (
            <div className="space-y-4">
              {profiles.map((profile: any) => (
                <Link
                  key={profile.id}
                  href={`/dashboard/profile/${profile.id}`}
                  className="block p-4 bg-white border rounded-xl hover:shadow-md transition-shadow flex items-center space-x-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {profile.full_name}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
                    {profile.location && (
                      <p className="text-xs text-gray-400 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {profile.location}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={User}
              title="No profiles found"
              description="No freelancers or clients matched your search. Try broadening your search terms."
            />
          )}
        </div>
      </div>
    </div>
  );
}
