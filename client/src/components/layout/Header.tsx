// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/Header.tsx – Top app bar
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import { useUiStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import { cn } from '../../utils/cn';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { isDarkMode, toggleDarkMode, sidebarOpen } = useUiStore();
  const { user } = useAuthStore();

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md',
        'border-b border-slate-200 dark:border-slate-800',
        'flex items-center justify-between px-6 transition-all duration-300',
        sidebarOpen ? 'left-60' : 'left-16'
      )}
    >
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-400">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Notification bell (decorative) */}
        <button
          className="btn-ghost p-2 rounded-lg relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="btn-ghost p-2 rounded-lg"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center ml-1">
          <span className="text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};
