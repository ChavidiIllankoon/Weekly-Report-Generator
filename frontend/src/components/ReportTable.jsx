const statusColors = {
  Draft: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
  Submitted: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
};

const ReportTable = ({ reports, showUser = false, onView }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 dark:text-slate-500 text-sm">No reports found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-slate-700/50">
            {showUser && (
              <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
                Member
              </th>
            )}
            <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
              Project
            </th>
            <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
              Week
            </th>
            <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
              Tasks
            </th>
            <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
              Hours
            </th>
            <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
              Blockers
            </th>
            <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
          {reports.map((report) => (
            <tr
              key={report._id}
              className="hover:bg-gray-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
              onClick={() => onView && onView(report)}
            >
              {showUser && (
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {report.userId?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-slate-300">{report.userId?.name}</span>
                  </div>
                </td>
              )}
              <td className="py-3 px-4 text-sm text-gray-700 dark:text-slate-300">
                {report.project?.name || '—'}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500 dark:text-slate-400">{report.week}</td>
              <td className="py-3 px-4 text-sm text-gray-500 dark:text-slate-400">
                {report.completedTasks?.length || 0} done
              </td>
              <td className="py-3 px-4 text-sm text-gray-500 dark:text-slate-400">{report.hoursWorked}h</td>
              <td className="py-3 px-4">
                {report.blockers?.length > 0 ? (
                  <span className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2 py-0.5 rounded-md">
                    {report.blockers.length}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-slate-600">None</span>
                )}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${
                    statusColors[report.status] || ''
                  }`}
                >
                  {report.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
