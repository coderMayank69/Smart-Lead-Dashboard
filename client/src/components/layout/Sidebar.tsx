// src/components/layout/Sidebar.tsx — Shopeers-inspired clean sidebar

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, LogOut, X, Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import toast from 'react-hot-toast';

interface NavItem { to: string; label: string; icon: React.ReactNode; badge?: string }

const MAIN_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
  { to: '/leads', label: 'Leads', icon: <Users className="w-[18px] h-[18px]" />, badge: 'New' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar scrollbar-thin ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <img src="/logo.png" alt="Smart Leads" loading="lazy" />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--on-surface)', lineHeight: '1.2', letterSpacing: '-0.01em' }}>
              Smart Leads
            </p>
          </div>
          {/* Close btn — mobile only */}
          <button
            onClick={onClose}
            className="hamburger"
            aria-label="Close navigation"
            style={{ display: 'flex', color: 'var(--on-surface-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Main Menu</p>
          {MAIN_NAV.map(({ to, label, icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 9999, fontWeight: 600,
                  background: '#dcfce7', color: '#16a34a',
                }}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}

          <p className="sidebar-section-label">Insights</p>
          <div className="sidebar-nav-item" style={{ opacity: 0.5, cursor: 'default' }}>
            <span style={{ flexShrink: 0 }}><ChevronDown className="w-[18px] h-[18px]" /></span>
            <span style={{ flex: 1 }}>Analytics</span>
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 9999, fontWeight: 600,
              background: 'var(--surface-low)', color: 'var(--on-surface-muted)',
            }}>Soon</span>
          </div>
        </nav>

        {/* Upgrade Card */}
        <div style={{ padding: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Sparkles className="w-4 h-4" />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Pro Features</span>
            </div>
            <p style={{ fontSize: 11.5, opacity: 0.85, lineHeight: 1.4, marginBottom: 12 }}>
              Unlock advanced analytics and team collaboration tools.
            </p>
            <button style={{
              width: '100%', padding: '8px 0', fontSize: 12, fontWeight: 600,
              background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 'var(--radius-sm)',
              color: '#fff', cursor: 'pointer', backdropFilter: 'blur(4px)',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.2)')}
            >
              Upgrade now →
            </button>
          </div>
        </div>

        {/* User profile */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--outline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--on-surface-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 9999, fontWeight: 600,
              background: 'var(--primary-light)', color: 'var(--primary)',
            }}>
              {user?.role === 'admin' ? 'Admin' : 'Sales'}
            </span>
          </div>

          <button onClick={handleLogout} className="sidebar-nav-item" style={{ width: '100%', color: '#ef4444', cursor: 'pointer' }}>
            <LogOut className="w-4 h-4" style={{ flexShrink: 0 }} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
