import { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlinePencilAlt, HiOutlineClock } from 'react-icons/hi';
import { TasksTrendChart } from '../../components/Charts';
import AIChatWidget from '../../components/AIChatWidget';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportsAPI.getMyReports();
        setReports(res.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const totalReports = reports.length;
  const submittedReports = reports.filter((r) => r.status === 'Submitted').length;
  const draftReports = reports.filter((r) => r.status === 'Draft').length;
  const totalHours = reports.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);

  // Prepare chart data — group by week
  const weeklyData = reports
    .filter((r) => r.status === 'Submitted')
    .reduce((acc, r) => {
      const existing = acc.find((w) => w._id === r.week);
      if (existing) {
        existing.totalTasks += r.completedTasks?.length || 0;
        existing.count += 1;
      } else {
        acc.push({
          _id: r.week,
          totalTasks: r.completedTasks?.length || 0,
          count: 1,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a._id.localeCompare(b._id));

  const recentReports = reports.slice(0, 5);

  const stats = [
    {
      label: 'Total Reports',
      value: totalReports,
      icon: HiOutlineDocumentText,
      color: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      border: 'border-indigo-100 dark:border-indigo-500/20',
    },
    {
      label: 'Submitted',
      value: submittedReports,
      icon: HiOutlineCheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-100 dark:border-emerald-500/20',
    },
    {
      label: 'Drafts',
      value: draftReports,
      icon: HiOutlinePencilAlt,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-100 dark:border-amber-500/20',
    },
    {
      label: 'Hours Logged',
      value: totalHours,
      icon: HiOutlineClock,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      border: 'border-purple-100 dark:border-purple-500/20',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {user?.name?.split(' ')[0]}
          </span>
        </h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Here's your weekly reporting overview</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} ${stat.border} border rounded-2xl p-5 hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
              >
                <stat.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Trend Chart */}
        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Tasks Completed Trend</h2>
          <div className="h-56">
            {weeklyData.length > 0 ? (
              <TasksTrendChart data={weeklyData} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-slate-600 text-sm">
                Submit reports to see trends
              </div>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Recent Reports</h2>
          {recentReports.length > 0 ? (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/30 rounded-xl border border-gray-100 dark:border-zinc-800/50 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <HiOutlineDocumentText size={14} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 dark:text-slate-300 truncate">
                        {report.project?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-600">{report.week}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      report.status === 'Submitted'
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                        : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 dark:text-slate-600 text-sm">
              No reports yet. Create your first report!
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
};

export default MemberDashboard;
