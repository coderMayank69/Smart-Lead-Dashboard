// src/pages/RegisterPage.tsx — Shopeers-inspired registration

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const res = await authApi.register(values);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success('Account created! Welcome aboard 🎉');
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--surface)',
    }}>
      {/* Left — Branding */}
      <div
        className="hidden-mobile"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e293b 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: 48, position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          <Logo className="w-16 h-16 mx-auto mb-6" />
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 12, letterSpacing: '-0.02em' }}>
            Join Smart Leads
          </h2>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>
            Start managing your sales pipeline with powerful analytics and AI-driven insights.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32,
      }}>
        <div className="w-full max-w-md animate-scale-in">
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: 'var(--on-surface-muted)' }}>
              Get started with Smart Leads in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              required
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />

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
              placeholder="Minimum 6 characters"
              required
              autoComplete="new-password"
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
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: 'var(--on-surface-muted)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
              className="hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
