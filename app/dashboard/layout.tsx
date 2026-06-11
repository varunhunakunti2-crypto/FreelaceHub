import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserProvider, UserProfile } from '@/lib/context/UserContext';
import CommandCenter from '@/components/layout/CommandCenter';
import ClickRipple from '@/components/ui/ClickRipple';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile) {
    // If no profile exists, we might want to redirect to a profile completion page
    // but for now, let's just go to login to be safe
    redirect('/login');
  }

  return (
    <UserProvider user={session.user} profile={profile as UserProfile} loading={false}>
      <CommandCenter />
      <ClickRipple />
      <DashboardLayout>
        <div className="relative z-10">
          {children}
        </div>
      </DashboardLayout>
    </UserProvider>
  );
}
