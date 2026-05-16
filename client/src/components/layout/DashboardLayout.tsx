// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/DashboardLayout.tsx — mobile sidebar state
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="layout-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1" style={{ padding: '24px' }} id="main-content" role="main">
          {(title || actions) && (
            <div className="page-header">
              <div>
                {title && <h1 className="page-title">{title}</h1>}
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
              </div>
              {actions && <div className="page-actions flex items-center gap-2">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};
