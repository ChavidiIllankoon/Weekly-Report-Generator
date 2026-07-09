import { useAuth } from '../../context/AuthContext';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Your account information</p>
      </div>

      <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-black border-4 border-white dark:border-black flex items-center justify-center shadow-xl transition-colors duration-300">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-6 pt-14 pb-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium capitalize bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20 rounded-md">
              <HiOutlineShieldCheck size={12} />
              {user?.role}
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-slate-700/50">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-zinc-900/30 rounded-xl transition-colors duration-300">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <HiOutlineUser size={16} className="text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-600 font-semibold">
                  Full Name
                </p>
                <p className="text-sm text-gray-700 dark:text-slate-200">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-zinc-900/30 rounded-xl transition-colors duration-300">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <HiOutlineMail size={16} className="text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-600 font-semibold">
                  Email
                </p>
                <p className="text-sm text-gray-700 dark:text-slate-200">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-zinc-900/30 rounded-xl transition-colors duration-300">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <HiOutlineShieldCheck size={16} className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-600 font-semibold">
                  Role
                </p>
                <p className="text-sm text-gray-700 dark:text-slate-200 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
