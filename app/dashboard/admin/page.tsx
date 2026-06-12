'use client';

import { useEffect, useState } from 'react';
import { Users, Briefcase, DollarSign, Activity, ChevronRight } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RevenueChart from '@/components/charts/RevenueChart';
import UserGrowthChart from '@/components/charts/UserGrowthChart';
import ProjectStatsChart from '@/components/charts/ProjectStatsChart';
import { formatDistanceToNow } from 'date-fns';

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) {
          const text = await res.text();
          setError(text || 'Failed to fetch admin stats');
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-950 text-red-200">
        <p className="text-lg font-semibold">Unable to load admin stats</p>
        <p className="mt-2 text-sm text-red-300">{error}</p>
      </div>
    );
  }

  if (!data) return <div>Failed to load data.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={data.stats.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-500" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Projects"
          value={data.stats.totalProjects}
          icon={<Briefcase className="h-6 w-6 text-purple-500" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${data.stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Active Contracts"
          value={data.stats.activeContracts}
          icon={<Activity className="h-6 w-6 text-orange-500" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Revenue Overview</h2>
          <RevenueChart data={data.revenueData} />
        </div>

        {/* User Growth Chart */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">User Growth</h2>
          <UserGrowthChart data={data.userGrowthData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Stats */}
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Project Status</h2>
          <ProjectStatsChart data={data.projectStatsData} />
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {(Array.isArray(data.recentActivity) ? data.recentActivity : []).map((activity: any) => {
              const activityDate = new Date(activity.timestamp);
              const timeText = !Number.isNaN(activityDate.getTime())
                ? formatDistanceToNow(activityDate, { addSuffix: true })
                : 'unknown time';

              return (
                <div
                  key={activity.id}
                  className="flex items-start justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-400">{timeText}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
