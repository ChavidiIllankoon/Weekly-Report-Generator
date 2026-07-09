import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { reportsAPI, projectsAPI } from '../../services/api';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import TaskList from '../../components/TaskList';

const CreateReport = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(['']);
  const [plannedTasks, setPlannedTasks] = useState(['']);
  const [blockers, setBlockers] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      week: new Date().toISOString().slice(0, 4) + '-W' + String(getWeekNumber()).padStart(2, '0'),
    },
  });

  function getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 604800000;
    return Math.ceil((diff / oneWeek) + 1);
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectsAPI.getAll();
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  const addItem = (setter) => setter((prev) => [...prev, '']);
  const removeItem = (setter, index) => setter((prev) => prev.filter((_, i) => i !== index));
  const updateItem = (setter, index, value) =>
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...data,
        hoursWorked: Number(data.hoursWorked),
        completedTasks: completedTasks.filter((t) => t.trim()),
        plannedTasks: plannedTasks.filter((t) => t.trim()),
        blockers: blockers.filter((t) => t.trim()),
      };

      await reportsAPI.create(payload);
      navigate('/member/reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <HiOutlinePlusCircle size={20} className="text-white" />
          </div>
          Create Weekly Report
        </h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">Fill in your weekly progress and submit</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-5 shadow-sm dark:shadow-none transition-colors duration-300">
          {/* Week and Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Week</label>
              <input
                type="week"
                {...register('week', { required: 'Week is required' })}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              />
              {errors.week && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.week.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">Project</label>
              <select
                {...register('project', { required: 'Project is required' })}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.project && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.project.message}</p>
              )}
            </div>
          </div>

          {/* Hours Worked */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
              Hours Worked
            </label>
            <input
              type="number"
              min="0"
              max="168"
              step="0.5"
              {...register('hoursWorked', {
                required: 'Hours worked is required',
                min: { value: 0, message: 'Minimum 0 hours' },
                max: { value: 168, message: 'Maximum 168 hours' },
              })}
              className="w-full max-w-xs px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              placeholder="40"
            />
            {errors.hoursWorked && (
              <p className="mt-1 text-xs text-red-505 dark:text-red-400">{errors.hoursWorked.message}</p>
            )}
          </div>
        </div>

        {/* Task Lists */}
        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <TaskList
            title="Completed Tasks"
            items={completedTasks}
            onUpdate={(index, value) => updateItem(setCompletedTasks, index, value)}
            onRemove={(index) => removeItem(setCompletedTasks, index)}
            onAdd={() => addItem(setCompletedTasks)}
            placeholder="What did you complete this week?"
          />
          <TaskList
            title="Planned Tasks (Next Week)"
            items={plannedTasks}
            onUpdate={(index, value) => updateItem(setPlannedTasks, index, value)}
            onRemove={(index) => removeItem(setPlannedTasks, index)}
            onAdd={() => addItem(setPlannedTasks)}
            placeholder="What do you plan to work on?"
          />
          <TaskList
            title="Blockers"
            items={blockers}
            onUpdate={(index, value) => updateItem(setBlockers, index, value)}
            onRemove={(index) => removeItem(setBlockers, index)}
            onAdd={() => addItem(setBlockers)}
            placeholder="Any blockers or issues?"
          />
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
            Additional Notes
          </label>
          <textarea
            rows={3}
            {...register('notes')}
            placeholder="Any additional comments or context..."
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save as Draft'}
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

export default CreateReport;
