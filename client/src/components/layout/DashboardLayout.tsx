// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/DashboardLayout.tsx – Main layout wrapper
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUiStore } from '../../store/ui.store';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { sidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <Header title={title} subtitle={subtitle} />
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          sidebarOpen ? 'ml-60' : 'ml-16'
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
