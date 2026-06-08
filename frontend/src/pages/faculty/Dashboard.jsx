import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  ClipboardList, 
  Clock, 
  RotateCw, 
  CheckCircle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

const FacultyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await API.get('/api/faculty/dashboard');
        setStats(response.data || {
          totalComplaints: 0,
          pendingComplaints: 0,
          inProgressComplaints: 0,
          resolvedComplaints: 0,
        });
      } catch (error) {
        console.error('Error fetching faculty dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      label: 'Total Complaints',
      value: stats.totalComplaints,
      icon: ClipboardList,
      color: 'bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    },
    {
      label: 'Pending Complaints',
      value: stats.pendingComplaints,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    },
    {
      label: 'In Progress',
      value: stats.inProgressComplaints,
      icon: RotateCw,
      color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    },
    {
      label: 'Resolved',
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    },
  ];

  // Recharts Data Mapping
  const chartData = [
    { name: 'Pending', value: stats.pendingComplaints, color: '#F59E0B' },
    { name: 'In Progress', value: stats.inProgressComplaints, color: '#2563EB' },
    { name: 'Resolved', value: stats.resolvedComplaints, color: '#22C55E' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Panel */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl tracking-tight">Faculty Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time complaint statistics and overview metrics</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{card.label}</p>
                  {loading ? (
                    <div className="mt-2.5 h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  ) : (
                    <h3 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{card.value}</h3>
                  )}
                </div>
                <div className={`rounded-xl p-3 shadow-inner ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Card */}
        <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              Complaint Status Ratio
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Distribution breakdown of campus tickets</p>
          </div>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {loading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : stats.totalComplaints === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">No data available to plot chart.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--tooltip-text)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ClipboardList className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              Detailed Status Count
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Comparison of absolute complaints volume</p>
          </div>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {loading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : stats.totalComplaints === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">No data available to plot chart.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: '700', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: '700', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
                    contentStyle={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--tooltip-text)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
