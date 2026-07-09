import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const TaskList = ({ title, items, onUpdate, onRemove, onAdd, placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">{title}</label>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-slate-550 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-all"
            >
              <HiOutlineTrash size={16} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
      >
        <HiOutlinePlus size={14} />
        Add item
      </button>
    </div>
  </div>
);

export default TaskList;
