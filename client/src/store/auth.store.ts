// ─────────────────────────────────────────────────────────────────────────────
// src/store/auth.store.ts – Zustand auth store
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, token) => {
        localStorage.setItem('sld_token', token);
        set({ user, token, isAuthenticated: true, isLoading: false });
      },

      clearAuth: () => {
        localStorage.removeItem('sld_token');
        localStorage.removeItem('sld_user');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'sld_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
