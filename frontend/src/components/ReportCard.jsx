import { HiOutlineDocumentText, HiOutlineClock, HiOutlineExclamation } from 'react-icons/hi';

const statusColors = {
  Draft: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-500/20',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  Submitted: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
};

const ReportCard = ({ report, onEdit, onDelete, onSubmit, showUser = false }) => {
  const status = statusColors[report.status] || statusColors.Draft;

  return (
    <div className="group bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-100 dark:hover:shadow-indigo-500/5 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
            <HiOutlineDocumentText size={18} className="text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">
              {report.project?.name || 'Unknown Project'}
            </h3>
            {showUser && (
              <p className="text-xs text-gray-400 dark:text-slate-500">{report.userId?.name || 'Unknown'}</p>
            )}
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.text} ${status.border} border`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
          {report.status}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <HiOutlineClock size={13} />
          {report.week}
        </span>
        <span>{report.hoursWorked}h worked</span>
      </div>

      {/* Tasks preview */}
      <div className="space-y-2 mb-4">
        {report.completedTasks?.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-600 font-semibold mb-1">
              Completed
            </p>
            <ul className="space-y-0.5">
              {report.completedTasks.slice(0, 2).map((task, i) => (
                <li key={i} className="text-xs text-gray-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 flex-shrink-0"></span>
                  {task}
                </li>
              ))}
              {report.completedTasks.length > 2 && (
                <li className="text-xs text-gray-400 dark:text-slate-600">
                  +{report.completedTasks.length - 2} more
                </li>
              )}
            </ul>
          </div>
        )}

        {report.blockers?.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400/80">
            <HiOutlineExclamation size={13} />
            {report.blockers.length} blocker{report.blockers.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Actions */}
      {report.status === 'Draft' && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-slate-700/50">
          {onEdit && (
            <button
              onClick={() => onEdit(report)}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20 rounded-lg transition-all"
            >
              Edit
            </button>
          )}
          {onSubmit && (
            <button
              onClick={() => onSubmit(report._id)}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 rounded-lg transition-all"
            >
              Submit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(report._id)}
              className="px-3 py-1.5 text-xs font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-lg transition-all"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportCard;
