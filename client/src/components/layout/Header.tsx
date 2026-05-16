// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/Header.tsx — hamburger menu for mobile
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Moon, Sun, Bell, ChevronRight, Menu } from 'lucide-react';
import { useUiStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads':     'Leads',
  '/settings':  'Settings',
};

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const { user } = useAuthStore();
  const currentLabel = ROUTE_LABELS[pathname] ?? 'Dashboard';

  return (
    <header className="header" role="banner">
      {/* Left: Hamburger (mobile) + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={onMenuClick}
          className="hamburger"
          aria-label="Open navigation menu"
          aria-expanded="false"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo — visible only on mobile when sidebar is hidden */}
        <img
          src="/logo.png"
          alt="Smart Leads"
          style={{ width: 28, height: 28, borderRadius: 6, display: 'none' }}
          className="mobile-logo"
        />

        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }} aria-label="Breadcrumb">
          <span style={{ color: 'var(--on-surface-muted)' }}>Smart Leads</span>
          <ChevronRight style={{ width: 13, height: 13, color: 'var(--on-surface-muted)' }} />
          <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{currentLabel}</span>
        </nav>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Notifications */}
        <button className="btn-ghost" style={{ width: 34, height: 34, padding: 0, borderRadius: 6, position: 'relative' }} aria-label="Notifications">
          <Bell style={{ width: 15, height: 15 }} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--primary)',
          }} />
        </button>

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="btn-ghost"
          style={{ width: 34, height: 34, padding: 0, borderRadius: 6 }}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--outline)', margin: '0 4px' }} />

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="hidden-mobile">
            <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2, color: 'var(--on-surface)' }}>{user?.name}</p>
            <p style={{ fontSize: 11, lineHeight: 1.2, color: 'var(--on-surface-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
