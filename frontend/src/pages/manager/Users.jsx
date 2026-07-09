import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { HiOutlineUserGroup, HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi';

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getUsers();
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users list:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <HiOutlineUserGroup size={20} className="text-white" />
          </div>
          Team Members
        </h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Directory of all registered team members and roles</p>
      </div>

      {/* Users grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-500/20 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/10">
                  <span className="text-white text-lg font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{user.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium capitalize rounded-md ${
                        user.role === 'manager'
                          ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-650 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20'
                          : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                      }`}
                    >
                      <HiOutlineShieldCheck size={10} />
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-150 dark:border-slate-800 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
                <HiOutlineMail size={14} className="text-gray-400 dark:text-slate-650" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 dark:text-slate-600 text-sm">No team members registered</div>
      )}
    </div>
  );
};

export default ManagerUsers;
