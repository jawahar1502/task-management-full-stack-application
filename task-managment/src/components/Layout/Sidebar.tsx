import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, User, LogOut, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/',        label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks',   label: 'My Tasks',  icon: CheckSquare },
  { to: '/profile', label: 'Profile',   icon: User },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-dark-900 border-r border-dark-600/60 p-4 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <span className="text-base font-bold text-white tracking-tight">TaskFlow</span>
          <p className="text-xs text-slate-500">Pro Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="divider pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-dark-800 border border-dark-600/40 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="nav-link w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
