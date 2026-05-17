// src/pages/LoginPage.tsx — Animated auth page

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await authApi.login(values);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--surface)' }}>
      {/* Left — Branding Panel */}
      <motion.div
        className="hidden-mobile"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e293b 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 48,
          position: 'relative',
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Background decorations */}
        <motion.div
          style={{
            position: 'absolute', top: -100, right: -100,
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{
            position: 'absolute', bottom: -50, left: -50,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,.1) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo className="w-16 h-16 mx-auto mb-6" />
          </motion.div>
          <motion.h2
            style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 12, letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            GigFlow – Smart Leads
          </motion.h2>
          <motion.p
            style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
          >
            AI-powered lead management platform for modern sales teams. Track, nurture, and convert leads effortlessly.
          </motion.p>
        </div>
      </motion.div>

      {/* Right — Form Panel */}
      <motion.div
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full max-w-md">
          <motion.div
            style={{ marginBottom: 36 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: 'var(--on-surface-muted)' }}>
              Sign in to your GigFlow account
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              required
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              Sign In
            </Button>
          </motion.form>

          <motion.p
            className="text-center text-sm mt-8"
            style={{ color: 'var(--on-surface-muted)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
              className="hover:underline"
            >
              Create one
            </Link>
          </motion.p>

          {/* Demo credentials */}
          <motion.div
            style={{
              marginTop: 20, padding: '12px 16px', borderRadius: 'var(--radius-sm)',
              background: '#fffbeb', border: '1px solid #fef3c7',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p style={{ fontSize: 12, color: '#92400e', textAlign: 'center' }}>
              💡 <strong>Demo:</strong> admin@demo.com / password123 · sales@demo.com / password123
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
