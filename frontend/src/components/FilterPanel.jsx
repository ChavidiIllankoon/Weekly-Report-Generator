import { useState, useEffect } from 'react';
import { projectsAPI, authAPI } from '../services/api';
import { HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

const FilterPanel = ({ onFilter, showMemberFilter = true }) => {
  const [week, setWeek] = useState('');
  const [project, setProject] = useState('');
  const [member, setMember] = useState('');
  const [status, setStatus] = useState('');
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projRes] = await Promise.all([projectsAPI.getAll()]);
        setProjects(projRes.data);

        if (showMemberFilter) {
          const membersRes = await authAPI.getUsers();
          setMembers(membersRes.data);
        }
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };
    loadData();
  }, [showMemberFilter]);

  const applyFilter = () => {
    const filters = {};
    if (week) filters.week = week;
    if (project) filters.project = project;
    if (member) filters.member = member;
    if (status) filters.status = status;
    onFilter(filters);
  };

  const clearFilters = () => {
    setWeek('');
    setProject('');
    setMember('');
    setStatus('');
    onFilter({});
  };

  const hasFilters = week || project || member || status;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700/50 rounded-xl transition-all"
      >
        <HiOutlineFilter size={16} />
        Filters
        {hasFilters && (
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-white/80 dark:bg-slate-800/30 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50 rounded-2xl animate-fade-in transition-colors duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Week */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-1.5">
                Week
              </label>
              <input
                type="week"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-1.5">
                Project
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              >
                <option value="">All Projects</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Member */}
            {showMemberFilter && (
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-1.5">
                  Member
                </label>
                <select
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
                >
                  <option value="">All Members</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
              >
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={applyFilter}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-all"
            >
              Apply Filters
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-all"
              >
                <HiOutlineX size={13} />
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
