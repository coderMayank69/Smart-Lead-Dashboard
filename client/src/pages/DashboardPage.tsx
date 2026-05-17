// src/pages/DashboardPage.tsx — Shopeers-inspired dashboard with live Groq AI assistant

import React, { useState, useRef, useEffect } from 'react';
import {
  Users, CheckCircle2, Phone, XCircle, Globe, Smartphone,
  UserCheck, TrendingUp, TrendingDown, ArrowUpRight, Activity,
  Sparkles, BarChart3, PieChart, SendHorizontal, Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useLeadStats } from '../hooks/useLeads';
import { useAuthStore } from '../store/auth.store';
import { aiApi } from '../api/ai.api';
import { cn } from '../utils/cn';

/* ── Animation variants ── */


const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Stat Card ── */
interface StatCardProps {
  title: string; value: number; icon: React.ReactNode;
  iconBg: string; iconColor: string;
  trend?: string; trendUp?: boolean; subtitle?: string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg, iconColor, trend, trendUp = true, subtitle }) => (
  <motion.div variants={cardVariant} className="card card-hover" whileHover={{ y: -3, transition: { duration: 0.2 } }}>
    <div className="stat-card">
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="stat-card-label">{title}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
          <p className="stat-card-value">{value.toLocaleString()}</p>
          {trend && (
            <span className={cn('trend-badge', trendUp ? 'trend-up' : 'trend-down')}>
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p style={{ fontSize: 11.5, color: 'var(--on-surface-muted)', marginTop: 4 }}>{subtitle}</p>}
      </div>
      <div className="stat-card-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
    </div>
  </motion.div>
);

/* ── Progress Row ── */
const ProgressRow: React.FC<{ label: string; count: number; total: number; color: string; dotColor: string }> =
  ({ label, count, total, color, dotColor }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--outline)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: 'var(--on-surface)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', minWidth: 28, textAlign: 'right' }}>{count}</span>
        <div style={{ width: 80, flexShrink: 0 }}>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              style={{ background: color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--on-surface-muted)', minWidth: 32, textAlign: 'right' }}>{pct}%</span>
      </div>
    );
  };

/* ── Source Row ── */
const SourceRow: React.FC<{ icon: React.ReactNode; iconBg: string; label: string; count: number; total: number; color: string }> =
  ({ icon, iconBg, label, count, total, color }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--on-surface)' }}>{label}</span>
            <span style={{ fontSize: 12, color: 'var(--on-surface-muted)' }}>{count} ({pct}%)</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              style={{ background: color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    );
  };

/* ── Skeleton ── */
const CardSkeleton = () => (
  <div className="card p-6" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div className="skeleton" style={{ height: 12, width: 96, borderRadius: 6 }} />
    <div className="skeleton" style={{ height: 32, width: 80, borderRadius: 6 }} />
    <div className="skeleton" style={{ height: 10, width: 64, borderRadius: 6 }} />
  </div>
);

/* ── AI Chat Message ── */
interface ChatMsg { role: 'user' | 'assistant'; text: string }

