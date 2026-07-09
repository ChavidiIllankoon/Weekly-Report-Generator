import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { IoLogOutOutline } from 'react-icons/io5';
import { FiUser, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700/50 transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <HiOutlineMenuAlt2 size={22} />
        </button>

        {/* Center spacer */}
        <div className="flex-1" />

        {/* Right: Theme toggle, User info & logout */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-gray-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-300"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <FiSun size={19} /> : <FiMoon size={19} />}
          </button>

          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-gray-100 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700/50 transition-colors duration-300">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <FiUser size={14} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{user?.name}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2.5 text-gray-500 dark:text-slate-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
            title="Logout"
          >
            <IoLogOutOutline size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
