// ─────────────────────────────────────────────────────────────────────────────
// src/pages/DashboardPage.tsx – Stitch CRM Precision Aesthetic
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Users, CheckCircle2, Phone, XCircle, Globe, Smartphone, UserCheck, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useLeadStats } from '../hooks/useLeads';
import { useAuthStore } from '../store/auth.store';
import { cn } from '../utils/cn';

/* ── Stat Card ───────────────────────────────────────────────────────────── */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  borderClass: string;
  subtitle?: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, icon, iconBg, borderClass, subtitle, trend
}) => (
  <div className={cn('stat-card animate-slide-up card-hover', borderClass)}>
    <div>
      <p className="stat-card-label">{title}</p>
      <p className="stat-card-value">{value.toLocaleString()}</p>
      {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      {trend && (
        <div className="stat-card-footer">
          <TrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
          <span className="text-emerald-600 text-xs">{trend}</span>
        </div>
      )}
    </div>
    <div className={cn('stat-card-icon', iconBg)}>
      {icon}
    </div>
  </div>
);

/* ── Mini Progress Row ───────────────────────────────────────────────────── */
interface ProgressRowProps {
  label: string;
  count: number;
  total: number;
  fillClass: string;
}

const ProgressRow: React.FC<ProgressRowProps> = ({ label, count, total, fillClass }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium" style={{ color: 'var(--on-surface)' }}>{label}</span>
        <span className="text-muted tabular-nums">{count} <span className="text-xs">({pct}%)</span></span>
      </div>
      <div className="progress-bar">
        <div
          className={cn('progress-fill', fillClass)}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

/* ── Source Row ──────────────────────────────────────────────────────────── */
interface SourceRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  count: number;
  total: number;
  fillClass: string;
}

const SourceRow: React.FC<SourceRowProps> = ({ icon, iconBg, label, count, total, fillClass }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', iconBg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium" style={{ color: 'var(--on-surface)' }}>{label}</span>
          <span className="text-muted tabular-nums text-xs">{count} ({pct}%)</span>
        </div>
        <div className="progress-bar">
          <div className={cn('progress-fill', fillClass)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton ────────────────────────────────────────────────────────────── */
const CardSkeleton = () => (
  <div className="card p-5 space-y-3">
    <div className="skeleton h-3 w-24 rounded" />
    <div className="skeleton h-7 w-16 rounded" />
  </div>
);

/* ── Page ────────────────────────────────────────────────────────────────── */
export const DashboardPage: React.FC = () => {
  const { stats, isLoading } = useLeadStats();
  const { user } = useAuthStore();

  const getCount = (items: { _id: string; count: number }[], key: string) =>
    items?.find((i) => i._id === key)?.count ?? 0;

  const total = stats?.total ?? 0;

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`${greeting}, ${user?.name?.split(' ')[0]} 👋 — Here's your pipeline overview`}
    >
      {/* ── Stat Cards ── */}
      <section aria-labelledby="stats-heading" className="mb-6">
        <h2 id="stats-heading" className="sr-only">Pipeline statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                title="Total Leads"
                value={total}
                icon={<Users className="w-5 h-5 text-blue-600" />}
                iconBg="bg-blue-50"
                borderClass="border-l-blue"
                subtitle="All time"
                trend="+12% this month"
              />
              <StatCard
                title="Qualified"
                value={getCount(stats?.byStatus ?? [], 'Qualified')}
                icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
                iconBg="bg-green-50"
                borderClass="border-l-green"
                subtitle="High-value leads"
              />
              <StatCard
                title="Contacted"
                value={getCount(stats?.byStatus ?? [], 'Contacted')}
                icon={<Phone className="w-5 h-5 text-amber-600" />}
                iconBg="bg-amber-50"
                borderClass="border-l-amber"
                subtitle="In progress"
              />
              <StatCard
                title="Lost"
                value={getCount(stats?.byStatus ?? [], 'Lost')}
                icon={<XCircle className="w-5 h-5 text-red-500" />}
                iconBg="bg-red-50"
                borderClass="border-l-red"
                subtitle="Closed-lost"
              />
            </>
          )}
        </div>
      </section>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pipeline Status */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--on-surface)' }}>
            Pipeline Status
          </h3>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="skeleton h-3 w-32 rounded" />
                  <div className="skeleton h-2 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <ProgressRow label="New"       count={getCount(stats?.byStatus ?? [], 'New')}       total={total} fillClass="bg-blue-500" />
              <ProgressRow label="Contacted" count={getCount(stats?.byStatus ?? [], 'Contacted')} total={total} fillClass="bg-amber-500" />
              <ProgressRow label="Qualified" count={getCount(stats?.byStatus ?? [], 'Qualified')} total={total} fillClass="bg-green-500" />
              <ProgressRow label="Lost"      count={getCount(stats?.byStatus ?? [], 'Lost')}      total={total} fillClass="bg-red-500" />
            </div>
          )}
        </div>

        {/* Leads by Source */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--on-surface)' }}>
            Leads by Source
          </h3>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-9 h-9 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <div className="skeleton h-3 w-24 rounded" />
                    <div className="skeleton h-2 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <SourceRow
                icon={<Globe className="w-4 h-4 text-purple-600" />}
                iconBg="bg-purple-50"
                label="Website"
                count={getCount(stats?.bySource ?? [], 'Website')}
                total={total}
                fillClass="bg-purple-500"
              />
              <SourceRow
                icon={<Smartphone className="w-4 h-4 text-pink-600" />}
                iconBg="bg-pink-50"
                label="Instagram"
                count={getCount(stats?.bySource ?? [], 'Instagram')}
                total={total}
                fillClass="bg-pink-500"
              />
              <SourceRow
                icon={<UserCheck className="w-4 h-4 text-teal-600" />}
                iconBg="bg-teal-50"
                label="Referral"
                count={getCount(stats?.bySource ?? [], 'Referral')}
                total={total}
                fillClass="bg-teal-500"
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
