import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { projectsAPI } from '../../services/api';
import { HiOutlineFolderOpen, HiOutlineTrash, HiOutlinePencil, HiOutlinePlus } from 'react-icons/hi';

const ManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onSubmit = async (data) => {
    setError('');
    setFormLoading(true);
    try {
      if (editingProject) {
        const res = await projectsAPI.update(editingProject._id, data);
        setProjects((prev) =>
          prev.map((p) => (p._id === editingProject._id ? res.data : p))
        );
        setEditingProject(null);
      } else {
        const res = await projectsAPI.create(data);
        setProjects((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      }
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setValue('name', project.name);
    setValue('description', project.description);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const cancelEdit = () => {
    setEditingProject(null);
    reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* List Projects */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <HiOutlineFolderOpen size={20} className="text-white" />
            </div>
            Manage Projects
          </h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Add, edit, or remove trackable projects</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-slate-800/50">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-start justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 pr-4">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">{project.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                    >
                      <HiOutlinePencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <HiOutlineTrash size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 dark:text-slate-650 text-sm">No projects added yet</div>
          )}
        </div>
      </div>

      {/* Form: Add/Edit */}
      <div>
        <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300 sticky top-24">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
            {editingProject ? (
              <>
                <HiOutlinePencil size={16} className="text-indigo-500 dark:text-indigo-400" />
                Edit Project
              </>
            ) : (
              <>
                <HiOutlinePlus size={16} className="text-indigo-500 dark:text-indigo-400" />
                Add New Project
              </>
            )}
          </h2>

          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-xs text-red-650 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-500 font-semibold mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Client A Project"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-500 font-semibold mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Brief project details..."
                {...register('description')}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-md transition-all"
              >
                {formLoading ? 'Saving...' : editingProject ? 'Update' : 'Create'}
              </button>
              {editingProject && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-250 dark:border-slate-700/50 rounded-lg text-xs transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagerProjects;
