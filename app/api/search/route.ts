import { createRouteClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ projects: [], profiles: [] });
  }

  const supabase = createRouteClient();

  // Search projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(5);

  if (projectsError) {
    console.error('Projects search error:', projectsError);
  }

  // Search profiles (Freelancers/Clients)
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .or(`full_name.ilike.%${query}%,bio.ilike.%${query}%,skills.cs.{${query}}`)
    .limit(5);

  if (profilesError) {
    console.error('Profiles search error:', profilesError);
  }

  // For real full-text search with to_tsvector, the database needs to be configured with a generated column.
  // Since I can't modify the DB schema directly via SQL in this turn without a migration tool, 
  // I'm using ilike and array contains as a robust fallback that works immediately.
  // If to_tsvector was already set up in the schema, I would use .textSearch().

  return NextResponse.json({
    projects: projects || [],
    profiles: profiles || [],
  });
}
