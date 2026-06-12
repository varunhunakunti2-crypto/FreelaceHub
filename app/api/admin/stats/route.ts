import { createRouteClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { startOfMonth, subMonths, addMonths, format } from 'date-fns';

export const runtime = 'edge';

export async function GET() {
  const supabase = createRouteClient();
  const adminSupabase = createAdminClient();

  // Check if user is admin
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data: profile } = await (supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single() as any);

  if (profile?.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    // 1. Basic Stats
    const [
      { count: totalUsers },
      { count: totalProjects },
      { count: activeContracts },
      { data: paymentsData },
    ] = await Promise.all([
      adminSupabase.from('profiles').select('*', { count: 'exact', head: true }),
      adminSupabase.from('projects').select('*', { count: 'exact', head: true }),
      adminSupabase.from('contracts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      adminSupabase.from('payments').select('amount, created_at').eq('status', 'completed') as any,
    ]);

    const totalRevenue = (paymentsData as any[])?.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;

    // 2. Revenue Chart (Last 6 months)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, 'MMM'),
        timestamp: startOfMonth(date),
        revenue: 0,
      };
    }).reverse();

    paymentsData?.forEach((payment: any) => {
      const paymentDate = new Date(payment.created_at);
      const monthStr = format(paymentDate, 'MMM');
      const monthData = last6Months.find((m) => m.month === monthStr);
      if (monthData) {
        monthData.revenue += Number(payment.amount);
      }
    });

    // 3. User Growth Chart (Last 6 months)
    const { data: usersData } = await adminSupabase
      .from('profiles')
      .select('created_at');

    const userGrowth = last6Months.map((m) => {
      const start = m.timestamp;
      const end = addMonths(start, 1);
      const count = usersData?.filter((u) => {
        const userDate = new Date(u.created_at);
        return userDate >= start && userDate < end;
      }).length || 0;
      return {
        month: m.month,
        users: count,
      };
    });

    // 4. Project Stats Chart (Pie Chart)
    const { data: projectsStatusData } = await adminSupabase
      .from('projects')
      .select('status');

    const statusCounts = projectsStatusData?.reduce((acc: any, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    const projectStats = Object.entries(statusCounts || {}).map(([name, value]) => ({
      name: name
        .split(/[_\s]+/)
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
        .join(' '),
      value,
    }));

    // 5. Recent Activity
    const { data: recentProjects } = await adminSupabase
      .from('projects')
      .select('id, title, created_at, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentActivity = recentProjects?.map((p: any) => ({
      id: p.id,
      type: 'project',
      message: `New project "${p.title}" posted by ${p.profiles?.full_name || 'Anonymous'}`,
      timestamp: p.created_at,
    })) || [];

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProjects,
        totalRevenue,
        activeContracts,
      },
      revenueData: last6Months.map(({ month, revenue }) => ({ month, revenue })),
      userGrowthData: userGrowth,
      projectStatsData: projectStats,
      recentActivity,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
