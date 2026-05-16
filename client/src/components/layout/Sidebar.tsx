// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/Sidebar.tsx — with mobile hamburger support
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, ChevronRight, X } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import toast from 'react-hot-toast';

interface NavItem { to: string; label: string; icon: React.ReactNode; }

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { to: '/leads',     label: 'Leads',     icon: <Users className="w-4 h-4" /> },
  { to: '/settings',  label: 'Settings',  icon: <Settings className="w-4 h-4" /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigating
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
            <img src="/logo.png" alt="Smart Leads logo" />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', lineHeight: '1.2' }}>Smart Leads</p>
            <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.2' }}>CRM Dashboard</p>
          </div>
          {/* Close btn — mobile only */}
          <button
            onClick={onClose}
            className="hamburger"
            aria-label="Close navigation"
            style={{ display: 'flex', color: '#94a3b8' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Main Menu</p>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              <ChevronRight style={{ width: 12, height: 12, opacity: 0.3 }} />
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
            <span style={{
              fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600,
              background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
            }}>
              {user?.role === 'admin' ? 'Admin' : 'Sales'}
            </span>
          </div>

          <button onClick={handleLogout} className="sidebar-nav-item" style={{ width: '100%', color: '#f87171', cursor: 'pointer' }}>
            <LogOut className="w-4 h-4" style={{ flexShrink: 0 }} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
