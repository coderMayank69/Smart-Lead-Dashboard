// src/components/layout/Header.tsx — Shopeers-inspired glassmorphic header

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Moon, Sun, Bell, Search, Menu, Command } from 'lucide-react';
import { useUiStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/settings': 'Settings',
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
      {/* Left: Hamburger + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onMenuClick}
          className="hamburger"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar — Shopeers style */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface-low)', borderRadius: 'var(--radius-sm)',
          padding: '0 14px', height: 38, minWidth: 220,
          border: '1px solid transparent',
          transition: 'all 200ms',
        }}
          className="hidden-mobile"
        >
          <Search style={{ width: 15, height: 15, color: 'var(--on-surface-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--on-surface-muted)', opacity: 0.6 }}>
            Search anything...
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            marginLeft: 'auto', padding: '2px 6px',
            background: 'var(--surface-lowest)', borderRadius: 4,
            border: '1px solid var(--outline)',
          }}>
            <Command style={{ width: 10, height: 10, color: 'var(--on-surface-muted)' }} />
            <span style={{ fontSize: 10, color: 'var(--on-surface-muted)', fontWeight: 500 }}>K</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="btn-ghost"
          style={{
            width: 36, height: 36, padding: 0, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode
            ? <Sun style={{ width: 17, height: 17 }} />
            : <Moon style={{ width: 17, height: 17 }} />
          }
        </button>

        {/* Notifications */}
        <button
          className="btn-ghost"
          style={{
            width: 36, height: 36, padding: 0, borderRadius: 'var(--radius-sm)',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Notifications"
        >
          <Bell style={{ width: 17, height: 17 }} />
          <span style={{
            position: 'absolute', top: 7, right: 7,
            width: 7, height: 7, borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid var(--surface-lowest)',
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--outline)', margin: '0 8px' }} />

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
            boxShadow: '0 2px 8px rgba(37,99,235,.2)',
          }}>
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="hidden-mobile">
            <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: 'var(--on-surface)' }}>{user?.name}</p>
            <p style={{ fontSize: 11, lineHeight: 1.2, color: 'var(--on-surface-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
