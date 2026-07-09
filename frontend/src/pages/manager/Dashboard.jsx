import { useState, useEffect } from 'react';
import { managerAPI } from '../../services/api';
import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import {
  TasksTrendChart,
  SubmissionStatusChart,
  ProjectWorkloadChart,
} from '../../components/Charts';
import AIChatWidget from '../../components/AIChatWidget';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await managerAPI.getDashboard();
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching manager dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Reports',
      value: stats?.totalReports || 0,
      icon: HiOutlineDocumentText,
      color: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      border: 'border-indigo-100 dark:border-indigo-500/20',
    },
    {
      label: 'Submitted Reports',
      value: stats?.submittedReports || 0,
      icon: HiOutlineCheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-100 dark:border-emerald-500/20',
    },
    {
      label: 'Open Blockers',
      value: stats?.openBlockers || 0,
      icon: HiOutlineExclamation,
      color: 'from-red-500 to-red-600',
      bg: 'bg-red-50 dark:bg-red-500/10',
      border: 'border-red-100 dark:border-red-500/20',
    },
    {
      label: 'Team Members',
      value: stats?.totalMembers || 0,
      icon: HiOutlineUserGroup,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      border: 'border-purple-100 dark:border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Real-time team reporting metrics and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`${kpi.bg} ${kpi.border} border rounded-2xl p-5 hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg`}
              >
                <kpi.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Tasks Completed Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Tasks Completed Trend</h2>
          <div className="h-64">
            {stats?.reportsByWeek?.length > 0 ? (
              <TasksTrendChart data={stats.reportsByWeek} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-slate-600 text-sm">
                No submitted report trends available
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Submission Status */}
        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Submission Status</h2>
          <div className="h-64 flex items-center justify-center">
            {stats?.totalReports > 0 ? (
              <SubmissionStatusChart
                submitted={stats.submittedReports}
                pending={stats.pendingReports}
              />
            ) : (
              <div className="text-gray-400 dark:text-slate-600 text-sm">No report status data</div>
            )}
          </div>
        </div>

        {/* Chart 3: Project Workload */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Project Workload</h2>
          <div className="h-64">
            {stats?.reportsByProject?.length > 0 ? (
              <ProjectWorkloadChart data={stats.reportsByProject} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-slate-600 text-sm">
                No project distribution data
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Recent Activity Table */}
        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-300">
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {stats?.recentActivity?.length > 0 ? (
                stats.recentActivity.map((act) => (
                  <div
                    key={act._id}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800/50 rounded-xl transition-colors duration-300"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 truncate">
                        {act.userId?.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-600 truncate">
                        Submitted report for {act.project?.name} ({act.week})
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap">
                      {new Date(act.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 dark:text-slate-600 text-xs">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
};

export default ManagerDashboard;
