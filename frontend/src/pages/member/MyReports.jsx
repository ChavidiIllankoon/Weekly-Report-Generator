import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../../services/api';
import ReportCard from '../../components/ReportCard';
import { HiOutlineCollection, HiOutlinePlusCircle } from 'react-icons/hi';

const MyReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

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

  const handleEdit = (report) => {
    navigate(`/member/edit-report/${report._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await reportsAPI.delete(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete report');
    }
  };

  const handleSubmit = async (id) => {
    if (!window.confirm('Submit this report? This action cannot be undone.')) return;
    try {
      const res = await reportsAPI.submit(id);
      setReports((prev) =>
        prev.map((r) => (r._id === id ? res.data : r))
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit report');
    }
  };

  const filteredReports =
    filter === 'all'
      ? reports
      : reports.filter((r) => r.status === filter);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <HiOutlineCollection size={20} className="text-white" />
            </div>
            My Reports
          </h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">{reports.length} total reports</p>
        </div>
        <button
          onClick={() => navigate('/member/create-report')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
        >
          <HiOutlinePlusCircle size={18} />
          New Report
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        {['all', 'Draft', 'Submitted'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filter === f
                ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/50'
            }`}
          >
            {f === 'all' ? 'All' : f}
            <span className="ml-1.5 text-gray-400 dark:text-slate-600">
              ({f === 'all' ? reports.length : reports.filter((r) => r.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Reports grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-zinc-900/30 rounded-2xl border border-gray-200 dark:border-zinc-850">
          <HiOutlineCollection size={48} className="text-gray-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-slate-500 text-sm">No reports found</p>
          <button
            onClick={() => navigate('/member/create-report')}
            className="mt-4 px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20 rounded-lg transition-all"
          >
            Create your first report
          </button>
        </div>
      )}
    </div>
  );
};

export default MyReports;
