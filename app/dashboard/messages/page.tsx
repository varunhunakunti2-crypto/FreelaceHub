import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MessagesClient from './MessagesClient';

export const metadata = {
  title: 'Messages | FreelancePlatform',
};

export default async function MessagesPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden">
      <MessagesClient userId={session.user.id} />
    </div>
  );
}
