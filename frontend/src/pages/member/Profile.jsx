import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlinePencilAlt, HiOutlineX, HiOutlineCheck } from 'react-icons/hi';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      await updateProfile(name.trim(), email.trim(), password || undefined);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Your account information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-sm hover:shadow transition-all"
          >
            <HiOutlinePencilAlt size={14} />
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-650 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-sm text-emerald-650 dark:text-emerald-400">
          {success}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-black border-4 border-white dark:border-black flex items-center justify-center shadow-xl transition-colors duration-300">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Info or Edit Form */}
        <div className="px-6 pt-14 pb-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <HiOutlineUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  New Password <span className="text-[10px] text-gray-400 lowercase font-normal">(leave blank to keep current)</span>
                </label>
                <div className="relative">
                  <HiOutlineLockClosed size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="Enter new password (min. 6 characters)"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-650 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
                >
                  <HiOutlineCheck size={14} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-slate-700/50 rounded-xl transition-all disabled:opacity-50"
                >
                  <HiOutlineX size={14} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
