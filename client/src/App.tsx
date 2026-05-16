// ─────────────────────────────────────────────────────────────────────────────
// src/App.tsx – Root component with router
// ─────────────────────────────────────────────────────────────────────────────

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute, PublicRoute } from './router/ProtectedRoute';
import { useUiStore } from './store/ui.store';

// Lazy-load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const LeadsPage = lazy(() => import('./pages/LeadsPage').then((m) => ({ default: m.LeadsPage })));

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  </div>
);

function App() {
  const { isDarkMode } = useUiStore();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public routes */}
            <Route
              path="/login"
              element={<PublicRoute><LoginPage /></PublicRoute>}
            />
            <Route
              path="/register"
              element={<PublicRoute><RegisterPage /></PublicRoute>}
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/leads"
              element={<ProtectedRoute><LeadsPage /></ProtectedRoute>}
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>

        {/* Global toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '12px',
              background: isDarkMode ? '#1e293b' : '#ffffff',
              color: isDarkMode ? '#f1f5f9' : '#0f172a',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
