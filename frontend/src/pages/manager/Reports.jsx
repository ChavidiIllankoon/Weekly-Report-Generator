import { useState, useEffect } from 'react';
import { managerAPI } from '../../services/api';
import ReportTable from '../../components/ReportTable';
import FilterPanel from '../../components/FilterPanel';
import { HiOutlineDocumentText, HiOutlineX } from 'react-icons/hi';

const ManagerReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const res = await managerAPI.getAllReports(currentFilters);
      setReports(res.data);
    } catch (error) {
      console.error('Error fetching all reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchReports(newFilters);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <HiOutlineDocumentText size={20} className="text-white" />
          </div>
          Team Reports
        </h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Review and filter all submitted weekly reports</p>
      </div>

      {/* Filter panel */}
      <FilterPanel onFilter={handleFilter} showMemberFilter={true} />

      {/* Reports Table container */}
      <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ReportTable reports={reports} showUser={true} onView={setSelectedReport} />
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl transition-colors duration-300">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Report Details</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                  Submitted by {selectedReport.userId?.name} for {selectedReport.week}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-gray-450 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <HiOutlineX size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-zinc-900/30 border border-gray-250 dark:border-zinc-800 p-3 rounded-xl">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-550 font-semibold">
                    Project
                  </p>
                  <p className="text-sm font-medium text-gray-750 dark:text-slate-200 mt-0.5">
                    {selectedReport.project?.name || 'Unknown'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-900/30 border border-gray-250 dark:border-zinc-800 p-3 rounded-xl">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-550 font-semibold">
                    Hours Worked
                  </p>
                  <p className="text-sm font-medium text-gray-750 dark:text-slate-200 mt-0.5">
                    {selectedReport.hoursWorked} hours
                  </p>
                </div>
              </div>

              {/* Tasks lists */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-450 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Completed Tasks
                  </h4>
                  {selectedReport.completedTasks?.length > 0 ? (
                    <ul className="space-y-1.5 pl-5 list-disc text-sm text-gray-700 dark:text-slate-300">
                      {selectedReport.completedTasks.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-slate-500">No completed tasks reported</p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-450 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Planned Tasks
                  </h4>
                  {selectedReport.plannedTasks?.length > 0 ? (
                    <ul className="space-y-1.5 pl-5 list-disc text-sm text-gray-700 dark:text-slate-300">
                      {selectedReport.plannedTasks.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-slate-500">No planned tasks reported</p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-450 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Blockers
                  </h4>
                  {selectedReport.blockers?.length > 0 ? (
                    <ul className="space-y-1.5 pl-5 list-disc text-sm text-red-600 dark:text-red-400">
                      {selectedReport.blockers.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-slate-500">No blockers reported</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedReport.notes && (
                <div className="bg-gray-50 dark:bg-zinc-900/30 border border-gray-250 dark:border-zinc-800 p-4 rounded-xl">
                  <h4 className="text-xs font-semibold text-gray-450 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Notes
                  </h4>
                  <p className="text-sm text-gray-750 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedReport.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-slate-300 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gray-200 dark:border-slate-850 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerReports;
