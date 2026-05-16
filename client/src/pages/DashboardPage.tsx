// ─────────────────────────────────────────────────────────────────────────────
// src/pages/DashboardPage.tsx – Stat cards overview
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Users, TrendingUp, CheckCircle2, XCircle, Phone, Globe, Instagram, UserCheck } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { useLeadStats } from '../hooks/useLeads';
import { useAuthStore } from '../store/auth.store';
import { cn } from '../utils/cn';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, color }) => (
  <div className="card-hover p-6 animate-slide-up">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', color)}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-xs text-emerald-600 font-medium">{trend}</span>
      </div>
    )}
  </div>
);

export const DashboardPage: React.FC = () => {
  const { stats, isLoading } = useLeadStats();
  const { user } = useAuthStore();

  const getCount = (items: { _id: string; count: number }[], key: string) =>
    items?.find((i) => i._id === key)?.count ?? 0;

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`${greeting}, ${user?.name?.split(' ')[0]} 👋`}
    >
      <div className="space-y-6">
        {/* Overview stats */}
        <section>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard
                  title="Total Leads"
                  value={stats?.total ?? 0}
                  subtitle="All time"
                  icon={<Users className="w-6 h-6 text-blue-600" />}
                  color="bg-blue-50 dark:bg-blue-900/20"
                  trend="+12% this month"
                />
                <StatCard
                  title="Qualified"
                  value={getCount(stats?.byStatus ?? [], 'Qualified')}
                  subtitle="High-value leads"
                  icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                  color="bg-emerald-50 dark:bg-emerald-900/20"
                />
                <StatCard
                  title="Contacted"
                  value={getCount(stats?.byStatus ?? [], 'Contacted')}
                  subtitle="In progress"
                  icon={<Phone className="w-6 h-6 text-amber-600" />}
                  color="bg-amber-50 dark:bg-amber-900/20"
                />
                <StatCard
                  title="Lost"
                  value={getCount(stats?.byStatus ?? [], 'Lost')}
                  subtitle="Closed-lost"
                  icon={<XCircle className="w-6 h-6 text-red-600" />}
                  color="bg-red-50 dark:bg-red-900/20"
                />
              </>
            )}
          </div>
        </section>

        {/* Source breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Source */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Leads by Source
            </h3>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton h-12 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { key: 'Website', icon: <Globe className="w-5 h-5 text-purple-500" />, color: 'bg-purple-500' },
                  { key: 'Instagram', icon: <Instagram className="w-5 h-5 text-pink-500" />, color: 'bg-pink-500' },
                  { key: 'Referral', icon: <UserCheck className="w-5 h-5 text-teal-500" />, color: 'bg-teal-500' },
                ].map(({ key, icon, color }) => {
                  const count = getCount(stats?.bySource ?? [], key);
                  const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{key}</span>
                          <span className="text-slate-400">{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-700', color)}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* By Status */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Pipeline Status
            </h3>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton h-12 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { key: 'New', color: 'bg-blue-500' },
                  { key: 'Contacted', color: 'bg-amber-500' },
                  { key: 'Qualified', color: 'bg-emerald-500' },
                  { key: 'Lost', color: 'bg-red-500' },
                ].map(({ key, color }) => {
                  const count = getCount(stats?.byStatus ?? [], key);
                  const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{key}</span>
                        <span className="text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-700', color)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
