// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/Sidebar.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800',
        'flex flex-col transition-all duration-300 z-40',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <div className="animate-fade-in min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              Smart Leads
            </p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(isActive ? 'sidebar-item-active' : 'sidebar-item', 'overflow-hidden')
            }
            title={!sidebarOpen ? label : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="animate-fade-in truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 space-y-2">
        {sidebarOpen && (
          <div className="px-2 py-1.5 animate-fade-in">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn('sidebar-item w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20')}
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="animate-fade-in">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-slate-500" />
        )}
      </button>
    </aside>
  );
};
