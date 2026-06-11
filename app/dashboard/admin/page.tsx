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

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
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
            {data.recentActivity.map((activity: any) => (
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
                    <p className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
