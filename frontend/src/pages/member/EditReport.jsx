import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportsAPI, projectsAPI } from '../../services/api';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [week, setWeek] = useState('');
  const [project, setProject] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [notes, setNotes] = useState('');
  const [completedTasks, setCompletedTasks] = useState(['']);
  const [plannedTasks, setPlannedTasks] = useState(['']);
  const [blockers, setBlockers] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, reportsRes] = await Promise.all([
          projectsAPI.getAll(),
          reportsAPI.getMyReports(),
        ]);
        setProjects(projRes.data);

        const report = reportsRes.data.find((r) => r._id === id);
        if (!report) {
          setError('Report not found');
          return;
        }
        if (report.status === 'Submitted') {
          setError('Cannot edit a submitted report');
          return;
        }

        setWeek(report.week);
        setProject(report.project?._id || '');
        setHoursWorked(report.hoursWorked);
        setNotes(report.notes || '');
        setCompletedTasks(report.completedTasks?.length > 0 ? report.completedTasks : ['']);
        setPlannedTasks(report.plannedTasks?.length > 0 ? report.plannedTasks : ['']);
        setBlockers(report.blockers?.length > 0 ? report.blockers : ['']);
      } catch (err) {
        setError('Failed to load report');
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const addItem = (setter) => setter((prev) => [...prev, '']);
  const removeItem = (setter, index) => setter((prev) => prev.filter((_, i) => i !== index));
  const updateItem = (setter, index, value) =>
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await reportsAPI.update(id, {
        week,
        project,
        hoursWorked: Number(hoursWorked),
        notes,
        completedTasks: completedTasks.filter((t) => t.trim()),
        plannedTasks: plannedTasks.filter((t) => t.trim()),
        blockers: blockers.filter((t) => t.trim()),
      });
      navigate('/member/reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report');
    } finally {
      setLoading(false);
    }
  };

  const TaskList = ({ title, items, setter, placeholder }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">{title}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(setter, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(setter, index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-slate-550 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-all"
              >
                <HiOutlineTrash size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(setter)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-650 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
        >
          <HiOutlinePlus size={14} />
          Add item
        </button>
      </div>
    </div>
  );

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <HiOutlinePencilAlt size={20} className="text-white" />
          </div>
          Edit Report
        </h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">Update your draft report</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-650 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-5 shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Week</label>
              <input
                type="week"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Hours Worked</label>
            <input
              type="number"
              min="0"
              max="168"
              step="0.5"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              required
              className="w-full max-w-xs px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <TaskList title="Completed Tasks" items={completedTasks} setter={setCompletedTasks} placeholder="What did you complete?" />
          <TaskList title="Planned Tasks" items={plannedTasks} setter={setPlannedTasks} placeholder="What's planned next?" />
          <TaskList title="Blockers" items={blockers} setter={setBlockers} placeholder="Any blockers?" />
        </div>

        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Update Report'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/member/reports')}
            className="px-6 py-2.5 text-sm font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-slate-700/50 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReport;
