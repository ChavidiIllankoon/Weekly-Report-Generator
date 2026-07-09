import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoClose } from 'react-icons/io5';
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlinePlusCircle,
  HiOutlineCollection,
  HiOutlineUserGroup,
  HiOutlineFolderOpen,
  HiOutlineChartBar,
  HiOutlineUser,
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isManager } = useAuth();

  const memberLinks = [
    { to: '/member/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
    { to: '/member/reports', label: 'My Reports', icon: HiOutlineCollection },
    { to: '/member/create-report', label: 'Create Report', icon: HiOutlinePlusCircle },
    { to: '/member/profile', label: 'Profile', icon: HiOutlineUser },
  ];

  const managerLinks = [
    { to: '/manager/dashboard', label: 'Dashboard', icon: HiOutlineChartBar },
    { to: '/manager/reports', label: 'All Reports', icon: HiOutlineDocumentText },
    { to: '/manager/projects', label: 'Projects', icon: HiOutlineFolderOpen },
    { to: '/manager/users', label: 'Team Members', icon: HiOutlineUserGroup },
  ];

  const links = isManager ? managerLinks : memberLinks;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-black border-r border-gray-200 dark:border-slate-700/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo / Brand */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-slate-700/50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <HiOutlineDocumentText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">WeeklyPulse</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-widest">Report System</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-slate-600 font-semibold mb-3 px-3">
          {isManager ? 'Management' : 'Workspace'}
        </p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/50'
              }`
            }
          >
            <link.icon size={19} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom user card */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-700/50 transition-colors duration-300">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-slate-800/30 rounded-xl transition-colors duration-300">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