/* ── Page ── */
export const DashboardPage: React.FC = () => {
  const { stats, isLoading } = useLeadStats();
  const { user } = useAuthStore();

  /* AI Chat state */
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { role: 'assistant', text: 'Hi! Ask me anything about your leads pipeline.' },
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs]);

  const handleAiSend = async () => {
    const msg = chatInput.trim();
    if (!msg || aiLoading) return;
    setChatInput('');
    setChatMsgs((prev) => [...prev, { role: 'user', text: msg }]);
    setAiLoading(true);
    try {
      const context = stats
        ? `Total leads: ${stats.total}. Status breakdown: ${(stats.byStatus ?? []).map((s) => `${s._id}: ${s.count}`).join(', ')}. Sources: ${(stats.bySource ?? []).map((s) => `${s._id}: ${s.count}`).join(', ')}.`
        : undefined;
      const res = await aiApi.chat(msg, context);
      setChatMsgs((prev) => [...prev, { role: 'assistant', text: res.data?.reply ?? 'No response received.' }]);
    } catch {
      setChatMsgs((prev) => [...prev, { role: 'assistant', text: 'Sorry, I could not connect to the AI service right now.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const getCount = (items: { _id: string; count: number }[], key: string) =>
    items?.find((i) => i._id === key)?.count ?? 0;

  const total = stats?.total ?? 0;
  const qualifiedCount = getCount(stats?.byStatus ?? [], 'Qualified');
  const conversionPct = total > 0 ? Math.round((qualifiedCount / total) * 100) : 0;

  const greetHour = new Date().getHours();
  const greeting = greetHour < 12 ? 'Good morning' : greetHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`${greeting}, ${user?.name?.split(' ')[0] ?? 'there'} — Here's your pipeline overview`}
    >
      {/* ── Stat Cards ── */}
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {isLoading ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <StatCard title="Total Leads" value={total} icon={<Users className="w-5 h-5" />} iconBg="#eff6ff" iconColor="#3b82f6" trend="+12.5%" trendUp subtitle="All pipeline leads" />
            <StatCard title="Qualified" value={qualifiedCount} icon={<CheckCircle2 className="w-5 h-5" />} iconBg="#f0fdf4" iconColor="#22c55e" trend="+8.4%" trendUp subtitle="High-value leads" />
            <StatCard title="Contacted" value={getCount(stats?.byStatus ?? [], 'Contacted')} icon={<Phone className="w-5 h-5" />} iconBg="#fffbeb" iconColor="#f59e0b" trend="+16.2%" trendUp subtitle="In progress" />
            <StatCard title="Lost" value={getCount(stats?.byStatus ?? [], 'Lost')} icon={<XCircle className="w-5 h-5" />} iconBg="#fef2f2" iconColor="#ef4444" trend="-4.0%" trendUp={false} subtitle="Closed-lost" />
          </>
        )}
      </motion.div>

      {/* ── Middle Row: Pipeline + AI ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 24 }}>
        {/* Pipeline Status */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Pipeline Status</h3>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpRight className="w-3.5 h-3.5" /> View leads
            </button>
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 12, borderRadius: 6 }} />)}
            </div>
          ) : (
            <>
              <ProgressRow label="New" count={getCount(stats?.byStatus ?? [], 'New')} total={total} color="#3b82f6" dotColor="#3b82f6" />
              <ProgressRow label="Contacted" count={getCount(stats?.byStatus ?? [], 'Contacted')} total={total} color="#f59e0b" dotColor="#f59e0b" />
              <ProgressRow label="Qualified" count={getCount(stats?.byStatus ?? [], 'Qualified')} total={total} color="#22c55e" dotColor="#22c55e" />
              <ProgressRow label="Lost" count={getCount(stats?.byStatus ?? [], 'Lost')} total={total} color="#ef4444" dotColor="#ef4444" />
            </>
          )}
        </motion.div>

        {/* AI Assistant — Live with Groq */}
        <motion.div
          className="card"
          style={{ display: 'flex', flexDirection: 'column', height: 300 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--outline)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--on-surface)', flex: 1 }}>AI Assistant</h3>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 9999, background: '#f0fdf4', color: '#16a34a', fontWeight: 600 }}>Live</span>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }} className="scrollbar-thin">
            {chatMsgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <div style={{
                  maxWidth: '85%', padding: '8px 12px', borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'var(--surface-low)',
                  color: m.role === 'user' ? '#fff' : 'var(--on-surface)',
                  fontSize: 12.5, lineHeight: 1.5,
                }}>
                  {m.text}
                </div>
              </motion.div>
            ))}
            {aiLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '8px 12px', borderRadius: '12px 12px 12px 2px', background: 'var(--surface-low)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 12, color: 'var(--on-surface-muted)' }}>Thinking…</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--outline)', display: 'flex', gap: 8 }}>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAiSend()}
              placeholder="Ask about your pipeline…"
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--outline)',
                background: 'var(--surface-low)', color: 'var(--on-surface)', fontSize: 12.5,
                fontFamily: 'inherit', outline: 'none',
              }}
            />
            <motion.button
              onClick={handleAiSend}
              disabled={!chatInput.trim() || aiLoading}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              style={{
                width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: chatInput.trim() && !aiLoading ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'var(--surface-container)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 200ms', flexShrink: 0,
              }}
            >
              <SendHorizontal className="w-3.5 h-3.5" style={{ color: chatInput.trim() && !aiLoading ? '#fff' : 'var(--on-surface-muted)' }} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row: Sources + Conversion ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Sources */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <PieChart className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Leads by Source</h3>
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skeleton" style={{ height: 10, width: 96, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 8, borderRadius: 9999 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <SourceRow icon={<Globe className="w-4 h-4 text-purple-600" />} iconBg="#faf5ff" label="Website" count={getCount(stats?.bySource ?? [], 'Website')} total={total} color="#a855f7" />
              <SourceRow icon={<Smartphone className="w-4 h-4 text-pink-600" />} iconBg="#fdf2f8" label="Instagram" count={getCount(stats?.bySource ?? [], 'Instagram')} total={total} color="#ec4899" />
              <SourceRow icon={<UserCheck className="w-4 h-4 text-teal-600" />} iconBg="#f0fdfa" label="Referral" count={getCount(stats?.bySource ?? [], 'Referral')} total={total} color="#14b8a6" />
            </div>
          )}
        </motion.div>

        {/* Conversion Rate */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Activity className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Conversion Rate</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
            <motion.div
              style={{
                width: 120, height: 120, borderRadius: '50%',
                background: `conic-gradient(#22c55e ${conversionPct * 3.6}deg, var(--surface-container) 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
            >
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--surface-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <motion.span
                  style={{ fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {conversionPct}%
                </motion.span>
              </div>
            </motion.div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 4 }}>Qualified conversion</p>
            <p style={{ fontSize: 12, color: 'var(--on-surface-muted)' }}>{qualifiedCount} of {total} total leads</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
