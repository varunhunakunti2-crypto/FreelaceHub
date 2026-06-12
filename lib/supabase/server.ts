import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const createServerClient = () => {
  const { cookies } = require('next/headers');
  return createServerComponentClient<Database>({
    cookies,
  });
};

export const createActionClient = () => {
  const { cookies } = require('next/headers');
  return createServerComponentClient<Database>({
    cookies,
  });
};

export const createRouteClient = () => {
  const { cookies } = require('next/headers');
  return createRouteHandlerClient<Database>({
    cookies,
  });
};

export const createAdminClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
